import { getJson, writeJson } from './utils.js'

import Lawmaker from './models/Lawmaker.js'
import Bill from './models/Bill.js'
import Committee from './models/Committee.js'

import Article from './models/MTFPArticle.js'
import VotingAnalysis from './models/VotingAnalysis.js'

import CalendarPage from './models/CalendarPage.js'
import RecapPage from './models/RecapPage.js'
import HousePage from './models/HousePage.js'
import SenatePage from './models/SenatePage.js'
import GovernorPage from './models/GovernorPage.js'

import { COMMITTEES } from './config/committees.js'

const updateTime = new Date()
/*
Approach here — each of these input buckets has a fetch script that needs to be run independently to update their contents
*/

// LAWS scraper inputs
const billsRaw = getJson('./inputs/laws/bills.json')
const actionsRaw = getJson('./inputs/laws/actions.json')
const votesRaw = getJson('./inputs/laws/votes.json')


const districtsRaw = await getCsv('./inputs/districts/districts-2025.json')
const lawmakersRaw = getJson('./inputs/lawmakers/leg-roster-2025.json')

// Legislative article list from Montana Free Press CMS
const articlesRaw = getJson('./inputs/coverage/articles.json')

// // List of hearing/floor recordings and associated pages in the third-party Council Data Project system
// const recordings = getJson('./inputs/hearing-transcripts/recordings.json')
const recordings = [] // Won't have these for 2025

// Bill annotations from standalone Strapi CMS
// TODO - replace these with YAML/CSV/MD files we can edit in the repo
// Model after /content input flow in 2024 Election Guide
const billAnnotations = getJson('./inputs/annotations/old-bill-annotations.json')
const lawmakerAnnotations = getJson('./inputs/annotations/old-lawmaker-annotations.json')
const processAnnotations = getJson('./inputs/annotations/old-process-annotations.json')
const guideText = getJson('./inputs/annotations/old-guide-text.json')

const articles = articlesRaw.map(article => new Article({ article }).export())

/// do lawmakers first, then bills
const lawmakers = lawmakersRaw.map(lawmaker => new Lawmaker({
    lawmaker,
    district: districtsRaw.find(d => d.key === lawmaker.district),
    annotation: lawmakerAnnotations.find(d => d.Name === lawmaker.name) || {}, // Unwired currently
    articles: articles.filter(d => d.lawmakerTags.includes(lawmaker.name)),
    // leave sponsoredBills until after bills objects are created
    // same with keyVotes
}))

const bills = billsRaw.map(bill => new Bill({
    bill,
    actions: actionsRaw.filter(d => d.bill === bill.key).map(a => {
        const match = recordings.find(d => a.recordings.includes(d.external_source_id))
        let transcriptUrl = null
        if (match) {
            transcriptUrl = `https://www.openmontana.org/montana-legislature-council-data-project/#/events/${match.event_id}`
        }
        return {
            ...a,
            transcriptUrl,
        }
    }),
    votes: votesRaw.filter(d => d.bill === bill.key),
    annotation: billAnnotations.find(d => d.Identifier === bill.key) || {},
    articles: articles.filter(d => d.billTags.includes(bill.key)),
}))

const actions = bills.map(bill => bill.exportActionData()).flat()
const votes = bills.map(bill => bill.exportVoteData()).flat()

const houseFloorVotes = votes.filter(v => v.type === 'floor' && v.voteChamber === 'house')
const senateFloorVotes = votes.filter(v => v.type === 'floor' && v.voteChamber === 'senate')
const houseFloorVoteAnalysis = new VotingAnalysis({ votes: houseFloorVotes })
const senateFloorVoteAnalysis = new VotingAnalysis({ votes: senateFloorVotes })

const committees = COMMITTEES
    .filter(d => ![
        'conference',
        'select',
        'procedural',
        // 'fiscal-sub'
    ].includes(d.type))
    .map(schema => new Committee({
        schema,
        committeeBills: bills.filter(b => b.committees.includes(schema.name)),
        // billActions: actions.filter(a => a.committee === schema.name),
        lawmakers: lawmakers.filter(l => l.data.committees.map(d => d.committee).includes(schema.name)),
        updateTime
    }))

