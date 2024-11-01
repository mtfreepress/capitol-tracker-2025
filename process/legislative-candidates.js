const fs = require('fs')
const csv = require('async-csv')
const getJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const getCsv = async (path) => {
    const string = fs.readFileSync(path, 'utf-8')
    return csv.parse(string, {
        bom: true,
        columns: true,
        relax_column_count: true,
    })
}

const urlize = str => str.toLowerCase().replaceAll(/\s/g, '-')

const NAME_REPLACE = {
    'JODEE MACDONALD ETCHART': 'JODEE ETCHART',
    'JAMES G WHITAKER (WRITE-IN)': 'JAMES G WHITAKER',
    'KATHY HOILAND (WRITE-IN)': 'KATHY HOILAND',
    'RAE PEPPERS (WRITE-IN)': 'RAE PEPPERS',
    'KELLY DURBIN-WILLIAMS': 'KELLEY DURBIN-WILLIAMS',
    'ADAM HENSON': 'ADAM S HENSON',
}

const LEGE_QUESTIONS = [
    'Question 1: \n Please briefly provide the following information: place (town or county and state) of birth, age as of election day 2024, place (town or county) of permanent residency, occupation/employer, and education. How do these things and your other life experiences qualify you to be an effective legislator?',
    'Question 2:\n What do you consider to be the most pressing issues facing Montana heading into the 2025 session and what legislation would you propose and/or support to address these issues?',
    'Question 3:  \nMany Montanans are concerned about rising residential property taxes, which primarily fund local government services such as schools, counties and city/town programs but are calculated through a system set by the Legislature. What changes to the state tax system, if any, would you support to provide property tax relief while maintaining sufficient revenue for essential services?',
    'Question 4:  \nConsidering the state’s role in mental and physical health care services, especially in helping cover the costs of services available to lower-income Montanans, what additional steps, if any, do you believe the Legislature should take to enhance health care access and promote Montanans’ health?',
    'Question 5:  \nMany education leaders are concerned that the state’s existing school funding formula isn’t keeping up with the costs of educating students. What proposals, if any, would you support to ensure adequate and sustainable long-term funding is available for public pre-K–12, college/university, and vocational education programs?',
]

const PARTY_ORDER = ['R', 'D', 'L', 'G', 'I']


const MANUAL_ADD_INDEPENDENT_CANDIDATES = [
    {
        'Status': 'FILED',
        'Name': 'KELLEY DURBIN-WILLIAMS',
        'District Type': 'Senate',
        'District': 'SENATE DISTRICT 45',
        'Party Preference': 'IND',
    },
    {
        'Status': 'FILED',
        'Name': 'JANNA HAFER',
        'District Type': 'House',
        'District': 'HOUSE DISTRICT 51',
        'Party Preference': 'IND',
    },
]
const MANUAL_ADD_REPLACEMENT_CANDIDATES = [
    // TODO
    {
        'Status': 'FILED',
        'Name': 'BRAD SIMONIS',
        'District Type': 'House',
        'District': 'HOUSE DISTRICT 2',
        'Party Preference': 'DEM',
    },
    {
        'Status': 'FILED',
        'Name': 'DAVID PASSIERI	',
        'District Type': 'House',
        'District': 'HOUSE DISTRICT 91',
        'Party Preference': 'REP',
    },
    {
        'Status': 'FILED',
        'Name': 'ADAM S HENSON',
        'District Type': 'House',
        'District': 'HOUSE DISTRICT 94',
        'Party Preference': 'REP',
    },
]
const MANUAL_POST_PRIMARY_DROPOUTS = [
    // TODO - list of names to have status manualy changed
    // Correspond to replacement candidates
    'ELIZABETH STORY', // HD 2 dropout
    'JOE READ', // HD 91 dropout
    'DELANEY MALMSTEN' // HD 94 dropout
]

