import { dateParse, dateFormat } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0); // 7 accounts for Montana vs GMT time
        const formattedBeginningOfToday = dateFormat(new Date(beginningOfToday)); // Format to MM/DD/YYYY
        console.log({ formattedBeginningOfToday });

        // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') >= beginningOfToday,
        // })
        // console.log(actions)
        // console.log({formattedUpdateTime})
        // const todayOrLaterActions = actions.filter(d => dateParse(d.data.date) >= beginningOfToday)
        const todayOrLaterActions = actions.filter(d => {
            const parsedDate = dateParse(d.data.date);
            console.log('Parsed Date:', parsedDate, '>=', beginningOfToday, parsedDate >= beginningOfToday);
            return parsedDate >= beginningOfToday;
        });
        console.log('Today or Later Actions:', todayOrLaterActions);

        const firstTodayAction = todayOrLaterActions[0];
        console.log({ firstTodayAction });

        const scheduledHearings = todayOrLaterActions.filter(d => d.data.committeeHearingTime);
        const scheduledFloorDebates = todayOrLaterActions.filter(d => d.data.scheduledForFloorDebate);
        const scheduledFinalVotes = todayOrLaterActions.filter(d => d.data.scheduledForFinalVote);
        const datesOnCalendar = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => d.data.date)))
            .sort((a, b) => dateParse(a) - dateParse(b));

        const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.data.bill)));

        this.data = {
            datesOnCalendar,
            billsOnCalendar,
            scheduledHearings,
            scheduledFloorDebates,
            scheduledFinalVotes,
            calendarAnnotations,
        };
    }

    export = () => ({ ...this.data });
}