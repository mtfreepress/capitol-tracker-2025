import Vote from './Vote.js'

import {
    standardizeDate,
    standardizeCommiteeNames,
    // getCommitteeType,
    // getCommitteeTime
} from '../functions.js'

import { ACTIONS } from '../config/procedure.js'

export default class Action {
    constructor({ 
        action, 
        billVoteMajorityRequired, 
        billStartingChamber 
    }) {

        const {
            id,
            bill,
            date,
            committeeHearingTime, 
            // actionUrl, // all null in source data currently
            committee,
            recordings,
            transcriptUrl, // From third-party council data project integration
            vote,
        } = action

        const cleanedDescription = action.description.replace(/\((C|LC|H|S)\) /, '').replace(/\&nbsp/g, '')
        const actionFlags = this.getActionFlags(cleanedDescription)
        const billHolder = this.determineBillHolder(id, action.possession, cleanedDescription, actionFlags)

        // console.log(possession, '  ----  ', description)
        // console.log({id, actionFlags})

        this.vote = vote && new Vote({
            vote,
            voteLocation: actionFlags.committeeAction ? 'committee': 'floor',
            billVoteMajorityRequired, // for determining whether vote passes
            billStartingChamber, // for determining whether vote passes (because some votes require 100 votes between both chambers)
        }) || null

        const committeeName = standardizeCommiteeNames(committee)

        this.data = {
            id,
            bill,
            date: standardizeDate(date),
            committeeHearingTime: committeeHearingTime ? standardizeDate(committeeHearingTime) : null,
            description: cleanedDescription,
            // possession // old variable name changed to billHolder because Eric can't reliably spell it
            billHolder,
            committee: committeeName,
            // committeeTime: getCommitteeTime(committeeName),
            // committeeType: getCommitteeType(committeeName),
            // actionUrl,
            recordings,
            transcriptUrl: transcriptUrl || null,
            // Flags
            ...actionFlags,
        }
        // leave vote out of this.data, merge in at export step
    }

    determineBillHolder = (id, rawPossession, cleanedDescription, actionFlags) => {
        // translates possession from the raw data provided from our legislative interfact to the terms
        // the getProgress logic in Bill.js needs to fire properly
        // we may be able to clean this up more down the road
        let billHolder = null
       
        if (actionFlags.inDrafting) billHolder = 'drafter'
        if (actionFlags.draftToSponsor) billHolder = 'sponsor'
        if (rawPossession === 'House') billHolder = 'house' // note use of lowercase for internal logic
        if (rawPossession === 'Senate') billHolder = 'senate' // also lowercase
        if (cleanedDescription === 'Returned to House') billHolder = 'house'
        if (cleanedDescription === 'Returned to Senate') billHolder = 'senate'
        // May need to figure out who "owns" the bill during enrolling -- assuming it's the chamber of origin
        if (actionFlags.transmittedToGovernor || actionFlags.governorAction) billHolder = 'governor'
        if (actionFlags.secretaryOfStateAction) billHolder = 'sos'

        // warn if billHolder remains null despite above logic
        // if this happens it's probably a situation we haven't anticipated
        if (billHolder === null) console.warn(`Warning for action ${id}: unspecified billHolder situation` )
        
        // console.log(billHolder, '  ----  ', cleanedDescription) // generate output to verify actions map in sane way
        return billHolder
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