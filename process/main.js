import { getJson, collectJsons, writeJson, getYaml, collectYamls, getText, getCsv } from './utils.js'

import Lawmaker from './models/Lawmaker.js'
import Bill from './models/Bill.js'
// import Committee from './models/Committee.js'

import Article from './models/MTFPArticle.js'
import VotingAnalysis from './models/VotingAnalysis.js'

import CalendarPage from './models/CalendarPage.js'
import RecapPage from './models/RecapPage.js'
import HousePage from './models/HousePage.js'
import SenatePage from './models/SenatePage.js'
import GovernorPage from './models/GovernorPage.js'

const updateTime = new Date()

/*
### LOAD INPUTS
Approach here — each of these input buckets has a fetch script that needs to be run independently to update their contents
*/

// Inputs from official bill tracking system
const billsRaw = collectJsons('./inputs/bills/*/*-data.json')
const actionsRaw = collectJsons('./inputs/bills/*/*-actions.json')
const actionsFlat = Array.isArray(actionsRaw) && actionsRaw.some(Array.isArray) ? actionsRaw.flat() : actionsRaw;
// sort actionsFlat by bill identifier alphabetically
actionsFlat.sort((a, b) => a.bill.localeCompare(b.bill));

const districtsRaw = getJson('./inputs/districts/districts-2025.json')
const lawmakersRaw = getJson('./inputs/lawmakers/legislator-roster-2025.json')
// const committeesRaw = await getCsv('./inputs/committees/committees.csv')

// Legislative article list from Montana Free Press CMS
const articlesRaw = getJson('./inputs/coverage/articles.json')

// Annotations from YAML and MD files (can also use CSVs in future here)
const billAnnotations = collectYamls('./inputs/annotations/bills/*.yml')
const lawmakerAnnotations = collectYamls('./inputs/annotations/lawmakers/*.yml')
const processNotes = getYaml('./inputs/annotations/process-notes.yml')

// Text content
const homePageTopper = getText('./inputs/annotations/pages/home.md')
const housePageTopper = getText('./inputs/annotations/pages/house.md')
const senatePageTopper = getText('./inputs/annotations/pages/senate.md')
const governorPageTopper = getText('./inputs/annotations/pages/governor.md')
const participationPageContent = getText('./inputs/annotations/pages/participation.md')
const contactUsComponentText = getText('./inputs/annotations/components/about.md')

/* 
### DATA BUNDLING + WRANGLING
*/

const articles = articlesRaw.map(article => new Article({ article }).export())

// actionsFlat.forEach(action => {
//     // Apply special House blast motion rule
//     if (action.vote && 
//         action.vote.voteChamber === "house" && 
//         action.vote.motion === "Taken from Committee; Placed on 2nd Reading" && 
//         action.vote.count.Y < 55) {
      
//       // Force override to false if it doesn't meet the 55-vote requirement
//       action.vote.motionPassed = false;
//     }
//   });

/// do lawmakers first, then bills
const lawmakers = lawmakersRaw.map(lawmaker => new Lawmaker({
    lawmaker,
    district: districtsRaw.find(d => d.key === lawmaker.district),
    annotation: lawmakerAnnotations.find(d => d.slug === lawmaker.name.replace(/\s/g, '-').toLowerCase()) || {},
    articles: articles.filter(d => d.lawmakerTags.includes(lawmaker.name)),
    // leave sponsoredBills until after bills objects are created
    // same with keyVotes
}))

const bills = billsRaw.map(bill => new Bill({
    bill,
    actions: actionsFlat.filter(d => d.bill === bill.key),
    votes: actionsFlat.filter(d => d.vote && d.vote.bill === bill.key).map(d => d.vote),
    annotation: billAnnotations.find(d => d.Identifier === bill.key) || {},
    articles: articles.filter(d => d.billTags.includes(bill.key)),
}))

const votes = bills.map(bill => bill.exportVoteData()).flat()


