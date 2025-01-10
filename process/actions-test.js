import { collectJsons, writeJson } from './utils.js';

const actionsRaw = collectJsons('./inputs/bills/*/*-actions.json');
const votesRaw = collectJsons('./inputs/bills/*/*-votes.json');

const actions = actionsRaw || [];
const votes = votesRaw || [];

const actionsGroupedByBill = {};

actions.forEach(action => {
    const relatedVotes = votes.filter(vote => vote.bill === action.bill);
    
    if (!actionsGroupedByBill[action.bill]) {
        actionsGroupedByBill[action.bill] = {
            bill: action.bill,
            actions: []
        };
    }
    
    actionsGroupedByBill[action.bill].actions.push({
        ...action,
        votes: relatedVotes || []
    });
});

const actionsOutput = Object.values(actionsGroupedByBill);

console.log('Grouped Actions by Bill:', JSON.stringify(actionsOutput, null, 2));

writeJson('./src/data/bill-actions-TEST.json', actionsOutput);
