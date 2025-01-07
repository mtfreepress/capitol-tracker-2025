import { dateParse } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time

        // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') >= beginningOfToday,
        // })

        const todayOrLaterActions = actions.filter(d => dateParse(d.date) >= beginningOfToday)
        const scheduledHearings = todayOrLaterActions.filter(d => d.hearing)
        const scheduledFloorDebates = todayOrLaterActions.filter(d => d.scheduledForFloorDebate)
        const scheduledFinalVotes = todayOrLaterActions.filter(d => d.scheduledForFinalVote)
        const datesOnCalendar = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => d.date)))
            .sort((a, b) => dateParse(a) - dateParse(b))

        // list of bills used to merge in bill data via graphql query on the frontend
        const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.bill)))

        this.data = {
            datesOnCalendar,
            billsOnCalendar,
            scheduledHearings,
            scheduledFloorDebates,
            scheduledFinalVotes,
            calendarAnnotations,
        }
    }
    export = () => ({ ...this.data })

}