import { collectJsons, writeJson } from './utils.js';

let actionsRaw = collectJsons('./inputs/bills/*/*-actions.json') || [];
// flatten to get rid of nested array issue
actionsRaw = Array.isArray(actionsRaw) && actionsRaw.some(Array.isArray) ? actionsRaw.flat() : actionsRaw;
const votesRaw = collectJsons('./inputs/bills/*/*-votes.json') || [];

// group actions by bill name with desired structure
const actionsGroupedByBill = actionsRaw.reduce((acc, action) => {
    const relatedVotes = votesRaw.filter(vote => vote.bill === action.bill);
    if (!acc[action.bill]) {
        acc[action.bill] = {
            bill: action.bill,
            actions: []
        };
    }

    acc[action.bill].actions.push({
        ...action,
        votes: relatedVotes || []
    });

    return acc;
}, {});

// alphabatize and sort into desired structure to match old data:
const actionsOutput = Object.values(actionsGroupedByBill).sort((a, b) => a.bill.localeCompare(b.bill));
writeJson('./src/data/bill-actions-TEST.json', actionsOutput);