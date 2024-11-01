
import { format } from 'd3-format'
import { timeFormat, timeParse } from 'd3-time-format'

// Numeric displays
export const dollarFormat = format('$,.0f')
export const percentFormat = format('.0%')
export const numberFormat = format(',')
export const floatFormat = format('.01f')
// export const dateFormat = timeFormat('%-m/%-d/%y')
export const dateFormat = timeFormat('%b %-d')
export const dateFormatWithYear = timeFormat('%b %-d, %Y')
export const formatTime = timeFormat('%-I:%M %p, %-m/%-d/%y')
export const formatTimeLong = timeFormat('%-I:%M %p %b %-d, %Y')
export const dateFormatLong = timeFormat('%B %-d')
export const dateFormatWithWeekday = timeFormat('%A, %B %-d')
export const shortDateWithWeekday = timeFormat('%A, %b %-d')


// Routing
export const billUrl = identifier => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)
export const lawmakerUrl = name => name.replace(/\s/g, '-') // These have capitals on them
export const committeeUrl = name => name.replace(/\s/g, '-').replace(/,/g, '').toLowerCase()
export const urlize = text => text.replace(/'/g, '').replace(/\s/g, '-').toLowerCase()


// Misc
export const parseDate = timeParse('%Y-%m-%d')
export const pluralize = value => (value === 1) ? '' : 's'
export const capitalize = string => `${string[0].toUpperCase()}${string.slice(1)}`
export const ordinalize = value => ({
  1: "First",
  2: "Second",
  3: "Third",
  4: "Fourth",
  5: "Fifth",
  6: "Sixth",
  7: "Seventh",
  8: "Eighth",
  9: "Ninth",
  10: "Tenth",
  11: "Eleventh",
  12: "Twelfth",
  13: "Thirteenth",
  14: "Fourteenth",
  15: "Fifteenth",
  16: "Sixteenth",
  17: "Seventeenth",
  18: "Eighteenth",
  19: "Nineteenth",
  20: "Twentieth",
})[value]
// Adapted from https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
export const titleCase = string => string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  .replace('Mt', 'MT') // for addresses
export const cleanPhoneString = string => (string && string.replace(/\s|-|\(|\)/g, '')) || ''


// Adapted from https://stackoverflow.com/questions/14763997/javascript-array-to-sentence
export const listToText = (list) => {
  if (list.length === 1) {
    return list[0]
  } else if (list.length === 2) {
    return `${list[0]} and ${list[1]}`
  } else {
    return `${list.slice(0, list.length - 1).join(', ')} and ${list.slice(-1)}`
  }
}

// export const sortByIdentifier = (a, b) => {
// Not working
//   console.log(a, b)
//   const aChamber = a[0]
//   const bChamber = b[0]
//   const aNumber = +a.slice(2,)
//   const bNumber = +b.slice(2,)
//   console.log({ aChamber, bChamber, aNumber, bNumber })

//   // return true
// }