const houseFloorVotes = votes.filter(v => v.voteLocation === 'floor' && v.voteChamber === 'house')
const senateFloorVotes = votes.filter(v => v.voteLocation === 'floor' && v.voteChamber === 'senate')
const houseFloorVoteAnalysis = new VotingAnalysis({ votes: houseFloorVotes })
const senateFloorVoteAnalysis = new VotingAnalysis({ votes: senateFloorVotes })

// const committees = committeesRaw
//     .filter(d => ![
//         'conference',
//         'select',
//         'procedural',
//         // 'fiscal-sub'
//     ].includes(d.type))
//     .map(schema => new Committee({
//         schema,
//         committeeBills: bills.filter(b => b.committees.includes(schema.displayName)),
//         lawmakers: lawmakers.filter(l => l.data.committees.map(d => d.committee).includes(schema.name)), // Cleaner to do this backwards -- assign lawmakers based on committee data?
//         updateTime
//     }))

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

// So we have the data about the "scheduled floor/final vote"
const allActions = bills.flatMap(bill => bill.actions);
const calendarOutput = new CalendarPage({ actions: allActions, bills, updateTime }).export();
bills.forEach(bill => bill.data.isOnCalendar = calendarOutput.billsOnCalendar.includes(bill.data.identifier))
// Manual handling for house blast motions and their 55 vote majority requirement 
// Senate is bare majority for 2025 session
bills.forEach(bill => {
    bill.actions.forEach(action => {
      const actionData = action.data;
      if (action.vote && 
          actionData.billHolder === 'house' && 
          actionData.description === 'Taken from Committee; Placed on 2nd Reading' && 
          action.vote.data.count.Y < 55) {
        
        // console.log(`Fixing House blast motion for ${bill.identifier}: ${actionData.id}`);
        // Force override to enforce 55-vote constitutional majority requirement
        action.vote.data.motionPassed = false;
      }
    });
  });
  
// const recapOutput = new RecapPage({ actions: actionsFlat, bills, updateTime }).export()

const keyBillCategoryKeys = Array.from(new Set(billAnnotations.map(d => d.category))).filter(d => d !== null).filter(d => d !== undefined)
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
    aboveFoldText: homePageTopper,
}

const housePageOutput = new HousePage({
    text: housePageTopper,
    lawmakers,
}).export()
const senatePageOutput = new SenatePage({
    text: senatePageTopper,
    lawmakers,
}).export()
const governorPageOutput = new GovernorPage({
    text: governorPageTopper,
    articles: articles.filter(article => article.governorTags.includes('Greg Gianforte'))
}).export()
const participationPageOutput = {
    text: participationPageContent
}
const contactComponentOutput = {
    text: contactUsComponentText
}



/* 
### OUTPUTS 
*/
console.log('\n### Bundling tracker data')

const billsOutput = bills.map(b => b.exportBillDataOnly())
const actionsOutput = bills.map(b => ({
    bill: b.data.identifier,
    actions: b.exportActionDataWithVotes()
}))

// Breaking this into chunks to avoid too-large-for-github-files
const chunkSize = 200
let index = 1
for (let start = 0; start < actionsOutput.length; start += chunkSize) {
    writeJson(`./src/data/bill-actions-${index}.json`, actionsOutput.slice(start, start + chunkSize))
    index += 1
}

writeJson('./src/data/bills.json', billsOutput)

const lawmakerOutput = lawmakers.map(l => l.exportMerged())
writeJson('./src/data/lawmakers.json', lawmakerOutput)
// const committeeOutput = committees.map(l => l.export())
// writeJson('./src/data/committees.json', committeeOutput)

writeJson('./src/data/header.json', headerOutput)
writeJson('./src/data/articles.json', articles)
writeJson('./src/data/process-annotations.json', processNotes)
writeJson('./src/data/bill-categories.json', keyBillCategoryList)
writeJson('./src/data/calendar.json', calendarOutput)
// writeJson('./src/data/recap.json', recapOutput)
// writeJson('./src/data/participation.json', participationPageOutput)
writeJson('./src/data/contact.json', contactComponentOutput)
writeJson('./src/data/house.json', housePageOutput)
writeJson('./src/data/senate.json', senatePageOutput)
writeJson('./src/data/governor.json', governorPageOutput)