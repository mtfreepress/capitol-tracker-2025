import Action from './Action.js'

import { MANUAL_SIGNINGS, MANUAL_VETOS } from '../config/overrides.js'
import { BILL_TYPES, VOTE_THRESHOLDS, VOTE_THRESHOLD_MAPPING, BILL_STATUSES } from '../config/procedure.js'
import { capitalize } from '../functions.js'

import {
    billKey,
    standardizeLawmakerName,
    getLawmakerSummary,
    // hasProgressFlag,
    // actionsWithFlag,
    // firstActionWithFlag,
    // lastActionWithFlag
} from '../functions.js'

export default class Bill {
    constructor({
        bill,
        votes,
        actions,
        annotation,
        articles,
    }) {
        const {
            key,
            identifierLong,
            session,
            billPageUrl,
            // billTextUrl,
            billPdfUrl,
            lc,
            title,
            sponsor,
            voteRequirements,
            // sponsorParty,
            // sponsorDistrict,
            // statusDate,
            // lastAction,
            billStatus,
            fiscalNotesListUrl,
            legalNoteUrl,
            amendmentListUrl,
            // draftRequestor,
            billRequestor,
            // primarySponsor,
            subjects,
            deadlineCategory,
            transmittalDeadline,
            amendedReturnDeadline,
        } = bill

        const {
            isKeyBill,
            category,
            Explanation,
            BillPageText,
            // legalNoteLink, // Replaced by legal notes direct from LAWS system
            tags,
            vetoMemoUrl,
        } = annotation

        this.identifier = key
        this.chamber = this.getChamber(key)
        this.type = this.getType(bill)
        this.sponsor = standardizeLawmakerName(sponsor)
        this.voteMajorityRequired = this.getVoteMajorityRequired(voteRequirements)
        this.actions = this.buildActionList(actions, votes, this.voteMajorityRequired, this.getChamber(key))
        this.committees = Array.from(new Set(this.actions.map(a => a.data.committee))).filter(d => d !== null)
        this.progress = this.getProgress({
            identifier: key,
            billType: this.type,
            firstChamber: this.chamber,
            actions: this.actions.map(a => a.data),
        })

        this.data = {
            key: billKey(key),  // url-friendly
            identifier: key,
            identifierLong,
            chamber: this.chamber,
            title,
            session,
            lcIdentifier: lc,
            type: this.type, // bill, resolution etc.
            status: this.getStatus(key, billStatus),
            progress: this.progress,
            hasBeenSentToGovernor: this.hasBeenSentToGovernor(),
            // TODO: add progression classification here

            sponsor: getLawmakerSummary(this.sponsor), // object
            requestor: billRequestor,

            deadlineCategory,
            transmittalDeadline: transmittalDeadline,
            secondHouseReturnIfAmendedDeadline: amendedReturnDeadline,
            // fiscalNoteExpected: this.getFiscalNoteExpected(bill),
            voteMajorityRequired: this.voteMajorityRequired,
            voteRequirements: voteRequirements || [],

            subjects: subjects.map(d => d.subject), // TODO: Add cleaning
            tags: tags && tags.map(d => d.name) || [],

            lawsUrl: billPageUrl || null,
            textUrl: billPdfUrl || null,
            fiscalNoteUrl: fiscalNotesListUrl || null,
            amendmentsUrl: amendmentListUrl || null,
            legalNoteUrl: legalNoteUrl || null,
            vetoMemoUrl: vetoMemoUrl || null,

            // annotations
            isMajorBill: isKeyBill,
            majorBillCategory: category,
            explanation: Explanation,
            billPageText: BillPageText,

            articles,
            numArticles: articles.length // for bill table summaries

            // leave actions out here + merge in export
        }
    }

    buildActionList = (actions, votes, voteMajorityRequired, chamber) => {
        // Build list of actions associated with the bill
        // matching with votes for actions that have them
        // actions should come from scraper in order
        // Vote models for actions with votes are now created within the Action constructor
        // so the Vote can access information about the action
        return actions.map(action => {
            return new Action({
                action,
                billVoteMajorityRequired: voteMajorityRequired,
                billStartingChamber: chamber,
            })
        })
        // NB: sorting by date here screws with order b/c of same-day actions
    }

    getType = (bill) => {
        // assigns bill type 'bill', 'joint resolution' etc.
        const billType = BILL_TYPES.find(type => type.test(bill))
        return billType.key
    }

    getChamber = (identifier) => {
        return {
            'H': 'house',
            'S': 'senate',
        }[identifier[0]]
    }

