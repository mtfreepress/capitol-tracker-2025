import { describe, it, expect } from 'vitest'
import {
  dollarFormat,
  percentFormat,
  numberFormat,
  floatFormat,
  dateFormat,
  dateFormatWithYear,
  dateFormatLong,
  dateFormatWithWeekday,
  shortDateWithWeekday,
  billUrl,
  lawmakerUrl,
  committeeUrl,
  urlize,
  parseDate,
  pluralize,
  capitalize,
  ordinalize,
  titleCase,
} from '../../src/config/utils.js'

// ---------------------------------------------------------------------------
// Number formatters
// ---------------------------------------------------------------------------
describe('dollarFormat', () => {
  it('formats whole dollar amounts with commas', () => {
    expect(dollarFormat(1234567)).toBe('$1,234,567')
  })

  it('formats zero', () => {
    expect(dollarFormat(0)).toBe('$0')
  })

  it('formats small amounts', () => {
    expect(dollarFormat(500)).toBe('$500')
  })
})

describe('percentFormat', () => {
  it('formats 50%', () => {
    expect(percentFormat(0.5)).toBe('50%')
  })

  it('formats 100%', () => {
    expect(percentFormat(1)).toBe('100%')
  })

  it('formats 0%', () => {
    expect(percentFormat(0)).toBe('0%')
  })

  it('rounds to nearest whole percent', () => {
    expect(percentFormat(0.666)).toBe('67%')
  })
})

describe('numberFormat', () => {
  it('adds commas to large numbers', () => {
    expect(numberFormat(1234)).toBe('1,234')
  })

  it('formats millions', () => {
    expect(numberFormat(1000000)).toBe('1,000,000')
  })

  it('formats small numbers without commas', () => {
    expect(numberFormat(100)).toBe('100')
  })
})

describe('floatFormat', () => {
  it('rounds to one decimal place', () => {
    expect(floatFormat(3.14159)).toBe('3.1')
  })

  it('adds decimal place to whole number', () => {
    expect(floatFormat(2)).toBe('2.0')
  })

  it('rounds up correctly', () => {
    expect(floatFormat(2.95)).toBe('3.0')
  })
})

// ---------------------------------------------------------------------------
// Date formatters
// ---------------------------------------------------------------------------
describe('dateFormat', () => {
  it('formats month and day without leading zero in day', () => {
    const date = new Date(2025, 0, 15) // Jan 15
    expect(dateFormat(date)).toBe('Jan 15')
  })

  it('strips leading zero from single-digit days', () => {
    const date = new Date(2025, 1, 5) // Feb 5
    // %-d removes leading zero on platforms that support it (macOS/Linux)
    const result = dateFormat(date)
    expect(result).toMatch(/^Feb \d+$/)
    expect(result).not.toMatch(/^Feb 0/)
  })
})

describe('dateFormatWithYear', () => {
  it('includes year', () => {
    const date = new Date(2025, 0, 15)
    expect(dateFormatWithYear(date)).toMatch(/Jan 15, 2025/)
  })
})

describe('dateFormatLong', () => {
  it('uses full month name', () => {
    const date = new Date(2025, 0, 15)
    expect(dateFormatLong(date)).toMatch(/January/)
  })
})

describe('dateFormatWithWeekday', () => {
  it('includes weekday', () => {
    const date = new Date(2025, 0, 15) // Wednesday
    expect(dateFormatWithWeekday(date)).toMatch(/Wednesday/)
  })
})

describe('shortDateWithWeekday', () => {
  it('includes abbreviated weekday and month', () => {
    const date = new Date(2025, 0, 15)
    expect(shortDateWithWeekday(date)).toMatch(/Wed/)
    expect(shortDateWithWeekday(date)).toMatch(/Jan/)
  })
})

describe('parseDate', () => {
  it('parses YYYY-MM-DD string', () => {
    const result = parseDate('2025-01-15')
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2025)
    expect(result.getMonth()).toBe(0) // January = 0
    expect(result.getDate()).toBe(15)
  })

  it('parses a March date', () => {
    const result = parseDate('2025-03-20')
    expect(result).toBeInstanceOf(Date)
    expect(result.getMonth()).toBe(2) // March = 2
    expect(result.getDate()).toBe(20)
  })

  it('returns null for invalid/empty input', () => {
    expect(parseDate(null)).toBeNull()
    expect(parseDate('')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------
describe('billUrl', () => {
  it('converts "HB 123" to "hb-123"', () => {
    expect(billUrl('HB 123')).toBe('hb-123')
  })

  it('converts "SB 456" to "sb-456"', () => {
    expect(billUrl('SB 456')).toBe('sb-456')
  })

  it('lowercases the prefix', () => {
    expect(billUrl('HJ 10')).toBe('hj-10')
  })
})

describe('lawmakerUrl', () => {
  it('replaces spaces with hyphens, preserving case', () => {
    expect(lawmakerUrl('John Smith')).toBe('John-Smith')
  })

  it('handles multi-word names', () => {
    expect(lawmakerUrl('Mary Jane Watson')).toBe('Mary-Jane-Watson')
  })
})

describe('committeeUrl', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(committeeUrl('House Education')).toBe('house-education')
  })

  it('removes commas', () => {
    expect(committeeUrl('Senate Finance, Revenue')).toBe('senate-finance-revenue')
  })
})

describe('urlize', () => {
  it("removes apostrophes", () => {
    expect(urlize("Governor's Office")).toBe('governors-office')
  })

  it('replaces spaces with hyphens', () => {
    expect(urlize('Public Safety')).toBe('public-safety')
  })

  it('lowercases', () => {
    expect(urlize('Key Bills')).toBe('key-bills')
  })
})

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------
describe('pluralize', () => {
  it('returns empty string for 1', () => {
    expect(pluralize(1)).toBe('')
  })

  it('returns "s" for 0', () => {
    expect(pluralize(0)).toBe('s')
  })

  it('returns "s" for 2+', () => {
    expect(pluralize(2)).toBe('s')
    expect(pluralize(100)).toBe('s')
  })
})

describe('capitalize', () => {
  it('capitalizes the first character', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('preserves rest of string', () => {
    expect(capitalize('hELLO')).toBe('HELLO')
  })
})

describe('ordinalize', () => {
  it('returns ordinal words', () => {
    expect(ordinalize(1)).toBe('First')
    expect(ordinalize(2)).toBe('Second')
    expect(ordinalize(5)).toBe('Fifth')
    expect(ordinalize(10)).toBe('Tenth')
    expect(ordinalize(20)).toBe('Twentieth')
  })
})

describe('titleCase', () => {
  it('capitalizes each word', () => {
    expect(titleCase('hello world')).toBe('Hello World')
  })

  it('lowercases the rest of each word', () => {
    expect(titleCase('THE QUICK BROWN')).toBe('The Quick Brown')
  })
})
