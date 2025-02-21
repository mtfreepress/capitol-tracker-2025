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

        // Sort function for dates
        const compareDates = (a, b) => {
            return parseDate(a) - parseDate(b);
        };

        const dateMap = actions.reduce((acc, action) => {
            const date = action.data.committeeHearingTime || action.data.date;
            const pageKey = date.replace(/\//g, '-');

            if (!acc[pageKey]) {
                acc[pageKey] = {
                    key: pageKey,
                    date: date,
                    hearings: [],
                    floorDebates: [],
                    finalVotes: [],
                    annotation: calendarAnnotations?.[date] || null,
                    billsInvolved: []
                };
            }

            // Sort action into appropriate category
            if (action.data.committeeHearingTime) {
                acc[pageKey].hearings.push(action);
            }
            if (action.data.scheduledForFloorDebate) {
                acc[pageKey].floorDebates.push(action);
            }
            if (action.data.scheduledForFinalVote) {
                acc[pageKey].finalVotes.push(action);
            }

            // Add bill to billsInvolved if not already present
            if (!acc[pageKey].billsInvolved.includes(action.data.bill)) {
                acc[pageKey].billsInvolved.push(action.data.bill);
            }

            return acc;
        }, {});

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