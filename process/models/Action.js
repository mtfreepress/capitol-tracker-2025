import { ACTIONS } from '../config/procedure.js';

export default class Action {
    constructor({ action, vote, firstChamber }) {
        const {
            id,
            bill,
            date,
            description,
            possession, // Correct property name
            committee,
            actionUrl,
            recordings,
            transcriptUrl,
        } = action;

        const standardizedDescription = description.replace(/\((C|LC|H|S)\) /, '').replace(/\&nbsp/g, '');

        this.vote = vote;

        this.data = {
            id,
            bill,
            date: new Date(date).toISOString(),
            description: standardizedDescription,
            possession: possession || firstChamber, // Set possession based on firstChamber if not already set
            committee,
            actionUrl,
            recordings,
            transcriptUrl: transcriptUrl || null,
            ...this.getActionFlags(standardizedDescription),
        };

        // Log the action data for debugging
        console.log('Action Data:', this.data);
    }

    getActionFlags = (description) => {
        const match = ACTIONS.find(d => d.key === description);
        if (!match) console.log('Missing category for bill action:', description);
        console.log('Action Flags:', { description, match }); // Debug log
        return { ...match };
    };

    exportActionDataOnly = () => this.data;
    export = () => ({ ...this.data, vote: this.vote ? this.vote.export() : null });
}