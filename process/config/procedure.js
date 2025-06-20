export const VOTE_THRESHOLD_MAPPING = {
    'TWO_THIRDS_LEGISLATURE': '2/3 of Entire Legislature',
    'THREE_FOURTHS': '3/4 of Each House',
    'TWO_THIRDS': '2/3 of Each House',
    'SIMPLE': 'Simple',
    'THREE_FIFTHS': 'Three-Fifths',
};

export const VOTE_THRESHOLDS = [
    '2/3 of Entire Legislature',
    '3/4 of Each House',
    '2/3 of Each House',
    'Simple',
    'Three-Fifths',
];

export const BILL_TYPES = [
    // bill is rawBill data here so bill.key should be un-urlized bill number, e.g. HB 205
    {
        key: 'constitutional amendment',
        test: bill => bill.subjects.map(d => d.subject).includes('Constitutional Amendment Proposals'),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber'],
    },
    {
        key: 'referendum',
        test: bill => bill.subjects.map(d => d.subject).includes('Referendum'),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber'],
    },
    {
        key: 'revenue resolution',
        test: bill => bill.subjects.map(d => d.subject).includes('Revenue Estimating Resolution'),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber'],
    },
    {
        key: 'study resolution',
        test: bill => bill.subjects.map(d => d.subject).includes('Legislature, Interim Studies'),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber'],
    },
    {
        key: 'house resolution',
        test: bill => bill.key.slice(0, 2) == 'HR',
        steps: ['introduced', 'first committee', 'first chamber'],
    },
    {
        key: 'senate resolution',
        test: bill => bill.key.slice(0, 2) == 'SR',
        steps: ['introduced', 'first committee', 'first chamber'],
    },
    {
        key: 'joint resolution',
        test: bill => (bill.key.slice(0, 2) == 'HJ') || (bill.key.slice(0, 2) == 'SJ'),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber'],
    },
    {
        // Decide if this should be applied to other standard budget bills
        key: 'budget bill',
        test: bill => [
            'HB 1', 'HB 2', 'HB 3', 'HB 4', 'HB 5',
            'HB 6', 'HB 7', 'HB 8', 'HB 9', 'HB 10',
            'HB 11', 'HB 12', 'HB 13', 'HB 14', 'HB 15'
        ].includes(bill.key),
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'],
    },
    {
        key: 'house bill',
        test: bill => bill.key.slice(0, 2) === 'HB',
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'],
    },
    {
        key: 'senate bill',
        test: bill => bill.key.slice(0, 2) === 'SB',
        steps: ['introduced', 'first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'],
    },
    // {
    //     key: 'other bill',
    //     test: d => true, // fallback
    //     steps: ['introduced', 'first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'],
    // }
]