    getStatus = (identifier, status) => {
        // Status as pulled from LAWS status line

        // Workaround for stale LAWS data
        if (MANUAL_SIGNINGS.includes(identifier)) {
            return BILL_STATUSES.find(d => d.key === 'Became Law')
        }
        if (MANUAL_VETOS.includes(identifier)) {
            return BILL_STATUSES.find(d => d.key === 'Probably Dead')
        }

        const match = BILL_STATUSES.find(d => d.key === status)
        if (!match) {
            throw `Missing bill status match for ${status}`
        }
        return match
    }

    hasBeenSentToGovernor = () => {
        const actions = this.actions.map(a => a.data)
        return actions.map(d => d.transmittedToGovernor).includes(true)
    }

    getProgress = ({ identifier, billType, firstChamber, actions }) => {
        // Get bill progression as calculated from actions
        // bill is rawBill data
        // actions are data only, should be sorted first to last
        // actions should be in order

        // helper functions to interface with actionFlags assigned in Action.getActionFlags
        const progressFlagInActions = (actions, flag) => actions.map(d => d[flag]).includes(true)
        const actionsWithFlag = (actions, flag) => actions.filter(a => a[flag])
        const firstActionWithFlag = (actions, flag) => actions.find(a => a[flag]) || null
        const lastActionWithFlag = (actions, flag) => {
            const all = actions.filter(d => d[flag])
            if (all.length === 0) return null
            return all.slice(-1)[0]
        }
        const blastMotions = actionsWithFlag(actions, 'blasted');
        const hasBeenBlasted = blastMotions.length > 0;

        const firstChamberActions = actions.filter(a => a.billHolder === firstChamber)
        const secondChamber = (firstChamber === 'house') ? 'senate' : 'house'
        const secondChamberActions = actions.filter(a => a.billHolder === secondChamber)
        const hasReachedGovernor = actionsWithFlag(actions, 'transmittedToGovernor').length > 0

        const committeeActionsInFirstChamber = actionsWithFlag(firstChamberActions, 'committeeAction')

        // ID committees the bill has passed through in its first chamber -- sometimes there's more than one
        // remove approps subcommittees so HB 2 process doesn't get confused
        const firstChamberCommittees = Array.from(new Set(committeeActionsInFirstChamber.map(d => d.committee)))
            .filter(d => ![
                'Joint Appropriations Section A — General Government',
                'Joint Appropriations Section B — Health and Human Services',
                'Joint Appropriations Section E — Education',
                'Joint Appropriations Section C — Natural Resources and Transportation',
                'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice'
            ].includes(d))

        // ID first committee, since first committee passage is a key milestone
        const committeeActionsInFirstCommittee = committeeActionsInFirstChamber
            .filter(d => d.committee === firstChamberCommittees[0])


        const committeeActionsInSubsequentCommittees = committeeActionsInFirstChamber.filter(d => firstChamberCommittees.slice(1,).includes(d.committee))

        // different bill types have different procedural steps (e.g. House Resolutions don't go to the Senate)
        const typeConfig = BILL_TYPES.find(type => type.key === billType)
        if (!typeConfig) throw `Unhandled bill type "${billType}"`

        // conditions that determine which progession steps are added to the progression data
        // everything starts false, then checks are performed as the logic walks through the actions
        let hasBeenIntroduced = false
        let hasPassedACommittee = false
        let hasPassedFirstChamber = false
        let hasPassedSecondChamber = false
        let reconciliationNecessary = false // if house/senate pass different versions of bill
        let reconciliationComplete = false
        let hasPassedGovernor = false

        // status for each step is one of 'current','future','passed','blocked', 'skipped'
        const progressionSteps = typeConfig.steps.map(step => {
            if (step === 'introduced') {
                const introducedStep = firstActionWithFlag(actions, 'introduction')
                hasBeenIntroduced = (introducedStep !== null)
                return {
                    step,
                    status: hasBeenIntroduced ? 'passed' : 'future',
                    statusLabel: hasBeenIntroduced ? 'Introduced' : 'Not introduced',
                    statusDate: hasBeenIntroduced ? introducedStep.date : null,
                }
            } else if (step === 'first committee') {
                let status = 'future', statusLabel = null, statusDate = null
                if (!hasBeenIntroduced) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    status = 'current'
                    statusLabel = 'Pending'
                }

                if (committeeActionsInFirstChamber.length === 0) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    // This should catch first committee to act when multiple committees consider bill sequentially
                    const lastCommitteeAction = committeeActionsInFirstCommittee.slice(-1)[0]
                    if (lastCommitteeAction.failed) { status = 'blocked'; statusLabel = 'Voted down' }
                    if (lastCommitteeAction.missedDeadline) { status = 'blocked'; statusLabel = 'Missed deadline' }
                    if (lastCommitteeAction.tabled) { status = 'blocked'; statusLabel = 'Tabled' }
                    if (lastCommitteeAction.withdrawn) { status = 'blocked'; statusLabel = 'Withdrawn' }
                    if (lastCommitteeAction.advanced) { status = 'passed'; statusLabel = 'Advanced'; hasPassedACommittee = true }
                    if (lastCommitteeAction.blasted) { status = 'passed'; statusLabel = 'Blasted to floor'; hasPassedACommittee = true }
                    // unlabled actions default to 'Pending'
                    statusDate = lastCommitteeAction.date
                    return { step, status, statusLabel, statusDate }
                }

            } else if (step === 'first chamber') {
                let status = 'future', statusLabel = null, statusDate = null
                if (!hasPassedACommittee) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    status = 'current'
                    statusLabel = 'Pending'
                }
                const floorActionsInFirstChamber = actionsWithFlag(firstChamberActions, 'firstChamberFloorAction')
                if (floorActionsInFirstChamber.length === 0) {
                    if (committeeActionsInSubsequentCommittees.length === 0) {
                        return { step, status, statusLabel, statusDate }
                    } if (hasBeenBlasted) {
                        // Blast motion should override tabled status
                        status = 'passed';
                        statusLabel = 'Blasted to floor';
                        hasPassedACommittee = true;
                        statusDate = blastMotions[0].date;
                    }
                    else if (lastCommitteeAction) {
                        // Only apply these statuses if not blasted
                        if (lastCommitteeAction.failed) { status = 'blocked'; statusLabel = 'Voted down' }
                        if (lastCommitteeAction.missedDeadline) { status = 'blocked'; statusLabel = 'Missed deadline' }
                        if (lastCommitteeAction.tabled) { status = 'blocked'; statusLabel = 'Tabled' }
                        if (lastCommitteeAction.withdrawn) { status = 'blocked'; statusLabel = 'Withdrawn' }
                        if (lastCommitteeAction.advanced) { status = 'passed'; statusLabel = 'Advanced'; hasPassedACommittee = true }
                        if (lastCommitteeAction.blasted) { status = 'passed'; statusLabel = 'Blasted to floor'; hasPassedACommittee = true }
                        statusDate = lastCommitteeAction.date;
                    }
                } else {
                    const lastFloorAction = floorActionsInFirstChamber.slice(-1)[0]
                    if (lastFloorAction.failed) { status = 'blocked'; statusLabel = 'Voted down' }
                    if (lastFloorAction.preliminaryPassage) { status = 'current'; statusLabel = 'Passed preliminary floor vote' }
                    if (lastFloorAction.finalPassage) { status = 'passed'; statusLabel = `Passed ${capitalize(firstChamber)}`, hasPassedFirstChamber = true }
                    statusDate = lastFloorAction.date
                    return { step, status, statusLabel, statusDate }
                }

            } else if (step === 'second chamber') {
                let status = 'future', statusLabel = null, statusDate = null
                if (!hasPassedFirstChamber) {
                    return { step, status, statusLabel, statusDate } //nulls
                } else {
                    status = 'current'
                    statusLabel = 'Pending'
                }
                const actionsInSecondChamber = actionsWithFlag(secondChamberActions, 'secondChamberAction')
                if (actionsInSecondChamber.length === 0) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    const lastFloorAction = actionsInSecondChamber.slice(-1)[0]
                    if (lastFloorAction.failed) { status = 'blocked'; statusLabel = 'Voted down' }
                    if (lastFloorAction.preliminaryPassage) { status = 'current'; statusLabel = 'Passed preliminary vote' }
                    if (lastFloorAction.finalPassage) { status = 'passed'; statusLabel = `Passed ${capitalize(secondChamber)}`, hasPassedSecondChamber = true }
                    if (lastFloorAction.finalPassage && progressFlagInActions(secondChamberActions, 'amended')) {
                        reconciliationNecessary = true
                    }
                    statusDate = lastFloorAction.date
                    return { step, status, statusLabel, statusDate }
                }

            } else if (step === 'reconciliation') {
                let status = 'skipped', statusLabel = null, statusDate = null
                if (!reconciliationNecessary) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    status = 'current'
                    statusLabel = 'Pending'
                }
                const reconciliationActions = actionsWithFlag(actions, 'reconciliationAction')
                if (reconciliationActions.length === 0) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    const lastReconciliationAction = reconciliationActions.slice(-1)[0]
                    if (lastReconciliationAction.advanced) { status = 'passed'; statusLabel = 'Reconciled', reconciliationComplete = true }
                    statusDate = lastReconciliationAction.date
                    return { step, status, statusLabel, statusDate }
                }
            } else if (step === 'governor') {
                let status = 'future', statusLabel = null, statusDate = null
                if (
                    !hasReachedGovernor // fallback for messiness earlier in process
                    && (!hasPassedSecondChamber || (reconciliationNecessary && !reconciliationComplete))
                ) {
                    return { step, status, statusLabel, statusDate }
                } else {
                    status = 'current'
                    statusLabel = 'Pending'
                }
                const governorActions = actionsWithFlag(actions, 'governorAction')
                const becameLaw = progressFlagInActions(actions, 'ultimatelyPassed')
                if ((governorActions.length) === 0 && !becameLaw) {
                    return { step, status, statusLabel, statusDate }
                } else if ((governorActions.length === 0) && becameLaw) {
                    status = 'passed'; statusLabel = 'Became law unsigned', hasPassedGovernor = true
                    return { step, status, statusLabel, statusDate }
                } else {
                    const lastGovernorAction = governorActions.slice(-1)[0]
                    const houseHasOverridenVeto = progressFlagInActions(governorActions, 'vetoOverriddenHouse')
                    const senateHasOverridenVeto = progressFlagInActions(governorActions, 'vetoOverriddenSenate')
                    const legislatureHasOverridenVeto = progressFlagInActions(governorActions, 'vetoOverridden')
                    if (lastGovernorAction.signed) { status = 'passed'; statusLabel = 'Signed', hasPassedGovernor = true }
                    if (lastGovernorAction.vetoed) { status = 'blocked'; statusLabel = 'Vetoed' }
                    if (lastGovernorAction.amendmentSuggested) { statusLabel = 'Amendment suggested' }
                    if (lastGovernorAction.vetoOverridePending
                        || (houseHasOverridenVeto || senateHasOverridenVeto) && !lastGovernorAction.vetoOverrideFailed
                    ) { status = 'blocked'; statusLabel = 'Veto Override Pending' }
                    if (legislatureHasOverridenVeto || lastGovernorAction.vetoOverridden || (houseHasOverridenVeto && senateHasOverridenVeto)) {
                        status = 'passed'; statusLabel = 'Veto Overriden'; hasPassedGovernor = true
                    }
                    statusDate = lastGovernorAction.date
                    return { step, status, statusLabel, statusDate }
                }
            }
        })
        return progressionSteps
    }

    getVoteMajorityRequired = (voteRequirements) => {
        const thisBillThresholds = voteRequirements.map(req =>
            VOTE_THRESHOLD_MAPPING[req] || req
        );

        if (thisBillThresholds.length === 0) {
            throw `${this.identifier} has no vote requirements`;
        }

        if (!(thisBillThresholds.every(d => VOTE_THRESHOLDS.includes(d)))) {
            throw `${this.identifier} has vote threshold missing from VOTE_THRESHOLDS`;
        }
        const controllingThreshold = thisBillThresholds
            .sort((a, b) => VOTE_THRESHOLDS.indexOf(a) - VOTE_THRESHOLDS.indexOf(b))[0];

        return controllingThreshold;
    }

    getLastVoteInvolvingLawmaker = (name) => {
        const billVotes = this.actions.filter(a => a.vote).map(a => a.vote)
        const votesWithLawmakerInvolved = billVotes.filter(v => v.votes.map(d => d.name).includes(name))
        if (votesWithLawmakerInvolved.length == 0) return null
        const lastVoteInvolvingLawmaker = votesWithLawmakerInvolved.slice(-1)[0]
        return lastVoteInvolvingLawmaker
    }

    exportBillDataOnly = () => this.data
    exportActionData = () => this.actions.map(a => a.exportActionDataOnly())
    exportActionDataWithVotes = () => this.actions.map(a => a.export())
    exportVoteData = () => this.actions.filter(a => a.vote !== null).map(a => a.exportVote())

    exportMerged = () => {
        return {
            ...this.data,
            actions: this.actions.map(a => a.export()),
        }
    }
}