// Pulls campaign finance data from FEC API
// On a by-race basis

// Source pages:
// West (MT-01) - https://www.fec.gov/data/elections/house/MT/01/2024/
// East (MT-02) - https://www.fec.gov/data/elections/house/MT/02/2024/
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config()
// Expects FEC_API_KEY="xxxx" in a .env file at root
// See https://www.npmjs.com/package/dotenv

const OUT_PATH = './inputs/fec/finance.json'

const { FEC_API_KEY } = process.env

const ST = 'mt'
const STATE = 'Montana'

const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const fetchRaceData = async (cycle, office, district) => {
    const url = `https://api.open.fec.gov/v1/elections/?api_key=${FEC_API_KEY}&cycle=${cycle}&election_full=true&office=${office}&state=${ST}&stateFull=${STATE}&district=${district}&per_page=100&sort_hide_null=true`
    console.log(url)
    const result = await fetch(url)
    const resultData = await result.json()
    return resultData
}

const cleanRaceData = (raw) => {
    if (!raw.pages === 1) throw `Warning - may be missing data because of pagination error `
    return raw.results
        .filter(d => d.candidate_id !== 'H4MT01090') // remove redundant Dennis Hayes 2024 filing
}

async function main() {
    const senate = await fetchRaceData('2024', 'senate', '')
    const house01 = await fetchRaceData('2024', 'house', '01')
    const house02 = await fetchRaceData('2024', 'house', '02')

    const combined = [
        {
            raceSlug: 'us-senate',
            finances: cleanRaceData(senate),
        },
        {
            raceSlug: 'us-house-1',
            finances: cleanRaceData(house01),
        },
        {
            raceSlug: 'us-house-2',
            finances: cleanRaceData(house02),
        },
    ]

    writeJson(OUT_PATH, combined)
    console.log('FEC fetch done\n')
}
main()