// Calculations that need both lawmakers and bills populated
lawmakers.forEach(lawmaker => {
    lawmaker.addSponsoredBills({
        sponsoredBills: bills.filter(bill => bill.sponsor === lawmaker.name)
    })
    lawmaker.addKeyBillVotes({
        name: lawmaker.name,
        keyBills: bills.filter(bill => bill.data.isMajorBill)
    })
    // TODO - Add last vote on key bills
    if (lawmaker.data.chamber === 'house') {
        lawmaker.votingSummary = houseFloorVoteAnalysis.getLawmakerStats(lawmaker.name)
    } else if (lawmaker.data.chamber === 'senate') {
        lawmaker.votingSummary = senateFloorVoteAnalysis.getLawmakerStats(lawmaker.name)
    }
})

// As of Dec. 2024 Eric can't remember why he thought this summaryRoster was necessary
// Maybe to avoid circular logic somewhere in the data model creation logic?
// In 2023, this code stub output this once so it could be a static input
// const summaryRoster = lawmakers.map(d => {
//     return {
//         title: d.data.title,
//         name: d.data.name,
//         lastName: d.data.name,
//         party: d.data.party,
//         locale: d.data.locale_short || '',
//         district: d.data.district,
//         active: d.data.isActive,
//     }
// })
// writeJson('./process/config/lawmaker-roster-2023.json', summaryRoster)


const calendarOutput = new CalendarPage({ actions, bills, updateTime }).export()
bills.forEach(bill => bill.data.isOnCalendar = calendarOutput.billsOnCalendar.includes(bill.data.identifier))
const recapOutput = new RecapPage({ actions, bills, updateTime }).export()

const keyBillCategoryKeys = Array.from(new Set(billAnnotations.map(d => d.category))).filter(d => d !== null)
const keyBillCategoryList = keyBillCategoryKeys.map(category => {
    const match = billAnnotations.find(d => d.category === category)
    return {
        category,
        description: match.categoryDescription,
        order: match.categoryOrder,
        show: match.showCategory,
    }
})
const headerOutput = { updateTime }

const overviewPageOutput = {
    aboveFoldText: guideText.HomePageAboveTheFold,
    // TODO figure out what else needs to be in here
}
const housePageOutput = new HousePage({
    text: guideText.HousePageText
}).export()
const senatePageOutput = new SenatePage({
    text: guideText.SenatePageText
}).export()
const governorPageOutput = new GovernorPage({
    text: guideText.GovernorPageText,
    articles: articles.filter(article => article.governorTags.includes('Greg Gianforte'))
}).export()
const participationPageOutput = {
    text: guideText.ParticipationPage
}



// Outputs 
console.log('### Bundling tracker data')
/*
Exporting bill actions separately here so they can be kept outside of Gatsby graphql scope
*/
const billsOutput = bills.map(b => b.exportBillDataOnly())
const actionsOutput = bills.map(b => ({
    bill: b.data.identifier,
    actions: b.exportActionDataWithVotes()
}))
// segment actionsOutput

writeJson('./app/src/data-nodes/bills.json', billsOutput)

// Breaking this into chunks to avoid too-large-for-github-files
const chunkSize = 200
let index = 1
for (let start = 0; start < actionsOutput.length; start += chunkSize) {
    writeJson(`./app/src/data/bill-actions-${index}.json`, actionsOutput.slice(start, start + chunkSize))
    index += 1
}

const lawmakerOutput = lawmakers.map(l => l.exportMerged())
writeJson('./app/src/data-nodes/lawmakers.json', lawmakerOutput)
const committeeOutput = committees.map(l => l.export())
writeJson('./app/src/data-nodes/committees.json', committeeOutput)

writeJson('./app/src/data/header.json', headerOutput)
writeJson('./app/src/data/articles.json', articles)
writeJson('./app/src/data/process-annotations.json', processAnnotations)
writeJson('./app/src/data/bill-categories.json', keyBillCategoryList)
writeJson('./app/src/data/calendar.json', calendarOutput)
writeJson('./app/src/data/recap.json', recapOutput)
writeJson('./app/src/data/participation.json', participationPageOutput)
writeJson('./app/src/data/house.json', housePageOutput)
writeJson('./app/src/data/senate.json', senatePageOutput)
writeJson('./app/src/data/governor.json', governorPageOutput)


