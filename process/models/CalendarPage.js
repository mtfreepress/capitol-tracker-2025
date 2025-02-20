import { dateParse, dateFormat } from '../functions.js'

export default class CalendarPage {
    constructor({ actions, updateTime, calendarAnnotations }) {
    const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
    const formattedBeginningOfToday = dateFormat(new Date(beginningOfToday))
    console.log({formattedBeginningOfToday})


        // For checking that server is handling dates the same as my local machine
        // console.log({
        //     updateTime,
        //     beginningOfToday: new Date(beginningOfToday),
        //     parseCheck: new Date(dateParse('01/11/2023')),
        //     compare: dateParse('01/11/2023') >= beginningOfToday,
        // })
        function filterActionsFromToday(actions) {
            // Create today's date at midnight MT (UTC-7)
            const today = new Date();
            today.setUTCHours(7, 0, 0, 0);
            
            // Format today's date as MM/DD/YYYY with padded numbers
            const todayFormatted = today.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        
            const todayOrLaterActions = actions.filter(action => {
                // Use committeeHearingTime date if it exists, otherwise use action.data.date
                const dateToCompare = action.data.committeeHearingTime || action.data.date;
                
                // Split both dates into [month, day, year]
                const [actionMonth, actionDay, actionYear] = dateToCompare.split('/').map(Number);
                const [todayMonth, todayDay, todayYear] = todayFormatted.split('/').map(Number);
        
                // Compare components in order: year, month, day
                if (actionYear !== todayYear) return actionYear > todayYear;
                if (actionMonth !== todayMonth) return actionMonth > todayMonth;
                return actionDay >= todayDay;
            });
        
            return todayOrLaterActions;
        }
        
        // Example usage:
        const todayOrLaterActions = filterActionsFromToday(actions);
        // Create a map for each date's data
        const dateMap = todayOrLaterActions.reduce((acc, action) => {
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

        // Convert Sets to Arrays and create sorted lists
        const dates = Object.values(dateMap).map(date => ({
            ...date,
            billsInvolved: Array.from(date.billsInvolved).sort()
        }));

        // Maintain backward compatibility for existing code
        const allBills = new Set();
        Object.values(dateMap).forEach(date => {
            date.billsInvolved.forEach(bill => allBills.add(bill));
        });

        this.data = {
            // New structure
            dates: dates,
            dateKeys: Object.keys(dateMap).sort(),
            dateMap: dateMap,

            // Backward compatible properties
            billsOnCalendar: Array.from(allBills).sort(),
            datesOnCalendar: Object.keys(dateMap).sort(),
            scheduledHearings: todayOrLaterActions.filter(d => d.data.committeeHearingTime),
            scheduledFloorDebates: todayOrLaterActions.filter(d => d.data.scheduledForFloorDebate),
            scheduledFinalVotes: todayOrLaterActions.filter(d => d.data.scheduledForFinalVote),
            calendarAnnotations
        };
    }

    export = () => ({ ...this.data })
}


// TODO: Delete old code if new code works:

// import { dateParse, dateFormat } from '../functions.js'

// export default class CalendarPage {
//     constructor({ actions, updateTime, calendarAnnotations }) {
//     const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
//     const formattedBeginningOfToday = dateFormat(new Date(beginningOfToday))
//     console.log({formattedBeginningOfToday})


//         // For checking that server is handling dates the same as my local machine
//         // console.log({
//         //     updateTime,
//         //     beginningOfToday: new Date(beginningOfToday),
//         //     parseCheck: new Date(dateParse('01/11/2023')),
//         //     compare: dateParse('01/11/2023') >= beginningOfToday,
//         // })
//         function filterActionsFromToday(actions) {
//             // Create today's date at midnight MT (UTC-7)
//             const today = new Date();
//             today.setUTCHours(7, 0, 0, 0);
            
//             // Format today's date as MM/DD/YYYY with padded numbers
//             const todayFormatted = today.toLocaleDateString('en-US', {
//                 month: '2-digit',
//                 day: '2-digit',
//                 year: 'numeric'
//             });
        
//             const todayOrLaterActions = actions.filter(action => {
//                 // Use committeeHearingTime date if it exists, otherwise use action.data.date
//                 const dateToCompare = action.data.committeeHearingTime || action.data.date;
                
//                 // Split both dates into [month, day, year]
//                 const [actionMonth, actionDay, actionYear] = dateToCompare.split('/').map(Number);
//                 const [todayMonth, todayDay, todayYear] = todayFormatted.split('/').map(Number);
        
//                 // Compare components in order: year, month, day
//                 if (actionYear !== todayYear) return actionYear > todayYear;
//                 if (actionMonth !== todayMonth) return actionMonth > todayMonth;
//                 return actionDay >= todayDay;
//             });
        
//             return todayOrLaterActions;
//         }
        
//         // Example usage:
//         const todayOrLaterActions = filterActionsFromToday(actions);
//         const scheduledHearings = todayOrLaterActions.filter(d => d.data.committeeHearingTime)
//         // console.log({scheduledHearings})
//         const scheduledFloorDebates = todayOrLaterActions.filter(d => d.data.scheduledForFloorDebate)
//         // console.log({scheduledFloorDebates})
//         const scheduledFinalVotes = todayOrLaterActions.filter(d => d.data.scheduledForFinalVote)
//         // console.log({scheduledFinalVotes})
//         const datesOnCalendar = Array.from(new Set(
//             scheduledHearings
//                 .concat(scheduledFloorDebates)
//                 .concat(scheduledFinalVotes)
//                 .map(d => d.data.committeeHearingTime || d.data.date)
//         )).sort((a, b) => dateParse(a) - dateParse(b));

//         // list of bills used to merge in bill data via graphql query on the frontend
//         const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.data.bill)))

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