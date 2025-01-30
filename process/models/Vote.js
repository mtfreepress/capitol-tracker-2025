import {
    standardizeLawmakerName,
    getLawmakerSummary,
    standardizeDate,
} from '../functions.js'

export default class Vote {
    constructor({ 
        vote,
        voteLocation,
        billVoteMajorityRequired,
        billStartingChamber
    }) {
        const {
            url,
            bill, // identifier
            action_id,
            session,
            type,
            seqNumber,
            date,
            description,
            count,
            votes,
            error,
        } = vote

        this.bill = bill
        this.votes = this.cleanVotes(votes || [])

        // TODO -- work out how to classify vote threshold
        // May need to flow the required threshold in from bill data
        const voteChamber = this.getVoteChamber(seqNumber)
        const thresholdRequired = this.classifyMotionThreshold({
            voteType: type,
            motion: description,
            voteChamber,
            billVoteMajorityRequired,
            billStartingChamber,
        })
        const gopCount = this.getPartyCount(this.votes, 'R')
        const demCount = this.getPartyCount(this.votes, 'D')

        this.data = {
            action: action_id,
            bill,
            date: standardizeDate(date),
            type, // Note this seems to be defaulting to "floor" for everything in input data
            voteLocation, // "committee" or "floor"
            seqNumber,
            voteChamber,
            voteUrl: url,
            session,
            motion: description,

            thresholdRequired,

            count, // reformatting
            gopCount,
            demCount,

            motionPassed: this.didMotionPass(count, thresholdRequired, billStartingChamber, voteChamber),
            gopSupported: this.didMotionPass(gopCount, thresholdRequired, billStartingChamber, voteChamber),
            demSupported: this.didMotionPass(demCount, thresholdRequired, billStartingChamber, voteChamber),

            // votes: this.votes,
        }
    }

    getVoteChamber = (seqNumber) => {
        if (!seqNumber) return null
        if (seqNumber[0] === 'S') return 'senate'
        if (seqNumber[0] === 'H') return 'house'
        else throw `getChamber error on seqNumber ${seqNumber}`
    }

    cleanVotes = (rawVotes) => {
        return rawVotes.map(ballot => {
            const standardName = standardizeLawmakerName(ballot.name)
            const lawmakerSummary = getLawmakerSummary(standardName)
            const cleanedVote = {
                option: ballot.option,
                ...lawmakerSummary,
                lastName: ballot.lastName,
            }
            return cleanedVote
        })
    }

    getPartyCount = (votes, partyKey) => {
        const partyVotes = votes.filter(d => d.party === partyKey)
        return {
            Y: partyVotes.filter(d => d.option === 'Y').length,
            N: partyVotes.filter(d => d.option === 'N').length,
            A: partyVotes.filter(d => d.option === 'A').length,
            E: partyVotes.filter(d => d.option === 'E').length,
            O: partyVotes.filter(d => !['Y', 'N', 'A', 'E'].includes(d.option)).length
        }
    }

    classifyMotionThreshold = opts => {
        const { voteType, motion, billVoteMajorityRequired } = opts
        if (voteType === 'veto override') return '2/3 each chamber'
        else if (voteType === 'committee') return 'simple'
        else if (voteType === 'floor') {
            if (billVoteMajorityRequired === 'Simple') return 'simple'
            else {
                if (![
                    'Do Pass', 'Do Pass As Amended',
                    'Do Concur', 'Do Concur As Amended'
                ].includes(motion)) {
                    // separate out precedural votes, e.g. amendments
                    return 'simple'
                } else if (billVoteMajorityRequired === '2/3 of Entire Legislature') {
                    return '2/3 entire legislature'
                } else if (billVoteMajorityRequired === '3/4 of Each House') {
                    return '3/4 each chamber'
                } else if (billVoteMajorityRequired === '2/3 of Each House') {
                    return '2/3 each chamber'
                }
            }
        }
        // fallback
        throw `classifyMotionThreshold failed, ${voteType}, ${billVoteMajorityRequired}`
    }

    didMotionPass = (count, threshold, billStartingChamber, voteChamber) => {
        const isVoteInFirstChamber = (billStartingChamber === voteChamber)
        if (threshold === 'simple') {
            return (count.Y > count.N)
        } else if (threshold === '2/3 entire legislature') {
            // needs a combined 100 votes between House and Senate
            // Which means second chamber votes need info on first chamber vote, which is a head scratcher

            if (isVoteInFirstChamber) {
                return (count.Y >= 50) // "pass" if there aren't enough no votes to scuttle it in first house
            } else {
                // Defaulting to false for time being
                // Really need a "maybe" option
                return false
            }

        } else if (threshold === '3/4 each chamber') {
            // Threshold is I think 3/4 majority of those present and voting
            const threshold = Math.ceil(0.75 * (count.Y + count.N))
            return (count.Y >= threshold)
        } else if (threshold === '2/3 each chamber') {
            // Threshold is I think 2/3 majority of those present and voting
            const threshold = Math.ceil(0.75 * (count.Y + count.N))
            return (count.Y >= threshold)
        }
        else {
            throw 'Unsupported vote threshold'
        }
    }

    export = () => ({
        ...this.data,
        votes: this.votes,
    })

}