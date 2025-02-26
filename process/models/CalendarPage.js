import { dateParse, dateFormat } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
        const formattedBeginningOfToday = dateFormat(new Date(beginningOfToday))
        console.log({ formattedBeginningOfToday })


        // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') >= beginningOfToday,
        // })

        // Helper function to convert MM/DD/YYYY to comparable date


        const parseDate = (dateStr) => {
            const [month, day, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        };

        const compareDates = (a, b) => {
            return parseDate(a) - parseDate(b);
        };

        const dateMap = actions.reduce((acc, action) => {
            // Debug floor debates and final votes
            // if (action.data.scheduledForFloorDebate || action.data.scheduledForFinalVote) {
            //     console.log('Debug Action:', {
            //         type: action.data.scheduledForFloorDebate ? 'Floor Debate' : 'Final Vote',
            //         bill: action.data.bill,
            //         date: action.data.date,
            //         description: action.data.description
            //     });
            // }

            if (action.data.description === "Hearing Canceled") return acc;

            // Process committee hearing time (future date)
            if (action.data.committeeHearingTime) {
                const hearingDate = action.data.committeeHearingTime;
                const hearingPageKey = hearingDate.replace(/\//g, '-');

                // Initialize or update the entry for the hearing date
                if (!acc[hearingPageKey]) {
                    acc[hearingPageKey] = {
                        key: hearingPageKey,
                        date: hearingDate,
                        hearings: [],
                        floorDebates: [],
                        finalVotes: [],
                        annotation: calendarAnnotations?.[hearingDate] || null,
                        billsInvolved: []
                    };
                }

                acc[hearingPageKey].hearings.push(action);

                if (!acc[hearingPageKey].billsInvolved.includes(action.data.bill)) {
                    acc[hearingPageKey].billsInvolved.push(action.data.bill);
                }
            }

            // Also process original bill date (could be in 2024)
            if (action.data.date) {
                const billDate = action.data.date;
                const billPageKey = billDate.replace(/\//g, '-');

                if (!acc[billPageKey]) {
                    acc[billPageKey] = {
                        key: billPageKey,
                        date: billDate,
                        hearings: [],
                        floorDebates: [],
                        finalVotes: [],
                        annotation: calendarAnnotations?.[billDate] || null,
                        billsInvolved: []
                    };
                }

                // Add to appropriate arrays based on action type
                if (action.data.isCommitteeAction) {
                    acc[billPageKey].hearings.push(action);
                }

                if (action.data.scheduledForFloorDebate) {
                    acc[billPageKey].floorDebates.push(action);
                }

                if (action.data.scheduledForFinalVote) {
                    acc[billPageKey].finalVotes.push(action);
                }

                if (!acc[billPageKey].billsInvolved.includes(action.data.bill)) {
                    acc[billPageKey].billsInvolved.push(action.data.bill);
                }
            }

            return acc;
        }, {});

        // Debug the final dateMap
        // console.log('Final dateMap stats:', {
        //     totalDates: Object.keys(dateMap).length,
        //     datesWithFloorDebates: Object.values(dateMap)
        //         .filter(d => d.floorDebates.length > 0).length,
        //     datesWithFinalVotes: Object.values(dateMap)
        //         .filter(d => d.finalVotes.length > 0).length,
        //     sampleDate: Object.values(dateMap)[0]
        // });

        const sortedDateKeys = Object.keys(dateMap)
            .map(key => dateMap[key].date) // Get original date format (MM/DD/YYYY)
            .sort(compareDates)
            .map(date => date.replace(/\//g, '-')); // Convert back to key format

        const dates = sortedDateKeys.map(key => ({
            ...dateMap[key],
            billsInvolved: dateMap[key].billsInvolved.sort()
        }));

        this.data = {
            // New structure with chronologically sorted dates
            dates,
            dateKeys: sortedDateKeys,
            dateMap,

            // Backward compatible properties with sorted dates
            billsOnCalendar: Array.from(new Set(dates.flatMap(d => d.billsInvolved))).sort(),
            datesOnCalendar: sortedDateKeys.map(key => key.replace(/-/g, '/')),
            scheduledHearings: actions.filter(d => d.data.committeeHearingTime),
            scheduledFloorDebates: actions.filter(d => d.data.scheduledForFloorDebate),
            scheduledFinalVotes: actions.filter(d => d.data.scheduledForFinalVote),
            calendarAnnotations
        };
    }

    export = () => ({ ...this.data })
}