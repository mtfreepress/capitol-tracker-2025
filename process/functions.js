import { timeFormat, timeParse } from 'd3-time-format'


import {
    LAWMAKER_NAME_CLEANING
} from './config/people.js'

import {
    COMMITEE_NAME_CLEANING,
    // COMMITTEES,
    // EXCLUDE_COMMITTEES,
} from './config/committees.js'

import { getJson, getCsv } from './utils.js'

const roster = getJson('./inputs/lawmakers/legislator-roster-2025.json')
const committees = await getCsv('./inputs/committees/committees.csv')

export const billKey = (identifier) => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)
export const lawmakerKey = (name) => name.replace(/\s/g, '-')

// Should be replaced by manual config
// export const commiteeKey = (name) => name.replace(/,/g, '').replace(/\s/g, '-').toLowerCase()

// ## Data cleaning formatting helpers

export const capitalize = string => string[0].toUpperCase() + string.slice(1).toLowerCase()

export const dateFormat = timeFormat('%m/%d/%Y')
export const dateParse = date => timeParse('%m/%d/%Y')(date).setUTCHours(7, 0, 0, 0) // setUTC specifies MT time
export const standardizeDate = date => {
    if (!date) return null
    return dateFormat(new Date(date))
}

// ## Committee utility functions
// Stored here in case they're needed by multiple data models, so we can avoid redunduncy/consistency issues

export const standardCommiteeNames = Array.from(new Set(Object.values(COMMITEE_NAME_CLEANING)))
export const standardizeCommiteeNames = name => {
    if (standardCommiteeNames.includes(name)) return name
    if ([null, '', ' ', '  ', '   ', '    '].includes(name)) return null
    const preClean = name.replace('(H) (H)', '(H)').replace('(S) (S)', '(S)')
    if (preClean.includes('Free Conference Committee')) return 'Free Conference Committee'
    if (preClean.includes('Conference Committee')) return 'Conference Committee'
    const clean = COMMITEE_NAME_CLEANING[preClean]
    // if (!clean) console.error(`COMMITEE_NAME_CLEANING missing "${preClean}"`)
    return clean
}
export const getCommitteeDataByKey = key => {
    const match = committees.find(d => d.committeeKey === key)
    if (!match) console.error(`/inputs/committees/committees.csv missing key "${key}"`)
    return match
}
export const getCommitteeDisplayOrder = () => committees.map(d => d.committeeKey)

export const getCommitteeTime = name => {
    // Needs updating if it's still used
    const match = getCommittee(name) || {}
    return match.type || null
}
export const getCommitteeType = name => {
    // Needs updating if it's still used
    const match = getCommittee(name) || {}
    return match.type || null
}

// ## Lawmaker utility functions

export const standardLawmakerNames = Array.from(new Set(Object.values(LAWMAKER_NAME_CLEANING)))
export const standardizeLawmakerName = name => {
    const preClean = name.replace(';byproxy', '')
    if (standardLawmakerNames.includes(preClean)) return preClean
    const clean = LAWMAKER_NAME_CLEANING[preClean]
    if (!clean) console.error(`NAME_CLEANING missing ${preClean}`)
    return clean
}

export const getLawmakerLastName = standardName => {
    const match = roster.find(d => d.name === standardName)
    if (!match) console.error(`Roster missing name ${standardName}`)
    return match.lastName
}
export const getLawmakerLocale = standardName => {
    const match = roster.find(d => d.name === standardName)
    return match.locale
}
export const isLawmakerActive = standardName => {
    const match = roster.find(d => d.name === standardName)
    if (match.active === false) return false
    else return true
}

export const getLawmakerSummary = standardName => {
    // Pulls basic lawmaker info from roster file
    // Avoids circular data merge issues (in theory?)
    const match = roster.find(d => d.name === standardName) || {}
    if (!match.name) console.error(`Roster missing name ${standardName}`)
    // This is used for bill sponsor summaries, vote analyses, etc.
    return {
        name: standardName,
        lastName: match.lastName,
        party: match.party,
        locale: match.locale,
        district: match.district,
    }
}

export const getLegislativeLeaderDetails = (lawmakers, title) => {
    const lawmaker = lawmakers.find(l => l.data.leadershipTitle === title)
    return {
        role: title,
        key: lawmaker.data.key,
        name: lawmaker.data.name,
        party: lawmaker.data.party,
        locale: lawmaker.data.locale,
    }
}