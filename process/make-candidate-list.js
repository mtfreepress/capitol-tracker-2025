// combines major race and legislative candidate lists into single data file for search function
const fs = require('fs')
const getJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const filterToSummaryFields = c => ({
    // Include only fields necessary for summary page
    slug: c.slug,
    path: c.path,
    displayName: c.displayName,
    summaryLine: c.summaryLine,
    race: c.raceDisplayName,
    party: c.party,
    status: c.status,
    hasResponses: c.questionnaire.hasResponses,
    numMTFParticles: c.coverage.length,
    cap_tracker_2023_link: c.cap_tracker_2023_link || null,
})


const majorRaceCandidates = getJson('./src/data/candidates.json')
const legislativeCandidates = getJson('./src/data/legislative-candidates.json')

majorRaceCandidates.forEach(d => d.path = 'candidates')
legislativeCandidates.forEach(d => d.path = 'legislature')

const allCandidates = majorRaceCandidates.concat(legislativeCandidates)
    .map(filterToSummaryFields)

writeJson('./src/data/all-candidate-summary.json', allCandidates)