export const BILL_STATUSES = [
    { key: 'In Drafting Process', step: 'Drafting', label: 'In drafting', status: 'not introduced', statusAtSessionEnd: 'not introduced' },

    // first-house
    { key: 'In First House--Introduced', step: 'First chamber', label: 'Introduced', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In First House Committee--Nontabled', step: 'First chamber', label: 'In committee', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In First House Committee--Tabled', step: 'First chamber', label: 'Tabled in committee', status: 'stalled', statusAtSessionEnd: 'failed' },
    { key: 'In First House--Out of Committee', step: 'First chamber', label: 'Out of committee', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In First House--Through 2nd Reading', step: 'First chamber', label: 'Passed second reading vote', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In First House--Through 3rd Reading', step: 'First chamber', label: 'Passed chamber', status: 'live', statusAtSessionEnd: 'failed' },

    // second-house
    { key: 'Transmitted to Second House', step: 'Second chamber', label: 'Transmitted', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Second House Committee--Nontabled', step: 'Second chamber', label: 'In committee', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Second House Committee--Tabled', step: 'Second chamber', label: 'Tabled', status: 'stalled', statusAtSessionEnd: 'failed' },
    { key: 'In Second House--Out of Committee', step: 'Second chamber', label: 'On floor', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Second House--Through 2nd Reading', step: 'Second chamber', label: 'Passed 2nd reading vote', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Second House--Through 3rd Reading', step: 'Second chamber', label: 'Passed chamber', status: 'live', statusAtSessionEnd: 'failed' },

    // reconciliation
    { key: 'Returned to First House with Second House Amendments', step: 'Reconciliation', label: 'In reconciliation', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Process to Consider Second House Amendments', step: 'Reconciliation', label: 'In reconciliation', status: 'live', statusAtSessionEnd: 'failed' },
    { key: 'In Conference or Free Conference Committee Process', step: 'Reconciliation', label: 'In reconciliation', status: 'live', statusAtSessionEnd: 'failed' },

    // Passed Legislature
    { key: 'Passed By Legislature--Enrolling and Final Preparation Process', step: 'Through Legislature', label: 'Passed both chambers', status: 'live', statusAtSessionEnd: 'pending, passed legislature' },

    // governor's desk
    { key: 'Transmitted to Governor', step: 'Governor', label: 'Before governor', status: 'live', statusAtSessionEnd: 'pending, passed legislature' },
    { key: 'Returned With Governor\'s Proposed Amendments or Line Item Veto', step: 'Governor', label: 'Changes suggested', status: 'live', statusAtSessionEnd: 'pending, passed legislature' },
    { key: 'In Process to Consider Governor\'s Proposed Amendments or Line Item Veto', step: 'Governor', label: 'Changes suggested', status: 'live', statusAtSessionEnd: 'pending, passed legislature' },
    { key: 'In Process to Attempt Override of Governor \'s Veto', step: 'Governor', label: 'Veto override attempt', status: 'live', statusAtSessionEnd: 'pending, passed legislature' },

    // Final markers --> complicate things
    { key: 'Probably Dead', label: '', step: 'Failed', status: 'stalled', statusAtSessionEnd: 'failed' },
    { key: 'Became Law', label: '', step: 'Passed', status: 'became-law', statusAtSessionEnd: 'became law' },

]

/* Progression flags
These are used to interpret what specific bill actions mean about the bill's status.
This is tricky logic.

*/

// Used for bill actions display prominence
const isMajor = true
const isHighlight = true

// Bill progression flags
const inDrafting = true
const draftRequest = true
const draftReady = true
const draftToSponsor = true
const introduction = true

const hearing = true
const floorDebate = true

// committee action tags
const committeeAction = true
const firstChamberFloorAction = true // Shouldn't apply to reconciliation
const secondChamberAction = true // including 2nd chamber committee here for brevity
const reconciliationAction = true
const governorAction = true

const advanced = true
const failed = true
const tabled = true
const amended = true
const withdrawn = true

const blasted = true
const preliminaryPassage = true // for 2nd readings
const finalPassage = true // for 3rd readings

const transmittedToGovernor = true // for bills in governor's posession
const vetoed = true
const amendmentSuggested = true
const signed = true
const vetoOverridePending = true
const vetoOverriddenHouse = true
const vetoOverriddenSenate = true
const vetoOverridden = true
const vetoOverrideFailed = true

const scheduledForFloorDebate = true
const scheduledForFinalVote = true

const missedDeadline = true

const ultimatelyFailed = true
const ultimatelyPassed = true

const committeeReferral = true
const committeeSubsequentReferral = true

const secretaryOfStateAction = true


export const ACTIONS = [
    // omitting {flag: false} fields here for clarity

    /* Dec. 21 thinking

    Key milestones:
    - Initial hearing
    - Passing first committee (or failing first committee)
        - committee votes forward
        - committee tables / votes down
        - chamber blast motions
    - Passing first chamber (or failing)
        - do pass / do pass as amended
    - Passing second chamber
        - do concur / do concur as amended
    - Passing reconciliation (if needed)
    - Passing governor via signature or veto override

    */

    // Introduction
    { key: 'Introduced', isMajor, isHighlight, introduction, },
    // Committee hearing
    { key: 'Hearing', isMajor, hearing },

    // general committee actions
    { key: 'Tabled in Committee', isMajor, isHighlight, committeeAction, secondChamberAction, failed, tabled },
    { key: 'Taken from Table in Committee', isMajor, committeeAction, secondChamberAction, },
    { key: 'Committee Vote Failed; Remains in Committee', isMajor, committeeAction, secondChamberAction, },
    { key: 'Reconsidered Previous Action; Remains in Committee', isMajor, committeeAction, secondChamberAction, },
    // Resolution commitee actions
    { key: 'Committee Executive Action--Resolution Adopted', isMajor, isHighlight, committeeAction, secondChamberAction, advanced },
    { key: 'Committee Executive Action--Resolution Adopted as Amended', isMajor, isHighlight, committeeAction, secondChamberAction, advanced, amended },
    { key: 'Committee Executive Action--Resolution Not Adopted', isMajor, isHighlight, committeeAction, secondChamberAction, failed },
    { key: 'Committee Executive Action--Resolution Not Adopted as Amended', isMajor, isHighlight, committeeAction, secondChamberAction, failed },
    // first chamber committee actions
    { key: 'Committee Executive Action--Bill Passed', isMajor, isHighlight, committeeAction, advanced },
    { key: 'Committee Executive Action--Bill Passed as Amended', isMajor, isHighlight, committeeAction, advanced, amended },
    { key: 'Committee Executive Action--Bill Not Passed', isMajor, isHighlight, committeeAction, failed },
    { key: 'Committee Executive Action--Bill Not Passed as Amended', isMajor, isHighlight, committeeAction, failed },
    {key: 'Committee Report--Bill Passed', isMajor, isHighlight, committeeAction, advanced },
    // second chamber committee actions
    { key: 'Committee Executive Action--Bill Concurred', isMajor, isHighlight, committeeAction, advanced, },
    { key: 'Committee Executive Action--Bill Concurred as Amended', isMajor, isHighlight, committeeAction, advanced, amended },
    { key: 'Committee Executive Action--Bill Not Concurred', isMajor, isHighlight, committeeAction, secondChamberAction, failed, },
    { key: 'Committee Executive Action--Bill Not Concurred as Amended', isMajor, isHighlight, committeeAction, secondChamberAction, failed },
    // secondChamberAction here to catch bills killed in second chamber committee. Leaving off other two lines to exclude conference committees.
    // Blast motions
    { key: 'Taken from Committee; Placed on 2nd Reading', isMajor, isHighlight, firstChamberFloorAction, secondChamberAction, advanced, blasted },

    // first chamber floor votes
    { key: '2nd Reading Passed', isMajor, isHighlight, firstChamberFloorAction, floorDebate, preliminaryPassage },
    { key: '2nd Reading Not Passed', isMajor, isHighlight, firstChamberFloorAction, secondChamberAction, floorDebate, failed },
    { key: '2nd Reading Not Passed as Amended', isMajor, isHighlight, firstChamberFloorAction, floorDebate, failed },
    { key: '2nd Reading Not Passed; 3rd Reading Vote Required', isMajor, isHighlight, firstChamberFloorAction, floorDebate, failed },
    { key: '2nd Reading Pass as Amended Motion Failed', isMajor, firstChamberFloorAction, floorDebate, failed },
    { key: '2nd Reading Pass Motion Failed', isMajor, firstChamberFloorAction, floorDebate, failed },
    { key: '2nd Reading Passed as Amended', isMajor, isHighlight, firstChamberFloorAction, floorDebate, preliminaryPassage, amended },
    { key: '3rd Reading Passed', isMajor, isHighlight, firstChamberFloorAction, advanced, finalPassage },
    // resolutions
    { key: 'Resolution Adopted', isMajor, isHighlight, firstChamberFloorAction, floorDebate, secondChamberAction, finalPassage },
    { key: 'Resolution Not Adopted', isMajor, isHighlight, firstChamberFloorAction, floorDebate, secondChamberAction, failed },
    { key: 'Resolution Failed', isMajor, isHighlight, firstChamberFloorAction, floorDebate, secondChamberAction, failed },
    { key: 'Adverse Committee Report Adopted', isMajor, isHighlight, firstChamberFloorAction, secondChamberAction, failed }, // Seems to be how resolutions are killed?
    // some constitutional amendments
    { key: '2nd Reading Pass Motion Failed; 3rd Reading Vote Required', isMajor, isHighlight, firstChamberFloorAction, floorDebate, advanced },
    { key: '3rd Reading Failed; 2nd House Vote Required', isMajor, isHighlight, firstChamberFloorAction, advanced, finalPassage },

    // 2005 session
    { key: '2nd Reading Passed as Amended on Voice Vote', isMajor, isHighlight, firstChamberFloorAction, amended, preliminaryPassage },
    { key: '2nd Reading Passed on Voice Vote', isMajor, isHighlight, firstChamberFloorAction, preliminaryPassage },
    { key: 'Placed on Consent Calendar', isMajor, isHighlight, firstChamberFloorAction },

    // second chamber floor votes
    { key: '2nd Reading Concurred', isMajor, isHighlight, secondChamberAction, floorDebate, preliminaryPassage },
    { key: '2nd Reading Not Concurred', isMajor, isHighlight, secondChamberAction, floorDebate, failed },
    { key: '2nd Reading Concurred as Amended', isMajor, isHighlight, secondChamberAction, floorDebate, preliminaryPassage, amended },
    { key: '2nd Reading Senate Amendments Not Concur Motion Failed', isMajor, isHighlight, floorDebate, secondChamberAction }, // One-off; See 2021 HB 63
    { key: '2nd Reading Not Concurred as Amended', isMajor, isHighlight, secondChamberAction, floorDebate, failed },
    { key: '2nd Reading Concur Motion Failed', isMajor, secondChamberAction, failed },
    { key: '2nd Reading Concur as Amended Motion Failed', isMajor, secondChamberAction, failed },
    { key: '3rd Reading Concurred', isMajor, isHighlight, secondChamberAction, advanced, finalPassage },
    // amendment votes
    { key: '2nd Reading Motion to Amend Carried', isMajor, amended },
    { key: '2nd Reading Motion to Amend Failed', isMajor, },
    // 2005 session
    { key: '2nd Reading Concurred on Voice Vote', isMajor, isHighlight, secondChamberAction, preliminaryPassage },
    { key: '2nd Reading Concurred as Amended on Voice Vote', isMajor, isHighlight, secondChamberAction, preliminaryPassage, amended },

    // either house floor votes
    { key: '3rd Reading Failed', isMajor, isHighlight, firstChamberFloorAction, secondChamberAction, failed },
    { key: '2nd Reading Indefinitely Postponed', isMajor, firstChamberFloorAction, secondChamberAction, failed },

    // Reconciliation votes
    { key: '2nd Reading Senate Amendments Concurred', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading Senate Amendments Not Concurred', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading House Amendments Concurred', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading House Amendments Not Concurred', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading House Amendments Concur Motion Failed', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading House Amendments Not Concur Motion Failed', isMajor, isHighlight, floorDebate, reconciliationAction },
    { key: '2nd Reading Concur Motion Failed; 3rd Reading Vote Required', isMajor, isHighlight, floorDebate, reconciliationAction },

    { key: '2nd Reading Conference Committee Report Adopted', isMajor, floorDebate, reconciliationAction },
    { key: '2nd Reading Free Conference Committee Report Adopted', isMajor, floorDebate, reconciliationAction },
    { key: '2nd Reading Conference Committee Report Rejected', isMajor, floorDebate, reconciliationAction },
    { key: '2nd Reading Free Conference Committee Report Rejected', isMajor, floorDebate, reconciliationAction },


    { key: "2nd Reading Governor's Proposed Amendments Adopt Motion Failed", isMajor, floorDebate, reconciliationAction },
    { key: "2nd Reading Governor's Proposed Amendments Adopted", isMajor, floorDebate, reconciliationAction },
    { key: "2nd Reading Governor's Proposed Amendments Not Adopted", isMajor, floorDebate, reconciliationAction },
    { key: "2nd Reading Governor's Proposed Amendments Not Adopt Motion Failed", isMajor, floorDebate, reconciliationAction },

    { key: '3rd Reading Passed as Amended by House', isMajor, isHighlight, reconciliationAction, advanced },
    { key: '3rd Reading Not Passed as Amended by House', isMajor, isHighlight, reconciliationAction, failed},
    { key: '3rd Reading Passed as Amended by Senate', isMajor, isHighlight, reconciliationAction, advanced },
    { key: '3rd Reading Not Passed as Amended by Senate', isMajor, isHighlight, reconciliationAction, failed},

    { key: '3rd Reading Conference Committee Report Adopted', isMajor, reconciliationAction, advanced },
    { key: '3rd Reading Conference Committee Report Rejected', isMajor, reconciliationAction },
    { key: '3rd Reading Free Conference Committee Report Adopted', isMajor, reconciliationAction, advanced },
    { key: "3rd Reading Governor's Proposed Amendments Adopted", isMajor, reconciliationAction, advanced },

    // Governor
    { key: 'Vetoed by Governor', isMajor, isHighlight, governorAction, failed, vetoed },
    { key: 'Signed by Governor', isMajor, isHighlight, governorAction, signed },
    { key: 'Returned with Governor\'s Proposed Amendments', isMajor, isHighlight, governorAction, amendmentSuggested },
    { key: 'Returned with Governor\'s Line-item Veto', isMajor, isHighlight, governorAction, vetoed },
    { key: 'Veto Overridden in Senate', isMajor, isHighlight, governorAction, vetoed, vetoOverriddenSenate },
    { key: 'Veto Overridden in House', isMajor, isHighlight, governorAction, vetoed, vetoOverriddenHouse },
    { key: 'Veto Overridden by Legislature', isMajor, isHighlight, governorAction, vetoed, vetoOverridden },
    { key: 'Veto Override Vote Mail Poll in Progress', isMajor, governorAction, failed, vetoed, vetoOverridePending },
    { key: 'Veto Override Failed in Legislature', isMajor, governorAction, failed, vetoed, vetoOverrideFailed },
    { key: 'Veto Override Motion Failed in House', isMajor, governorAction, failed, vetoed, vetoOverrideFailed },
    { key: 'Veto Override Motion Failed in Senate', isMajor, governorAction, failed, vetoed, vetoOverrideFailed },
    { key: 'Line-item Veto Override Failed', isMajor, governorAction, failed, vetoed, vetoOverrideFailed },

    // Other major votes
    { key: 'Motion Carried', isMajor, },
    { key: 'Motion Failed', isMajor, },
    { key: 'Motion to Reconsider Failed', isMajor, },
    { key: 'On Motion Rules Suspended', isMajor, },
    { key: 'Reconsidered Previous Action; Placed on 2nd Reading', isMajor, },
    { key: 'Reconsidered Previous Action; Remains in 2nd Reading Process', isMajor, },
    { key: 'Reconsidered Previous Action; Remains in 3rd Reading Process', isMajor, },
    { key: 'Reconsidered Previous Act; Remains in 2nd Reading FCC Process', isMajor, },
    { key: 'Rules Suspended to Accept Late Return of Amended Bill', isMajor, },
    { key: 'Segregated from Committee of the Whole Report', isMajor, },


    // Transmittal milestones
    { key: 'Transmitted to House', isMajor, },
    { key: 'Transmitted to Senate', isMajor, },
    { key: 'Transmitted to Governor', isMajor, transmittedToGovernor },



    // Committee referrals
    { key: 'Referred to Committee', isMajor, committeeReferral },
    { key: 'Rereferred to Committee', isMajor, committeeReferral, committeeSubsequentReferral },
    { key: 'Taken from 2nd Reading; Rereferred to Committee', isMajor, committeeReferral },

    // Other major, no votes expected
    { key: 'First Reading', isMajor, introduction },
    { key: 'Bill Not Heard at Sponsor\'s Request', isMajor, committeeAction, withdrawn },
    { key: 'Bill Withdrawn per House Rule H30-50(3)(b)', isMajor, isHighlight, committeeAction, withdrawn },
    { key: 'Bill Withdrawn', isMajor, isHighlight, committeeAction, withdrawn },
    { key: 'Taken from 3rd Reading; Placed on 2nd Reading', isMajor, },
    { key: 'Returned to House', isMajor, },
    { key: 'Returned to Senate', isMajor, },
    { key: 'Returned to House with Amendments', isMajor, },
    { key: 'Returned to Senate with Amendments', isMajor, },
    { key: 'Transmitted to Senate for Consideration of Governor\'s Proposed Amendments', isMajor, },
    { key: 'Transmitted to House for Consideration of Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to Senate Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to Senate Not Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to House Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to House Not Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Rules Suspended to Accept Late Transmittal of Bill', isMajor, },



    // Deadlines
    { key: 'Missed Deadline for General Bill Transmittal', isMajor, committeeAction, failed, missedDeadline },
    { key: 'Missed Deadline for Revenue Bill Transmittal', isMajor, committeeAction, failed, missedDeadline },
    { key: 'Missed Deadline for Appropriation Bill Transmittal', isMajor, committeeAction, failed, missedDeadline },
    { key: 'Missed Deadline for Referendum Proposal Transmittal', isMajor, committeeAction, failed, missedDeadline },
    { key: 'Missed Deadline for Revenue Estimating Resolution Transmittal', isMajor, committeeAction, failed, missedDeadline },

    // Ultimate outcomes
    { key: 'Died in Standing Committee', isMajor, ultimatelyFailed },
    { key: 'Died in Process', isMajor, firstChamberFloorAction, ultimatelyFailed }, // resolutions?
    { key: 'Chapter Number Assigned', isMajor, ultimatelyPassed, secretaryOfStateAction },
    { key: 'Filed with Secretary of State', isMajor, ultimatelyPassed },

    // conference committees
    { key: 'Free Conference Committee Appointed', isMajor, },
    { key: 'Free Conference Committee Report Received', isMajor, },
    { key: 'Conference Committee Appointed', isMajor, },
    { key: 'Conference Committee Report Received', isMajor, },
    { key: '2nd Reading Free Conference Committee Report Adopt Motion Failed', isMajor },


    // Minor actions (exclude from default bill table view)
    { key: 'Drafter Assigned', inDrafting },
    { key: 'Draft Request Received', inDrafting, draftRequest },
    { key: 'Bill Draft Text Available Electronically', inDrafting, draftReady },
    { key: 'Draft Back for Redo', inDrafting},
    { key: 'Draft Back for Requester Changes', inDrafting},
    { key: 'Draft On Hold', inDrafting},
    { key: 'Draft Ready for Delivery', inDrafting},
    { key: 'Draft Taken Off Hold', inDrafting},
    { key: 'Draft Taken by Drafter', inDrafting},
    { key: 'Draft in Assembly', inDrafting},
    { key: 'Draft in Edit', inDrafting},
    { key: 'Draft in Final Drafter Review', inDrafting},
    { key: 'Draft in Input/Proofing', inDrafting},
    { key: 'Draft in Legal Review', inDrafting},
    { key: 'Draft to Drafter - Edit Review', inDrafting},
    { key: 'Draft to Drafter - Edit Review [CMD]', inDrafting},
    { key: 'Draft to Drafter - Edit Review [KWK]', inDrafting},
    { key: 'Draft to Drafter - Edit Review [SMH]', inDrafting},
    { key: 'Draft to Requester for Review', inDrafting},
    { key: 'Executive Director Final Review', inDrafting},
    { key: 'Executive Director Review', inDrafting},

    { key: 'Draft Delivered to Requester', draftToSponsor},

    { key: 'Fiscal Note Printed', },
    { key: 'Fiscal Note Probable', },
    { key: 'Fiscal Note Received', },
    { key: 'Fiscal Note Requested', },
    { key: 'Fiscal Note Requested (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Received (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Signed (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Printed (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Signed', },
    { key: 'Fiscal Note Unsigned', },
    { key: 'Pre-Introduction Letter Sent', },
    { key: 'Printed - Enrolled Version Available', },
    { key: 'Printed - New Version Available', },
    { key: 'Returned from Enrolling', },
    { key: 'Revised Fiscal Note Printed', },
    { key: 'Revised Fiscal Note Printed (Local Government Fiscal Impact)', },
    { key: 'Revised Fiscal Note Received', },
    { key: 'Revised Fiscal Note Requested', },
    { key: 'Revised Fiscal Note Signed', },
    { key: 'Fiscal Impact Unchanged' },
    { key: 'Scheduled for 2nd Reading', scheduledForFloorDebate },
    { key: '2nd Reading Pass Consideration' },
    { key: '2nd Reading Indefinitely Postpone Motion Failed' },
    { key: 'Scheduled for 3rd Reading', scheduledForFinalVote },
    { key: '3rd Reading Pass Consideration' },
    { key: 'Scheduled for Executive Action', },
    { key: 'Sent to Enrolling', },
    { key: 'Signed by Speaker', },
    { key: 'Signed by President', },
    { key: 'Sponsor List Modified', },
    { key: 'Sponsor Rebuttal to Fiscal Note Printed', },
    { key: 'Sponsor Rebuttal to Fiscal Note Received', },
    { key: 'Sponsor Rebuttal to Fiscal Note Requested', },
    { key: 'Sponsor Rebuttal to Fiscal Note Signed', },
    { key: 'Sponsors Engrossed', },
    { key: 'Legal Review Note', },
    { key: 'Introduced Bill Text Available Electronically', },
    { key: 'Clerical Corrections Made - New Version Available', },
    { key: 'Veto Override Vote Mail Poll Letter Being Prepared', },
    { key: 'Conference Committee Dissolved', },
    { key: 'Free Conference Committee Dissolved', },
    { key: 'Special Note', },
    { key: 'Hearing Canceled', },
    { key: 'Amendments Available', },
    { key: 'Draft Canceled', },
    // Committee reports redundant w/ Executive Action
    // flagged here for reasons
    { key: 'Committee Report--Resolution Adopted' },
    { key: 'Committee Report--Bill Not Passed' },
    { key: 'Committee Report--Bill Not Concurred' },
    { key: 'Committee Report--Bill Passed' },
    { key: 'Committee Report--Bill Passed as Amended' },
    { key: 'Committee Report--Bill Concurred as Amended' },
    { key: 'Committee Report--Bill Concurred' },
    { key: 'Committee Report--Resolution Adopted as Amended' },
    { key: 'Committee Report--Resolution Not Adopted' },
]