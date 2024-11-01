const fs = require('fs')
const reader = require('xlsx')

const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const PATH_STATEWIDE = './inputs/results/raw/2024_06_10_primary-statewide.xlsx'
const PATH_LEGISLATIVE = './inputs/results/raw/2024_06_10_primary-legislative.xlsx'

const STATEWIDE_RACES_TO_INCLUDE = {
    'UNITED STATES SENATOR': 'us-senate',
    'US REPRESENTATIVE DIST 1': 'us-house-1',
    'US REPRESENTATIVE DIST 2': 'us-house-2',
    'GOVERNOR & LT. GOVERNOR': 'governor',
    'SECRETARY OF STATE': 'secretary-of-state',
    'ATTORNEY GENERAL': 'attorney-general',
    'STATE AUDITOR': 'state-auditor',
    'STATE SUPERINTENDENT OF PUBLIC INSTRUCTION': 'superintendent',
    'PUBLIC SERVICE COMMISSIONER, DISTRICT 2': 'psc-2',
    'PUBLIC SERVICE COMMISSIONER, DISTRICT 3': 'psc-3',
    'PUBLIC SERVICE COMMISSIONER, DISTRICT 4': 'psc-4',
    'CLERK OF THE SUPREME COURT': 'clerk-of-court',
    'SUPREME COURT CHIEF JUSTICE': 'supco-chief-justice',
    'SUPREME COURT JUSTICE #3': 'supco-3',
}

const NAME_SUBS = {
    // necessary to merge with other data
    "SIDNEY CHIP FITZPATRICK": "SIDNEY 'CHIP' FITZPATRICK"
}
const cleanName = name => NAME_SUBS[name] || name.trim()

const statewideFile = reader.readFile(PATH_STATEWIDE)
const statewide = statewideFile.SheetNames.map(sheet => getSheetData(statewideFile, sheet))
    .filter(d => Object.keys(STATEWIDE_RACES_TO_INCLUDE).includes(d.race))
statewide.forEach(d => {
    d.race = STATEWIDE_RACES_TO_INCLUDE[d.race]
})
writeJson('./inputs/results/cleaned/2024-primary-statewide.json', statewide)


const legislativeFile = reader.readFile(PATH_LEGISLATIVE)
const legislative = legislativeFile.SheetNames.map(sheet => getSheetData(legislativeFile, sheet))
legislative.forEach(d => {
    d.race = d.race
        .replace('STATE REPRESENTATIVE DISTRICT ', 'HD-')
        .replace('STATE SENATOR DISTRICT ', 'SD-')

})
writeJson('./inputs/results/cleaned/2024-primary-legislative.json', legislative)


function getSheetData(file, sheetName) {
    const raw = reader.utils.sheet_to_json(file.Sheets[sheetName])

    const race = raw[3]['2024 Unofficial Primary Election Results'].replace('\r\n', ' ')
    const party = sheetName.match(/(REP)|(DEM)|(LIB)|(GRN)|(NON)/).find(d => d !== null)[0].replace('N', 'NP')
    const reportingTime = raw[2]['2024 Unofficial Primary Election Results'].replace('Downloaded at ', '')

    const cols = Object.values(raw.find(d => d['__EMPTY'] === 'County')).slice(2,).map(d => d.split('\r')[0])
    const totals = Object.values(raw.find(d => d['__EMPTY'] === 'TOTALS')).slice(1,)

    const resultsTotal = cols.map((col, i) => {
        return {
            candidate: cleanName(col),
            party, // will need to change for general script
            votes: totals[i],
        }
    }).sort((a, b) => b.votes - a.votes)

    const totalVotes = resultsTotal.reduce((acc, obj) => acc + obj.votes, 0)
    const mostVotes = resultsTotal.reduce((acc, obj) => (acc < obj.votes) ? obj.votes : acc, 0)

    resultsTotal.forEach(d => {
        d.isWinner = (d.votes === mostVotes)
        d.votePercent = d.votes / totalVotes
    })

    // const counties = raw.slice(4, -1)
    // const resultsByCounty = counties.map(county => {
    //     return cols.map((col, i) => {
    //         return {
    //             candidate: col,
    //             county: county.__EMPTY,
    //             votes: Object.values(county).slice(1,)[i],
    //         }
    //     })
    // }).flat()

    // console.log({ race, reportingTime })

    return {
        race,
        party,
        // precinctsFull: 'TK',
        // precinctsPartial: 'TK',
        reportingTime: reportingTime,
        resultsTotal,
        // resultsByCounty
    }
}