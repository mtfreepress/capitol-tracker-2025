import {
    LAWMAKER_REPLACEMENTS,
} from '../config/overrides.js'

import {
    COMMITTEES,
    EXCLUDE_COMMITTEES,
} from '../config/committees.js'

import {
    // filterToFloorVotes,
    // lawmakerLastName,
    lawmakerKey,
    billKey,
    standardizeLawmakerName,
    getLawmakerSummary,
    getLawmakerLastName,
    getLawmakerLocale,
    standardizeCommiteeNames,
    isLawmakerActive,
} from '../functions.js'

export default class Lawmaker {
    constructor({
        lawmaker,
        district,
        annotation,
        articles,
    }) {

        const {
            name,
            party,
            phone,
            email,
            committees,
            image_path,
            sessions,
            locale,
        } = lawmaker

        const {
            LawmakerPageText,
            LeadershipRole
        } = annotation

        const standardName = standardizeLawmakerName(name)
        this.name = standardName
        this.summary = getLawmakerSummary(standardName)

        const committeeOrder = COMMITTEES.map(d => d.name)
        const committeesCleaned = committees
            .map(d => {
                return {
                    committee: standardizeCommiteeNames(d.committee),
                    role: d.role,
                }
            })
            .sort((a, b) => committeeOrder.indexOf(a.committee) - committeeOrder.indexOf(b.committee))
            .filter(d => !EXCLUDE_COMMITTEES.includes(d.committee))

        this.data = {
            key: lawmakerKey(standardName),
            name: standardName,
            lastName: getLawmakerLastName(standardName),
            locale: getLawmakerLocale(standardName),
            isActive: isLawmakerActive(standardName),
            district: district.key,
            districtElexHistory: {
                last_election: district.last_election,
                pri_elex: district.pri_elex,
                gen_elex: district.gen_elex,
                replacementNote: this.lookForReplacementNote(district.key)
            },
            districtNum: +district.key.replace('HD ', '').replace('SD ', ''),
            districtLocale: district.locale,

            chamber: district.key[0] === 'S' ? 'senate' : 'house',
            title: district.key[0] === 'S' ? 'Sen.' : 'Rep.',
            fullTitle: district.key[0] === 'S' ? 'Senator' : 'Representative',
            party,
            phone,
            email,
            committees: committeesCleaned,
            leadershipTitle: LeadershipRole,

            legislativeHistory: sessions.map(({ year, chamber }) => ({ year, chamber })),

            articles,

            // annotations
            lawmakerPageText: LawmakerPageText,

            imageSlug: image_path.replace('portraits/', '').toLowerCase(),

            // Merge this stuff in later, see main.js
            // votingSummary: this.getVotingSummary(lawmaker, this.votes), 
            // voteTabulation: this.getVoteTabulation(lawmaker, filterToFloorVotes(this.votes)), // BIG DATA
            // keyBillVotes: [], // TODO,
            // sponsoredBills: this.sponsoredBills,
            // votes: this.votes.map(vote => vote.data)
        }
        // console.log(lawmaker.name, this.sponsoredBills.length)
    }


    lookForReplacementNote = (districtKey) => {
        const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === districtKey)
        return replacement && replacement.note || null
    }

    addSponsoredBills = ({ sponsoredBills }) => {
        this.sponsoredBills = sponsoredBills.map(bill => {
            const {
                key,
                identifier,
                title,
                chamber,
                status,
                progress,
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
            } = bill.data

            return {
                key,
                identifier,
                title,
                chamber,
                status, // object
                progress, // 
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
                numArticles: bill.data.articles.length,
                sponsor: this.summary, // object
            }
        })
    }

    addKeyBillVotes = ({ name, keyBills }) => {
        const keyBillVotes = keyBills
            .map(bill => {
                return {
                    identifier: bill.data.identifier,
                    key: bill.data.key,
                    title: bill.data.title,
                    explanation: bill.data.explanation,
                    lawmakerLastVote: bill.getLastVoteInvolvingLawmaker(name)
                }
            })
            .filter(bill => bill.lawmakerLastVote !== null)
            .map(bill => {
                return {
                    identifier: bill.identifier,
                    key: bill.key,
                    title: bill.title,
                    explanation: bill.explanation,
                    lawmakerVote: bill.lawmakerLastVote.votes.find(d => d.name === name).option,
                    voteData: bill.lawmakerLastVote.data,
                }
            })
        // console.log(keyBillVotes)
        this.keyBillVotes = keyBillVotes

    }

    getVotes = (lawmaker, votes) => {
        const lawmakerVotes = votes.filter(vote => {
            const voters = vote.votes.map(d => d.name)
            return voters.includes(lawmaker.name)
        })
        return lawmakerVotes
    }

    exportMerged = () => {
        return {
            ...this.data,
            sponsoredBills: this.sponsoredBills || [],
            votingSummary: this.votingSummary,
            keyBillVotes: this.keyBillVotes || [],
        }
    }

}