import { collectJsons, writeJson } from './utils.js';

// Collect actions and votes data
const actionsRaw = collectJsons('./inputs/bills/*/*-actions.json');
const votesRaw = collectJsons('./inputs/bills/*/*-votes.json');

// Default to empty arrays if no data is collected
const actions = actionsRaw || [];
const votes = votesRaw || [];

// Group actions by bill and associate them with related votes (if necessary)
const actionsGroupedByBill = actions.reduce((acc, action) => {
    // Find related votes for each action (if necessary)
    const relatedVotes = votes.filter(vote => vote.bill === action.bill);

    // Add action to the corresponding bill group
    if (!acc[action.bill]) {
        acc[action.bill] = {
            bill: action.bill, // bill identifier
            actions: [] // actions for this bill
        };
    }

    acc[action.bill].actions.push({
        ...action, // action data
        votes: relatedVotes || [] // add votes if any
    });

    return acc;
}, {});

// Convert the grouped actions to an array for output
const actionsOutput = Object.values(actionsGroupedByBill);

// Debug: Log the output to check the structure
console.log('Grouped Actions by Bill:', JSON.stringify(actionsOutput, null, 2));

// Output the actions in the desired format
writeJson('./src/data/bill-actions-TEST.json', actionsOutput);
