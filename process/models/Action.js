import {
    standardizeDate,
    standardizeCommiteeNames,
    // getCommitteeType,
    // getCommitteeTime
} from '../functions.js'

import { ACTIONS } from '../config/procedure.js'

export default class Action {
    constructor({ action, vote }) {

        const {
            id,
            bill,
            session,
            actionUrl,
            date,
            hasVote,
            committee,
            recordings,
            transcriptUrl, // From third-party council data project integration
        } = action

        const description = action.action.replace(/\((C|H|S)\) /, '').replace(/\&nbsp/g, '')


        this.vote = vote

        const committeeName = standardizeCommiteeNames(committee)

        this.data = {
            id,
            bill,
            date: standardizeDate(date),
            description,
            posession: this.determinePosession(action, description),
            committee: committeeName,
            // committeeTime: getCommitteeTime(committeeName),
            // committeeType: getCommitteeType(committeeName),
            actionUrl,
            recordings,
            transcriptUrl: transcriptUrl || null,
            // Flags
            ...this.getActionFlags(description)
        }
        // leave vote out of this.data, merge in at export step
    }

    determinePosession = (action, description) => {
        const posessionSearch = action.action.match(/(?<=\()(C|H|S)(?=\))/)
        const posessionKey = posessionSearch && posessionSearch[0] || 'O'
        const posession = {
            'C': 'staff',
            'H': 'house',
            'S': 'senate',
            'O': 'other'
        }[posessionKey]

        const flags = this.getActionFlags(description)
        if (flags.governorAction) {
            // overrides encoding on the action description
            return 'governor'
        }
        return posession

    }


    // determineChamber = (organization_id) => {
    //     // Converts openstates organization_id field to useful 'chamber' designation
    //     const chambers = {
    //         '~{"classification": "legislature"}': 'Staff',
    //         '~{"classification": "lower"}': 'House',
    //         '~{"classification": "upper"}': 'Senate',
    //     }
    //     return chambers[organization_id]
    // }

    // determineCommittee = (descriptionItems, chamber) => {
    //     const description = descriptionItems[0]
    //     const rawCommittee = descriptionItems[1]
    //     // Manual override for governor related items
    //     // TODO - break this out to config
    //     if ([
    //         'Vetoed by Governor',
    //         'Transmitted to Governor',
    //         'Signed by Governor',
    //     ].includes(description)) return 'Governor\'s Office'

    //     if (description === 'Chapter Number Assigned') return 'Secretary of State'

    //     const committee = rawCommittee.replace('(H)', 'House').replace('(S)', 'Senate')
    //         || chamber.replace('House', 'House Floor').replace('Senate', 'Senate Floor')
    //     // console.log(committee)
    //     return committee
    // }

    getActionFlags = (description) => {
        const match = ACTIONS.find(d => d.key === description)

        if (!match) console.log('Missing cat for bill action', description)
        return { ...match }
    }

    exportVote = () => this.vote && this.vote.export()

    exportActionDataOnly = () => this.data

    export = () => {
        return {
            ...this.data,
            vote: this.vote && this.vote.export() || null
        }
    }

}