// Model for app-independent analysis

class Analysis {
    constructor({ bills, lawmakers }) {
        this.updateTime = new Date()
        // this.billProgression = bills.map(bill => this.getBillProgress(bill))
        this.hearings = this.getBillHearings(bills)
        this.floorDebates = this.getFloorDebates(bills)
        this.conferences = this.getConferenceCommittees(bills)
        this.outcomes = this.getOutcomes(bills)
        this.lawmakerSummaries = this.getLawmakerSummaries(lawmakers)

        // console.log(this.billProgression.find(d => d.identifier === 'SB 65'))
    }

    getConferenceCommittees(bills) {
        const conferences = bills
            .filter(bill => {
                return bill.actions.map(d => d.description).includes('Conference Committee Appointed') ||
                    bill.actions.map(d => d.description).includes('Free Conference Committee Appointed')
            })
            .map(bill => {
                const actions = bill.actions
                const identifier = bill.data.identifier
                const session = bill.data.session
                const sponsor = bill.sponsor

                const hasNormalConference = actions.map(d => d.description).includes('Conference Committee Appointed')
                const hasFreeConference = actions.map(d => d.description).includes('Free Conference Committee Appointed')

                return {
                    identifier,
                    session,
                    type: hasNormalConference ? 'normal' : 'free'
                }
            })
        return conferences
    }

    getBillHearings(bills) {
        // returns a list of all bill hearings
        const hearings = bills.map(bill => {
            const actions = bill.actions
            const identifier = bill.data.identifier
            const session = bill.data.session
            const sponsor = bill.sponsor
            const sponsorName = sponsor && sponsor.name || null
            const sponsorParty = sponsor && sponsor.party || null
            return actions
                .filter(action => action.hearing)
                .map(action => {
                    return {
                        session,
                        bill: identifier,
                        description: action.description,
                        date: action.date,
                        committee: action.committee,
                        chamber: action.chamber,
                        sponsorName,
                        sponsorParty,
                    }
                })

        }).flat()
        return hearings
    }

    getFloorDebates(bills) {
        // returns list of all second reading actions
        // flagged with `secondReading` or `resolutionVote` in config.js

        const secondReadings = bills.map(bill => {
            const actions = bill.actions
            const identifier = bill.data.identifier
            const session = bill.data.session
            const sponsor = bill.data.sponsor
            const sponsorName = sponsor && sponsor.name || null
            const sponsorParty = sponsor && sponsor.party || null
            return actions
                .filter(action => action.secondReading || action.resolutionVote)
                .map(action => {
                    return {
                        session,
                        bill: identifier,
                        description: action.description,
                        date: action.date,
                        chamber: action.chamber,
                        sponsorName,
                        sponsorParty,
                    }
                })
        }).flat()
        return secondReadings
    }

    getBillProgress(bill) {
        // bill: Bill model
        // This reshapes hierarchical bill data formatted for front-end app to flat form suitable for analysis
        // This seems to be slightly unrelable for some reason

        const data = bill.data
        const progression = bill.data.progression

        return {
            session: data.session,
            identifier: data.identifier,
            title: data.title,
            type: data.type,
            sponsor: data.sponsor.name,
            sponsorParty: data.sponsor.party,

            draftRequestDate: progression.dates.draftRequest,
            draftDeliveryDate: progression.dates.draftDelivery,
            introductionDate: progression.dates.introduction,

            firstCommitteeName: progression.status.firstCommitteeName,
            firstCommitteeHearingDate: progression.dates.initialHearing,
            firstCommitteeActionDate: progression.dates.firstCommitteeVote,
            firstCommitteeActionOutcome: progression.status.firstCommitteeAction,
            firstChamberSecondReadingDate: progression.dates.firstChamberSecondReading,
            firstChamberSecondReadingOutcome: progression.status.firstChamberSecondReading,
            firstChamberThirdReadingDate: progression.dates.firstChamberThirdReading,
            firstChamberThirdReadingOutcome: progression.status.firstChamberThirdReading,

            // firstChamberOutcome: progression.steps.find(d => d.label === 'First chamber').status,
        }
    }

    getOutcomes(bills) {
        // flatten bill data for what-has/hasn't passed analysis

        const flat = bills.map(d => {
            const bill = d.data
            const lastHouseVote = bill.progression.lastVotes.find(d => d.chamber === 'house')
            const lastSenateVote = bill.progression.lastVotes.find(d => d.chamber === 'senate')
            return {
                key: bill.key,
                identifier: bill.identifier,
                title: bill.title,
                type: bill.type,
                label: bill.label,

                sponsorName: bill.sponsor.name,
                sponsorParty: bill.sponsor.party,

                lawsStatus: bill.status.key,
                statusAtSessionEnd: bill.status.statusAtSessionEnd,

                lastHouseVoteYeses: (lastHouseVote.count && lastHouseVote.count.yes) || null,
                lastHouseVoteNos: (lastHouseVote.count && lastHouseVote.count.no) || null,
                lastSenateVoteYeses: (lastSenateVote.count && lastSenateVote.count.yes) || null,
                lastSenateVoteNos: (lastSenateVote.count && lastSenateVote.count.no) || null,

                mtfpArticles: bill.numArticles,

                publicCommentsTotal: bill.publicCommentCounts.total,
                publicCommentsFor: bill.publicCommentCounts.for,
                publicCommentsAgainst: bill.publicCommentCounts.against,
            }
        })
        return flat
    }

    getLawmakerSummaries(lawmakers) {
        // split lawmaker data for 'batting average' analysis
        const portioned = lawmakers.map(l => {
            const lawmaker = l.data
            return {
                key: lawmaker.key,
                name: lawmaker.name,
                title: lawmaker.title,
                party: lawmaker.party,
                district: lawmaker.district.key,
                locale: lawmaker.district.locale,
                chamber: lawmaker.chamber,
                mftpArticles: lawmaker.articles.length,
                ...lawmaker.votingSummary,
                sponsoredBills: lawmaker.sponsoredBills,
            }
        })
        return portioned
    }
}

module.exports = Analysis