async function main() {
    let candidates = await getCsv('./inputs/filings/CandidateList.csv',) // Includes manually added independent candidates
    const candidateAnnotations = await getCsv('./inputs/content/lege-candidate-annotations.csv',)
    const legeDistricts = await getCsv('./inputs/legislative-districts/districts.csv',)
    const legeQuestionsPrePrimary = await getCsv('./inputs/lvw-questionnaire/pre-primary-lwvmt24-races.csv',)
    const legeQuestionsPostPrimary = await getCsv('./inputs/lvw-questionnaire/lwvmt24-races.csv',)
    const coverage = getJson('./inputs/coverage/articles.json')
    const primaryResultListing = getJson('./inputs/results/cleaned/2024-primary-legislative.json')

    // merging legeQuestions because post-primary updates from LWV don't 
    // include candidates that lost their primaries
    const mergedQuestionnaireCandidateList = Array.from(new Set(
        legeQuestionsPrePrimary.concat(legeQuestionsPostPrimary)
    ))
        .filter(d => d['Race/Referendum'].includes('MONTANA SENATE') || d['Race/Referendum'].includes('MONTANA HOUSE'))
        .map(d => d['Full Name'])
    const legeQuestions = mergedQuestionnaireCandidateList.map(name => {
        // pull from postPrimary questionnaire first, then fall back to prePrimary 
        const postPrimaryMatch = legeQuestionsPostPrimary.find(d => d['Full Name'] === name)
        const prePrimaryMarch = legeQuestionsPrePrimary.find(d => d['Full Name'] === name)
        if (postPrimaryMatch) return postPrimaryMatch
        return prePrimaryMarch
    })

    // cleaning
    candidates = candidates.concat(MANUAL_ADD_INDEPENDENT_CANDIDATES)
    candidates = candidates.concat(MANUAL_ADD_REPLACEMENT_CANDIDATES)
    candidates.forEach(d => {
        d.Name = d.Name.trim()
        d.Name = NAME_REPLACE[d.Name] || d.Name
        d.slug = urlize(d.Name)
        d.raceSlug = d.District.replace('SENATE DISTRICT ', 'SD-').replace('HOUSE DISTRICT ', 'HD-')
    })
    const legislativeCandidates = candidates
        .filter(d => d.Status === 'FILED')
        .filter(d => ['Senate', 'House'].includes(d['District Type']))

    // cleaning
    legeDistricts.forEach(d => {
        d.districtKey = d.district.replace('HD ', 'HD-').replace('SD ', 'SD-')
    })

    // cleaning
    legeQuestions.forEach(d => {
        if (Object.keys(NAME_REPLACE).includes(d['Full Name'])) {
            d['Full Name'] = NAME_REPLACE[d['Full Name']]
        }
    })

    // Check for mis-matches matches
    const legeNames = legislativeCandidates.map(d => d.Name)

    const questionNames = legeQuestions.map(d => d['Full Name'])
    const namesMissingInQuestionData = legeNames.filter(d => !questionNames.includes(d))
    const namesMissingInFilingData = questionNames.filter(d => !legeNames.includes(d))

    console.log('Legislative Questionnaire merge check', {
        namesMissingInQuestionData,
        namesMissingInFilingData
    })

    // merging
    const candidateOutput = legislativeCandidates.map(l => {

        // TODO - add website/social merge in here
        // Later self amendment - Not happening in 2024

        // Annotations
        const annotationMatch = candidateAnnotations.find(d => d.name === l.Name)
        if (!annotationMatch) throw `Error: Missing annotation for ${l.Name}`

        // District
        const districtMatch = legeDistricts.find(d => l.raceSlug === d.districtKey)
        if (!districtMatch) throw `Error: Missing district for ${l.raceSlug}`
        const district = {
            id: districtMatch.district,
            region: districtMatch.region,
            counties: districtMatch.counties,
            locale: districtMatch.locale,
            in_cycle_2024: districtMatch.in_cycle_2024 === 'yes',
            holdover_senator: districtMatch.holdover_senator || null,
            holdover_party: districtMatch.holdover_party || null,
            holdover_link: districtMatch.holdover_link || null,
        }
        // Questionnaire
        const questionnaireMatch = legeQuestions.find(d => d['Full Name'] === l.Name)
        if (!questionnaireMatch) console.log(`Warning: Missing questionnaire data row for ${l.Name}`)
        const hasResponses = questionnaireMatch && ((questionnaireMatch[LEGE_QUESTIONS[0]] !== '')
            || (questionnaireMatch[LEGE_QUESTIONS[1]] !== '')) // True if there's an answer to either Q1 or Q2
        const questionnaire = {
            race: questionnaireMatch && questionnaireMatch['Race/Referendum']
                .replace('MONTANA HOUSE DISTRICT ', 'HD-')
                .replace('MONTANA SENATE DISTRICT ', 'SD-') || null,
            name: l.slug,
            hasResponses,
            responses: questionnaireMatch ? LEGE_QUESTIONS.map(question => ({
                question: question.replace(/Question \d\:\s*\n/, '').replaceAll('  ', ' ').trim(),
                answer: questionnaireMatch[question].replaceAll('  ', ' '),
            })) : [],


        }

        // Coverage
        const candidateCoverage = coverage
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .filter(article => article.tags.map(urlize).includes(l.slug))

        // Primary election results
        const primaryResults = {
            race: l.raceSlug,
            raceDisplayName: l.displayName,
            party: l.party,
            resultsTotal: null, // fallback
            ...primaryResultListing.find(d => d.race === l.raceSlug && d.party === l['Party Preference'][0])
        }
        // Determine candidate status
        let candidatePrimaryResult = primaryResultListing.map(d => d.resultsTotal).flat()
            .find(d => d.candidate === l.Name)
        if (!candidatePrimaryResult) {
            // console.log('Missing primary result for', l.Name)
            // Fallback for Libertarian candidates w/ no primary in 2024
            // Also for candidates who were post-primary replacements
            candidatePrimaryResult = { isWinner: true }
        }

        // Determine current candidate status
        let status = 'active'
        if (!candidatePrimaryResult.isWinner) status = 'lost-primary'
        if (MANUAL_POST_PRIMARY_DROPOUTS.includes(l.Name)) status = 'withdrawn'

        return {
            raceSlug: l.raceSlug,
            raceDisplayName: l.raceSlug.replace('HD-', 'House District ').replace('SD-', 'Senate District '),

            slug: l.slug,
            displayName: l.Name,
            lastName: 'TK_LAST', // TODO - via annotations workflow
            status,

            party: l['Party Preference'][0],
            summaryLine: null, // none for legislative candidates
            summaryNarrative: null, // none for legislative candidates

            isIncumbent: false, // False for all 2024 lege candidates because of redistricting
            cap_tracker_2023_link: annotationMatch.cap_tracker_2023_link || null,

            campaignWebsite: questionnaireMatch && questionnaireMatch['Campaign Website'] || null,
            campaignFB: questionnaireMatch && questionnaireMatch['Campaign Facebook URL'] || null,
            campaignTW: questionnaireMatch && questionnaireMatch['Campaign Twitter Handle'] || null,
            campaignIG: questionnaireMatch && questionnaireMatch['Campaign Instagram URL'] || null,
            campaignYT: questionnaireMatch && questionnaireMatch['Campaign YouTube URL'] || null,
            campaignTT: null, // Not available from 2024 LWV questionnaire

            district,
            questionnaire,
            coverage: candidateCoverage,
            primaryResults,
        }

    })
    candidateOutput.forEach(c => {
        c.opponents = candidateOutput
            .filter(d => d.raceSlug === c.raceSlug)
            .filter(d => d.status === 'active')
            .map(d => ({
                slug: d.slug,
                displayName: d.displayName,
                summaryLine: null, // Not populated for lege candidates
                party: d.party,
            }))
    })

    const districtOutput = legeDistricts.map(district => {
        const matchingCandidates = candidateOutput
            .filter(c => c.raceSlug === district.districtKey)
            .map(c => ({

                // filter to fields necessary for summary info here
                slug: c.slug,
                displayName: c.displayName,
                party: c.party,
                status: c.status,
                cap_tracker_2023_link: c.cap_tracker_2023_link, // flags for current lawmker
                hasResponses: c.questionnaire && c.questionnaire.hasResponses,
                numMTFParticles: c.coverage.length,
            }))
        return {
            ...district,
            candidates: matchingCandidates
                .sort((a, b) => PARTY_ORDER.indexOf(a.party) - PARTY_ORDER.indexOf(b.party))
        }
    })

    console.log(candidateOutput.length, 'candidates')
    console.log(candidateOutput.filter(d => d.questionnaire.hasResponses).length, 'responded to questionnaire')
    writeJson('./src/data/legislative-candidates.json', candidateOutput)
    writeJson('./src/data/legislative-districts.json', districtOutput)
}

main()