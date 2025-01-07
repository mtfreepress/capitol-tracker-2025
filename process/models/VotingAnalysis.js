/*
For calculating lawmaker voting records

*/

const average = (data, accessor) => {
    const total = data.reduce((acc, obj) => acc + accessor(obj), 0)
    return total / data.length
}

export default class VotingAnalysis {
    constructor({ votes }) {
        // assumes votes supplied are floor votes for either house or senate
        this.votes = votes

        this.votes.forEach(vote => {
            vote.votes.forEach(v => {
                // increment over specific lawmaker votes cast
                const { motionPassed, gopSupported, demSupported } = vote
                const lawmakerVote = v.option
                v.voteOutcome = motionPassed
                v.lawmakerPresent = ['Y', 'N'].includes(v.option)
                v.lawmakerOnWinningSide = (lawmakerVote === 'Y' && motionPassed) || (lawmakerVote === 'N' && !motionPassed)
                v.lawmakerWithGopCaucus = (lawmakerVote === 'Y' && gopSupported) || (lawmakerVote === 'N' && !gopSupported)
                v.lawmakerWithDemCaucus = (lawmakerVote === 'Y' && demSupported) || (lawmakerVote === 'N' && !demSupported)
            })
        })

        const ballots = this.votes.map(vote => vote.votes).flat()
        const lawmakerNames = [... new Set(ballots.map(d => d.name))]

        this.lawmakers = lawmakerNames.map(name => {
            const party = ballots.find(d => d.name === name).party
            const ballotsByLawmaker = ballots.filter(d => d.name === name)

            const votesPresent = ballotsByLawmaker.filter(d => d.lawmakerPresent)
            const votesOnWinningSide = ballotsByLawmaker.filter(d => d.lawmakerOnWinningSide).length
            const votesWithGopCaucus = ballotsByLawmaker.filter(d => d.lawmakerWithGopCaucus).length
            const votesWithDemCaucus = ballotsByLawmaker.filter(d => d.lawmakerWithDemCaucus).length

            return {
                name,
                party,
                numVotesCast: ballotsByLawmaker.length,
                numVotesNotPresent: ballotsByLawmaker.filter(d => !d.lawmakerPresent).length,
                numVotesPresent: votesPresent.length,
                votesOnWinningSide: votesOnWinningSide,
                fractionVotesOnWinningSide: votesOnWinningSide / votesPresent.length || 0,
                votesWithGopCaucus,
                fractionVotesWithGopCaucus: votesWithGopCaucus / votesPresent.length || 0,
                votesWithDemCaucus,
                fractionVotesWithDemCaucus: votesWithDemCaucus / votesPresent.length || 0,
            }
        })

        // add averages
        const dems = this.lawmakers.filter(d => d.party === 'D')
        const gops = this.lawmakers.filter(d => d.party === 'R')
        this.averages = {
            averageAbsences: average(this.lawmakers, d => d.numVotesNotPresent),

            averageVotesOnWinningSideGop: average(gops, d => d.fractionVotesOnWinningSide),
            averageVotesOnWinningSideDem: average(dems, d => d.fractionVotesOnWinningSide),

            averageVotesWithGopCaucusGop: average(gops, d => d.fractionVotesWithGopCaucus),
            averageVotesWithGopCaucusDem: average(dems, d => d.fractionVotesWithGopCaucus),

            averageVotesWithDemCaucusGop: average(gops, d => d.fractionVotesWithDemCaucus),
            averageVotesWithDemCaucusDem: average(dems, d => d.fractionVotesWithDemCaucus),
        }
    }

    getLawmakerStats = (name) => {
        const lawmakerStats = this.lawmakers.find(d => d.name === name)
        return {
            ...lawmakerStats,
            ...this.averages,
        }
    }
}