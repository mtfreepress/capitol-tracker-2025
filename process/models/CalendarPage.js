import { dateParse } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
        const formattedUpdateTime = new Date(beginningOfToday).toLocaleDateString('en-US'); // Format to MM/DD/YYYY

        // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') >= beginningOfToday,
        // })
        // console.log(actions)
        console.log({formattedUpdateTime})
        // const todayOrLaterActions = actions.filter(d => dateParse(d.data.date) >= beginningOfToday)
        const todayOrLaterActions = actions.filter(d => {
            const parsedDate = dateParse(d.data.date);
            console.log('Parsed Date:', parsedDate, '>=', beginningOfToday, parsedDate >= beginningOfToday);
            return parsedDate >= beginningOfToday;
        });
        console.log('Today or Later Actions:', todayOrLaterActions);
        const firstTodayAction = todayOrLaterActions[0]
        console.log({firstTodayAction})
        // console.log({todayOrLaterActions})
        const scheduledHearings = todayOrLaterActions.filter(d => d.data.committeeHearingTime)
        // console.log({scheduledHearings})
        const scheduledFloorDebates = todayOrLaterActions.filter(d => d.data.scheduledForFloorDebate)
        // console.log({scheduledFloorDebates})
        const scheduledFinalVotes = todayOrLaterActions.filter(d => d.data.scheduledForFinalVote)
        // console.log({scheduledFinalVotes})
        const datesOnCalendar = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => d.data.date)))
            .sort((a, b) => dateParse(a) - dateParse(b))

        // list of bills used to merge in bill data via graphql query on the frontend
        const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.data.bill)))

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



// import { dateParse } from '../functions.js'

// export default class CalendarPage {
//     constructor({ actions, updateTime, calendarAnnotations }) {
//         const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0); // 7 accounts for Montana vs GMT time
//         const formattedUpdateTime = new Date(beginningOfToday).toLocaleDateString('en-US'); // Format to MM/DD/YYYY
//         // console.log('Update Time:', updateTime);
//         // console.log('Beginning of Today:', new Date(beginningOfToday));
//         // console.log('Formatted Update Time:', formattedUpdateTime);
//         // For checking that server is handling dates the same as my local machine
//         // console.log({
//         //     updateTime,
//         //     beginningOfToday: new Date(beginningOfToday),
//         //     parseCheck: new Date(dateParse('01/11/2023')),
//         //     compare: dateParse('01/11/2023') >= beginningOfToday,
//         // })
//         // console.log({actions})
//         const todayOrLaterActions = actions.filter(d => {
//             const parsedDate = dateParse(d.date);
//             const formattedParsedDate = new Date(parsedDate).toLocaleDateString('en-US');
//             // console.log('Parsed Date:', formattedParsedDate, '>=', formattedUpdateTime, formattedParsedDate >= formattedUpdateTime);
//             return formattedParsedDate >= formattedUpdateTime;
//         });
//         // console.log('Today or Later Actions:', todayOrLaterActions);

//         const scheduledHearings = todayOrLaterActions.filter(d => d.committeeHearingTime);
//         // console.log('Scheduled Hearings:', scheduledHearings);
//         const scheduledFloorDebates = todayOrLaterActions.filter(d => d.scheduledForFloorDebate);
//         const scheduledFinalVotes = todayOrLaterActions.filter(d => d.scheduledForFinalVote);
//         const datesOnCalendar = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => d.date)))
//             .sort((a, b) => dateParse(a) - dateParse(b));

//         // list of bills used to merge in bill data via graphql query on the frontend
//         const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.bill)));

//         this.data = {
//             datesOnCalendar,
//             billsOnCalendar,
//             scheduledHearings,
//             scheduledFloorDebates,
//             scheduledFinalVotes,
//             calendarAnnotations,
//         }
//     }
//     export = () => ({ ...this.data })
// }