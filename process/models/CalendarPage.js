import { dateParse, dateFormat } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
        const formattedBeginningOfToday = dateFormat(new Date(beginningOfToday))

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

        const canceledHearings = actions
            .filter(action => action.data.description === "Hearing Canceled")
            .reduce((map, action) => {
                // create unique key for hearing
                const key = `${action.data.bill}|${action.data.committee}|${action.data.committeeHearingTime}`;
                map[key] = true;
                return map;
            }, {});

        const dateMap = actions.reduce((acc, action) => {
            if (action.data.description === "Hearing Canceled") return acc;

            // check if canceled by key
            if (action.data.committeeHearingTime && action.data.committee) {
                const hearingKey = `${action.data.bill}|${action.data.committee}|${action.data.committeeHearingTime}`;
                if (canceledHearings[hearingKey]) {
                    // skip hearing if canceled
                    return acc;
                }
            }

            let date = action.data.committeeHearingTime ||
                (action.data.isCommitteeAction ? action.data.date : null);

            if (action.data.scheduledForFloorDebate || action.data.scheduledForFinalVote) {
                date = action.data.date;
            }

            if (!date) {
                return acc;
            }

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

            if (action.data.committeeHearingTime || action.data.isCommitteeAction) {
                acc[pageKey].hearings.push(action);
            }

            if (action.data.scheduledForFloorDebate) {
                acc[pageKey].floorDebates.push(action);
            }

            if (action.data.scheduledForFinalVote) {
                acc[pageKey].finalVotes.push(action);
            }

            if (!acc[pageKey].billsInvolved.includes(action.data.bill)) {
                acc[pageKey].billsInvolved.push(action.data.bill);
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

        // Generate endpoints for all days in months with valid legislative days
        const allDates = new Set(Object.keys(dateMap));
        Object.keys(dateMap).forEach(key => {
            const [month, , year] = key.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = String(day).padStart(2, '0');
                const newKey = `${String(month).padStart(2, '0')}-${dayStr}-${year}`;
                if (!allDates.has(newKey)) {
                    allDates.add(newKey);
                    dateMap[newKey] = {
                        key: newKey,
                        date: `${String(month).padStart(2, '0')}/${dayStr}/${year}`,
                        hearings: [],
                        floorDebates: [],
                        finalVotes: [],
                        annotation: null,
                        billsInvolved: []
                    };
                }
            }
        });

        const sortedDateKeys = Array.from(allDates)
            .map(key => dateMap[key].date)
            .sort(compareDates)
            .map(date => date.replace(/\//g, '-'));

        const dates = sortedDateKeys.map(key => ({
            ...dateMap[key],
            billsInvolved: dateMap[key].billsInvolved.sort()
        }));

        this.data = {
            dates,
            dateKeys: sortedDateKeys,
            dateMap,
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