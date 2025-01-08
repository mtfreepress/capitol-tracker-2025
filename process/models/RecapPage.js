import { dateParse } from '../functions.js'

const INCLUDE_ACTIONS = [
    // 'Introduced',
    // 'Hearing',
    'Tabled in Committee',
    'Taken from Table in Committee',
    'Committee Vote Failed; Remains in Committee',
    'Reconsidered Previous Action; Remains in Committee',
    'Committee Executive Action--Resolution Adopted',
    'Committee Executive Action--Resolution Adopted as Amended',
    'Committee Executive Action--Resolution Not Adopted',
    'Committee Executive Action--Resolution Not Adopted as Amended',
    'Committee Executive Action--Bill Passed',
    'Committee Executive Action--Bill Passed as Amended',
    'Committee Executive Action--Bill Not Passed',
    'Committee Executive Action--Bill Concurred',
    'Committee Executive Action--Bill Concurred as Amended',
    'Committee Executive Action--Bill Not Concurred',
    'Taken from Committee; Placed on 2nd Reading',
    '2nd Reading Passed',
    '2nd Reading Not Passed',
    '2nd Reading Not Passed as Amended',
    '2nd Reading Not Passed; 3rd Reading Vote Required',
    '2nd Reading Pass as Amended Motion Failed',
    '2nd Reading Pass Motion Failed',
    '2nd Reading Passed as Amended',
    '3rd Reading Passed',
    'Resolution Adopted',
    'Resolution Not Adopted',
    'Adverse Committee Report Adopted',
    '2nd Reading Passed as Amended on Voice Vote',
    '2nd Reading Passed on Voice Vote',
    'Placed on Consent Calendar',
    '2nd Reading Concurred',
    '2nd Reading Not Concurred',
    '2nd Reading Concurred as Amended',
    '2nd Reading Senate Amendments Not Concur Motion Failed',
    '2nd Reading Not Concurred as Amended',
    '2nd Reading Concur Motion Failed',
    '2nd Reading Concur as Amended Motion Failed',
    '3rd Reading Concurred',
    // '2nd Reading Motion to Amend Carried',
    // '2nd Reading Motion to Amend Failed',
    '2nd Reading Concurred on Voice Vote',
    '2nd Reading Concurred as Amended on Voice Vote',
    '3rd Reading Failed',
    '2nd Reading Indefinitely Postponed',
    '2nd Reading Senate Amendments Concurred',
    '2nd Reading Senate Amendments Not Concurred',
    '2nd Reading House Amendments Concurred',
    '2nd Reading House Amendments Not Concurred',
    '3rd Reading Passed as Amended by House',
    '3rd Reading Passed as Amended by Senate',
    '2nd Reading Conference Committee Report Adopted',
    '2nd Reading Free Conference Committee Report Adopted',
    '2nd Reading Governor\'s Proposed Amendments Adopted',
    '2nd Reading Governor\'s Proposed Amendments Not Adopted',
    '3rd Reading Conference Committee Report Adopted',
    '3rd Reading Conference Committee Report Rejected',
    '3rd Reading Free Conference Committee Report Adopted',
    '3rd Reading Governor\'s Proposed Amendments Adopted',
    'Vetoed by Governor',
    'Signed by Governor',
    'Veto Overridden in Senate',
    'Veto Overridden in House',
    'Veto Override Vote Mail Poll in Progress',
    'Veto Override Failed in Legislature',
    'Veto Override Motion Failed in House',
    'Veto Override Motion Failed in Senate',
    // 'Motion Carried',
    // 'Motion Failed',
    'Motion to Reconsider Failed',
    'On Motion Rules Suspended',
    'Reconsidered Previous Action; Placed on 2nd Reading',
    'Reconsidered Previous Action; Remains in 2nd Reading Process',
    'Reconsidered Previous Action; Remains in 3rd Reading Process',
    'Reconsidered Previous Act; Remains in 2nd Reading FCC Process',
    'Rules Suspended to Accept Late Return of Amended Bill',
    'Segregated from Committee of the Whole Report',
    // 'Transmitted to House',
    // 'Transmitted to Senate',
    // 'Transmitted to Governor',
    // 'Referred to Committee',
    // 'Rereferred to Committee',
    // 'Taken from 2nd Reading; Rereferred to Committee',
    // 'First Reading',
    'Bill Not Heard at Sponsor\'s Request',
    'Bill Withdrawn per House Rule H30-50(3)(b)',
    'Taken from 3rd Reading; Placed on 2nd Reading',
    // 'Returned to House',
    // 'Returned to Senate',
    // 'Returned to House with Amendments',
    // 'Returned to Senate with Amendments',
    // 'Returned with Governor\'s Proposed Amendments',
    // 'Returned with Governor\'s Line - item Veto',
    // 'Transmitted to Senate for Consideration of Governor\'s Proposed Amendments',
    // 'Transmitted to House for Consideration of Governor\'s Proposed Amendments',
    // 'Returned to Senate Concurred in Governor\'s Proposed Amendments',
    // 'Returned to Senate Not Concurred in Governor\'s Proposed Amendments',
    // 'Returned to House Concurred in Governor\'s Proposed Amendments',
    // 'Returned to House Not Concurred in Governor\'s Proposed Amendments',
    // 'Rules Suspended to Accept Late Transmittal of Bill',
    'Missed Deadline for General Bill Transmittal',
    'Missed Deadline for Revenue Bill Transmittal',
    'Missed Deadline for Appropriation Bill Transmittal',
    'Missed Deadline for Referendum Proposal Transmittal',
    'Missed Deadline for Revenue Estimating Resolution Transmittal',
    'Died in Standing Committee',
    'Died in Process',
    'Chapter Number Assigned',
    'Filed with Secretary of State',
    'Free Conference Committee Appointed',
    'Free Conference Committee Report Received',
    'Conference Committee Appointed',
    'Conference Committee Report Received',
    '2nd Reading Free Conference Committee Report Adopt Motion Failed',
]


export default class RecapPage {
    constructor({ actions, bills, updateTime, recapAnnotations }) {

        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0)
        const majorActions = actions.filter(d => INCLUDE_ACTIONS.includes(d.description)) // && !d.introduction

        // // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') <= beginningOfToday,
        // })

        const pastActions = majorActions.filter(d => dateParse(d.date) <= beginningOfToday)

        const datesThatHaveHappened = Array.from(new Set(pastActions.sort((a, b) => dateParse(b.date) - dateParse(a.date)).map(d => d.date)))
        // TODO - build this out to allow richer bill info on actions page
        // const billsThatHaveMoved = Array.from(new Set(pastActions.map(d => d.bill)))

        const actionsByDate = datesThatHaveHappened.map(date => {
            // const isDateBeforeSession = (date) // TODO - bundle pre-session dates together
            return {
                date,
                actions: pastActions.filter(d => d.date === date).map(a => {
                    const actionBill = bills.find(d => d.data.identifier === a.bill)
                    if (!actionBill) throw `Error, bad action match, ${a.bill}`
                    return {
                        ...a,
                        title: actionBill.data.title,
                        explanation: actionBill.data.explanation,
                    }
                })
            }
        })

        this.data = {
            actionsByDate,
            recapAnnotations,
        }
    }
    export = () => ({ ...this.data })

}