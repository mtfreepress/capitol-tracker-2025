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
} from '../functions.js'

// Load committees.json and create a mapping of committee titles to their normalized names
const committeesJson = getJson('inputs/committees/committees.json');

// Create mapping from slug to official name
const committeeNameMapping = committeesJson.reduce((acc, committee) => {
    // Create slug from title (e.g. "(H) Judiciary" -> "house-judiciary")
    const slug = committee.title
        .toLowerCase()
        .replace(/^\((h|s)\)\s+/i, (match, chamber) => 
            chamber.toLowerCase() === 'h' ? 'house-' : 'senate-'
        )
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Map slug to cleaned name from COMMITEE_NAME_CLEANING
    acc[slug] = COMMITEE_NAME_CLEANING[committee.title] || committee.title;
    return acc;
}, {});

export default class Lawmaker {
    constructor({
        lawmaker,
        district,
        annotation,
        articles,
        committeeOrder,
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

        const committeesCleaned = committees
            .map(d => {
                const committeeName = committeeNameMapping[d.committee] || 
                                   COMMITEE_NAME_CLEANING[d.committee] || 
                                   d.committee;
                
                return {
                    committee: committeeName,
                    role: d.role.charAt(0).toUpperCase() + d.role.slice(1)
                }
            })
            .sort((a, b) => committeeOrder.indexOf(a.committee) - committeeOrder.indexOf(b.committee))
            .filter(d => !EXCLUDE_COMMITTEES.includes(d.committee));

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

    addSponsoredBills = ({ sponsoredBills }) => {
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


// Leaving in Just in Case™  

// import { getCsv } from '../utils.js'

// import {
//     LAWMAKER_REPLACEMENTS,
// } from '../config/overrides.js'

// import {
//     // COMMITTEES,
//     EXCLUDE_COMMITTEES,
// } from '../config/committees.js'


// import {
//     // filterToFloorVotes,
//     // lawmakerLastName,
//     lawmakerKey,
//     billKey,
//     standardizeLawmakerName,
//     getLawmakerSummary,
//     getLawmakerLastName,
//     getLawmakerLocale,
//     standardizeCommiteeNames,
//     isLawmakerActive,
// } from '../functions.js'

// export default class Lawmaker {
//     constructor({
//         lawmaker,
//         district,
//         annotation,
//         articles,
//         committeeOrder,
//     }) {

//         const {
//             name,
//             party,
//             phone,
//             email,
//             committees,
//             image_path,
//             sessions,
//             locale,
//         } = lawmaker

//         const {
//             // displayName could in theory be used to assign custom lawmaker names from annotation file -- unimplemented though
//             // Currently this is being handled by the config list acccessed by standardizeLawmakerName
//             // displayName, 
//             leadershipRole,
//             lawmakerPageText
//         } = annotation

//         const standardName = standardizeLawmakerName(name) 
//         this.name = standardName
//         this.summary = getLawmakerSummary(standardName)

//         const committeesCleaned = committees
//             .map(d => {
//                 return {
//                     committee: standardizeCommiteeNames(d.committee),
//                     role: d.role,
//                 }
//             })
//             .sort((a, b) => committeeOrder.indexOf(a.committee) - committeeOrder.indexOf(b.committee))
//             .filter(d => !EXCLUDE_COMMITTEES.includes(d.committee))

//         this.data = {
//             key: lawmakerKey(standardName),
//             name: standardName,
//             lastName: getLawmakerLastName(standardName),
//             locale: getLawmakerLocale(standardName),
//             isActive: isLawmakerActive(standardName),
//             district: district.key,
//             districtElexHistory: {
//                 last_election: district.last_election,
//                 pri_elex: district.pri_elex,
//                 gen_elex: district.gen_elex,
//                 replacementNote: this.lookForReplacementNote(district.key)
//             },
//             districtNum: +district.key.replace('HD ', '').replace('SD ', ''),
//             districtLocale: district.locale,

//             chamber: district.key[0] === 'S' ? 'senate' : 'house',
//             title: district.key[0] === 'S' ? 'Sen.' : 'Rep.',
//             fullTitle: district.key[0] === 'S' ? 'Senator' : 'Representative',
//             party,
//             phone,
//             email,
//             committees: committeesCleaned,
//             leadershipTitle: leadershipRole,

//             legislativeHistory: sessions.map(({ year, chamber }) => ({ year, chamber })),

//             articles,

//             lawmakerPageText: lawmakerPageText,

//             imageSlug: image_path.replace('portraits/', '').toLowerCase(),

//         }
//     }


//     lookForReplacementNote = (districtKey) => {
//         const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === districtKey)
//         return replacement && replacement.note || null
//     }

//     addSponsoredBills = ({ sponsoredBills }) => {
//         this.sponsoredBills = sponsoredBills.map(bill => {
//             const {
//                 key,
//                 identifier,
//                 title,
//                 chamber,
//                 status,
//                 progress,
//                 label,
//                 textUrl,
//                 fiscalNoteUrl,
//                 legalNoteUrl,
//             } = bill.data

//             return {
//                 key,
//                 identifier,
//                 title,
//                 chamber,
//                 status, // object
//                 progress, // 
//                 label,
//                 textUrl,
//                 fiscalNoteUrl,
//                 legalNoteUrl,
//                 numArticles: bill.data.articles.length,
//                 sponsor: this.summary, // object
//             }
//         })
//     }

//     addKeyBillVotes = ({ name, keyBills }) => {
//         const keyBillVotes = keyBills
//             .map(bill => {
//                 return {
//                     identifier: bill.data.identifier,
//                     key: bill.data.key,
//                     title: bill.data.title,
//                     explanation: bill.data.explanation,
//                     lawmakerLastVote: bill.getLastVoteInvolvingLawmaker(name)
//                 }
//             })
//             .filter(bill => bill.lawmakerLastVote !== null)
//             .map(bill => {
//                 return {
//                     identifier: bill.identifier,
//                     key: bill.key,
//                     title: bill.title,
//                     explanation: bill.explanation,
//                     lawmakerVote: bill.lawmakerLastVote.votes.find(d => d.name === name).option,
//                     voteData: bill.lawmakerLastVote.data,
//                 }
//             })
//         this.keyBillVotes = keyBillVotes

//     }

//     getVotes = (lawmaker, votes) => {
//         const lawmakerVotes = votes.filter(vote => {
//             const voters = vote.votes.map(d => d.name)
//             return voters.includes(lawmaker.name)
//         })
//         return lawmakerVotes
//     }

//     exportMerged = () => {
//         return {
//             ...this.data,
//             sponsoredBills: this.sponsoredBills || [],
//             votingSummary: this.votingSummary,
//             keyBillVotes: this.keyBillVotes || [],
//         }
//     }

// }