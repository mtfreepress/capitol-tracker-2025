import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'src', 'data')

const readJson = (filename) =>
  JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf-8'))


// bills.json

describe('bills.json', () => {
  it('is a non-empty array', () => {
    const bills = readJson('bills.json')
    expect(Array.isArray(bills)).toBe(true)
    expect(bills.length).toBeGreaterThan(0)
  })

  it('each bill has required fields', () => {
    const bills = readJson('bills.json')
    for (const bill of bills.slice(0, 20)) {
      expect(bill).toHaveProperty('key')
      expect(bill).toHaveProperty('title')
      expect(typeof bill.key).toBe('string')
      expect(typeof bill.title).toBe('string')
    }
  })

  it('bill keys follow the lowercase pattern (e.g. "hb-123")', () => {
    const bills = readJson('bills.json')
    const keyPattern = /^[a-z]{2}-\d+$/
    for (const bill of bills.slice(0, 50)) {
      expect(bill.key).toMatch(keyPattern)
    }
  })
})


// lawmakers.json

describe('lawmakers.json', () => {
  it('is a non-empty array', () => {
    const lawmakers = readJson('lawmakers.json')
    expect(Array.isArray(lawmakers)).toBe(true)
    expect(lawmakers.length).toBeGreaterThan(0)
  })

  it('each lawmaker has required fields', () => {
    const lawmakers = readJson('lawmakers.json')
    for (const lm of lawmakers.slice(0, 10)) {
      expect(lm).toHaveProperty('key')
      expect(lm).toHaveProperty('name')
      expect(lm).toHaveProperty('party')
      expect(lm).toHaveProperty('chamber')
    }
  })

  it('party values are valid', () => {
    const lawmakers = readJson('lawmakers.json')
    const validParties = new Set(['R', 'D', 'I', 'L'])
    for (const lm of lawmakers) {
      expect(validParties.has(lm.party),
        `Unexpected party "${lm.party}" for ${lm.name}`).toBe(true)
    }
  })

  it('chamber values are valid', () => {
    const lawmakers = readJson('lawmakers.json')
    const validChambers = new Set(['house', 'senate'])
    for (const lm of lawmakers) {
      expect(validChambers.has(lm.chamber),
        `Unexpected chamber "${lm.chamber}" for ${lm.name}`).toBe(true)
    }
  })
})


// committees.json

describe('committees.json', () => {
  it('is a non-empty array', () => {
    const committees = readJson('committees.json')
    expect(Array.isArray(committees)).toBe(true)
    expect(committees.length).toBeGreaterThan(0)
  })

  it('each committee has required fields', () => {
    const committees = readJson('committees.json')
    for (const c of committees.slice(0, 10)) {
      expect(c).toHaveProperty('key')
      expect(c).toHaveProperty('name')
    }
  })
})


// calendar.json

describe('calendar.json', () => {
  it('exists and is an object', () => {
    const cal = readJson('calendar.json')
    expect(typeof cal).toBe('object')
    expect(cal).not.toBeNull()
    expect(Array.isArray(cal)).toBe(false)
  })
})


// house.json

describe('house.json', () => {
  it('exists and is an object', () => {
    const house = readJson('house.json')
    expect(typeof house).toBe('object')
    expect(house).not.toBeNull()
  })
})


// senate.json

describe('senate.json', () => {
  it('exists and is an object', () => {
    const senate = readJson('senate.json')
    expect(typeof senate).toBe('object')
    expect(senate).not.toBeNull()
  })
})


// governor.json

describe('governor.json', () => {
  it('exists and is an object', () => {
    const gov = readJson('governor.json')
    expect(typeof gov).toBe('object')
    expect(gov).not.toBeNull()
  })
})


// articles.json

describe('articles.json', () => {
  it('is an array', () => {
    const articles = readJson('articles.json')
    expect(Array.isArray(articles)).toBe(true)
  })

  it('each article has a title and link', () => {
    const articles = readJson('articles.json')
    for (const a of articles.slice(0, 10)) {
      expect(a).toHaveProperty('title')
      expect(a).toHaveProperty('link')
      expect(typeof a.title).toBe('string')
      expect(typeof a.link).toBe('string')
    }
  })
})


// bill-categories.json

describe('bill-categories.json', () => {
  it('is an array (may be empty at end of session)', () => {
    const cats = readJson('bill-categories.json')
    expect(Array.isArray(cats)).toBe(true)
  })

  it('each present category has required fields', () => {
    const cats = readJson('bill-categories.json')
    for (const c of cats.slice(0, 5)) {
      expect(c).toHaveProperty('category')
      expect(c).toHaveProperty('order')
    }
  })
})


// process-annotations.json

describe('process-annotations.json', () => {
  it('is an array of annotation objects', () => {
    const annotations = readJson('process-annotations.json')
    expect(Array.isArray(annotations)).toBe(true)
    expect(annotations.length).toBeGreaterThan(0)
  })

  it('contains the howBillsMove annotation', () => {
    const annotations = readJson('process-annotations.json')
    const howBillsMove = annotations.find(a => a.key === 'howBillsMove')
    expect(howBillsMove).toBeDefined()
    expect(howBillsMove).toHaveProperty('content')
  })
})


// participation.json

describe('participation.json', () => {
  it('exists and is non-null', () => {
    const p = readJson('participation.json')
    expect(p).not.toBeNull()
    expect(typeof p).toBe('object')
  })
})


// contact.json

describe('contact.json', () => {
  it('exists and is non-null', () => {
    const c = readJson('contact.json')
    expect(c).not.toBeNull()
  })
})
