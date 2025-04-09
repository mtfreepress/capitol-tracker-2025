import { dateParse } from '../functions.js'


const PARTY_ORDER = ['R', 'D'] // majority, minority
const ROLE_ORDER = ['Chair', 'Vice Chair', 'Member']

export default class Committee {
    constructor({ schema, committeeBills, lawmakers, updateTime }) {
        const {
            commiteeKey,
            displayName,
            usualDays,
            usualTime,
            chamber,
            type
        } = schema;

        const addressKey = displayName.toLowerCase()
            .replace(/[,\.&;:()]/g, '')
            .replace(/\s+/g, '-');

        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time

        const committeeBillIds = committeeBills.map(b => b.data.identifier)
        const committeeBillActions = committeeBills.map(b => b.actions.map(a => a.export())).flat() // includes non-committee actions on these bills
        const committeeActions = committeeBillActions.filter(a => a.committee === commiteeKey)

        // // Sorting bills by where they are in committee process

        let billsWithdrawn = []
        let billsReferredElsewhere = []
        committeeBills.forEach(bill => {
            const billActions = bill.actions.map(a => a.export())
            const billActionsInCommittee = billActions.filter(a => a.committee === commiteeKey)

            // Skip processing if there are no actions for this bill in this committee
            if (billActionsInCommittee.length === 0) return;

            const lastCommitteeActionIndex = billActions.findIndex(a => a.id === billActionsInCommittee.slice(-1)[0].id)
            const postCommitteeActions = billActions
                .slice(lastCommitteeActionIndex + 1,)

            if (billActions.find(a => a.withdrawn)) {
                billsWithdrawn.push(bill.data.identifier)
            }
            if (postCommitteeActions.find(a => a.committeeSubsequentReferral)) {
                // includes bills referred to approps after 2nd reading, bills referred later in the other chamber
                // Addressing this by filtering out bills that advanced below
                // This is really to catch bills shuttled between committees
                billsReferredElsewhere.push(bill.data.identifier)
            }
        })

        // hearings
        const hearings = committeeActions.filter(d => d.hearing)
        const hearingsPast = hearings.filter(d => dateParse(d.date) < beginningOfToday)
        const billsHeard = Array.from(new Set(hearingsPast.map(d => d.bill)))

        const hearingsScheduled = hearings.filter(d => dateParse(d.date) >= beginningOfToday)
        const billsScheduled = Array.from(new Set(hearingsScheduled.map(d => d.bill)))
        const daysOnSchedule = Array.from(new Set(hearingsScheduled.map(d => d.date)))
            .sort((a, b) => new Date(a) - new Date(b))
        const billsScheduledByDay = daysOnSchedule.map(day => ({
            day,
            bills: hearingsScheduled.filter(d => d.date === day).map(d => d.bill)
        }))

        const billsUnscheduled = committeeBillIds.filter(d =>
            !billsHeard.includes(d)
            && !billsScheduled.includes(d)
            && !billsWithdrawn.includes(d)
            && !billsReferredElsewhere.includes(d)
        )

        // This wrinkle is an attempt to sort out bills that ended up reconsidered
        const lastActionsByBill = committeeBills.map(bill => {
            const actions = committeeActions.filter(d => d.isMajor)
                .filter(d => d.failed || d.advanced)
                .filter(d => d.bill === bill.data.identifier)
            if (actions.length === 0) return []
            return actions.slice(-1)[0]
        })

        let billsFailed = lastActionsByBill.filter(d => d.failed).map(d => d.bill)
        billsFailed.filter(d => !billsWithdrawn.includes(d))
        const billsAdvanced = lastActionsByBill.filter(d => d.advanced && !d.blasted).map(d => d.bill)
        const billsBlasted = Array.from(new Set(
            committeeActions.filter(d => d.blasted).map(d => d.bill)
        ))
        // remove bills later re-referred to/from other committees after advancing here
        billsReferredElsewhere = billsReferredElsewhere.filter(d => !billsAdvanced.includes(d) && !billsBlasted.includes(d))


        const billsAwaitingVote = billsHeard.filter(d =>
            !billsFailed.includes(d)
            && !billsAdvanced.includes(d)
            && !billsBlasted.includes(d)
            && !billsWithdrawn.includes(d)
            && !billsReferredElsewhere.includes(d)
        )

        const members = lawmakers.map(d => {
            const lawmaker = d.data
            return {
                name: lawmaker.name,
                party: lawmaker.party,
                locale: lawmaker.locale,
                role: lawmaker.committees.find(c => c.committee === commiteeKey).role,
            }
        }).sort((a, b) => (PARTY_ORDER.indexOf(a.party) - PARTY_ORDER.indexOf(b.party))
            || (ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
        )

        this.data = {
            name: displayName,
            key: addressKey,
            commiteeKey: commiteeKey,
            chamber,
            time: usualTime,
            type,
            bills: committeeBillIds,
            billCount: committeeBillIds.length - billsReferredElsewhere.length,
            billsWithdrawn,
            billsUnscheduled,
            billsScheduled,
            billsScheduledByDay,
            billsAwaitingVote,
            billsFailed,
            billsAdvanced,
            billsBlasted,

            members,
        }
        // console.log(name, this.data.overview)
    }

    chamberFromName(name) {
        if (name.includes('Joint')) return 'joint'
        if (name.includes('House')) return 'house'
        if (name.includes('Senate')) return 'senate'
    }

    export = () => this.data

}