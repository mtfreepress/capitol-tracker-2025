import { getCsv, getJson } from '../utils.js'

import {
    LAWMAKER_REPLACEMENTS,
} from '../config/overrides.js'

import {
    EXCLUDE_COMMITTEES,
    COMMITEE_NAME_CLEANING
} from '../config/committees.js'

import {
    lawmakerKey,
    billKey,
    standardizeLawmakerName,
    getLawmakerSummary,
    getLawmakerLastName,
    getLawmakerLocale,
    isLawmakerActive,
    capitalize,
    getCommitteeDataByKey,
    getCommitteeDisplayOrder
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
            leadershipRole,
            lawmakerPageText
        } = annotation

        const standardName = standardizeLawmakerName(name) 
        this.name = standardName
        this.summary = getLawmakerSummary(standardName)

        if (district.key === 'SD 2') console.log('X', district.last_election)

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
            committees: this.mergeCommitteeDataToAssignments(committees, getCommitteeDisplayOrder()),
            leadershipTitle: leadershipRole,

            legislativeHistory: sessions.map(({ year, chamber }) => ({ year, chamber })),

            articles,

            lawmakerPageText: lawmakerPageText,

            imageSlug: image_path.replace('portraits/', '').toLowerCase(),

        }
    }

    lookForReplacementNote = (districtKey) => {
        const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === districtKey)
        return replacement && replacement.note || null
    }

    mergeCommitteeDataToAssignments = (committeeAssignments, committeeDisplayOrder) => {
        return committeeAssignments.map(assignment => {
            const committee = getCommitteeDataByKey(assignment.committee)
                return {
                    key: committee.committeeKey,
                    displayName: committee.displayName,
                    role: capitalize(assignment.role),
                }
            })
            .sort((a, b) => committeeDisplayOrder.indexOf(a.key) - committeeDisplayOrder.indexOf(b.key))
            .filter(d => !EXCLUDE_COMMITTEES.includes(d.displayName)) // TODO: Switch this to a key-based system
    }

    addSponsoredBills = ({ sponsoredBills }) => {
        // not called in constructor because it needs bill data w/ some of the processing done by the Bill model
        this.sponsoredBills = sponsoredBills.map(billData => {
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
                articles,
            } = billData.data

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
                numArticles: articles.length,
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