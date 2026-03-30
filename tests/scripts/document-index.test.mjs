import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const PUBLIC_DIR = join(process.cwd(), 'public')
const DOCUMENT_INDEX_PATH = join(PUBLIC_DIR, 'document-index.json')
const BILLS_WITH_AMENDMENTS_PATH = join(PUBLIC_DIR, 'bills-with-amendments.txt')

describe('document-index.json', () => {
  it('file exists', () => {
    expect(existsSync(DOCUMENT_INDEX_PATH)).toBe(true)
  })

  it('is valid JSON', () => {
    const raw = readFileSync(DOCUMENT_INDEX_PATH, 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('has the three expected document type keys', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))
    expect(index).toHaveProperty('amendments')
    expect(index).toHaveProperty('fiscal-notes')
    expect(index).toHaveProperty('legal-notes')
  })

  it('each document type maps bill IDs to arrays of document objects', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))

    for (const type of ['amendments', 'fiscal-notes', 'legal-notes']) {
      const typeObj = index[type]
      expect(typeof typeObj).toBe('object')
      expect(typeObj).not.toBeNull()

      const billIds = Object.keys(typeObj)
      for (const billId of billIds.slice(0, 5)) {
        const docs = typeObj[billId]
        expect(Array.isArray(docs)).toBe(true)

        for (const doc of docs) {
          expect(doc).toHaveProperty('name')
          expect(doc).toHaveProperty('url')
          expect(typeof doc.name).toBe('string')
          expect(typeof doc.url).toBe('string')
          expect(doc.name.length).toBeGreaterThan(0)
          expect(doc.url.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('amendment document URLs start with the correct basePath prefix', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))
    const amendments = index['amendments']
    const billIds = Object.keys(amendments).filter(id => amendments[id].length > 0)

    if (billIds.length > 0) {
      const firstDoc = amendments[billIds[0]][0]
      expect(firstDoc.url).toMatch(/^\/capitol-tracker-2025\/amendments\//)
    }
  })

  it('bill IDs follow the expected format (e.g. HB-1, SB-123)', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))
    const billIdPattern = /^[A-Z]{2}-\d+$/

    for (const type of ['amendments', 'fiscal-notes', 'legal-notes']) {
      for (const billId of Object.keys(index[type])) {
        expect(billId).toMatch(billIdPattern)
      }
    }
  })

  it('HB-2 amendments use section-name format in the name field', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))
    const hb2Amendments = index['amendments']['HB-2']

    if (hb2Amendments && hb2Amendments.length > 0) {
      // HB-2 amendments should have section names embedded in their file names
      const sectionNames = [
        'general-government', 'health', 'nat-resource-transportation',
        'public-safety', 'k-12-education', 'long-range', 'global-amendment',
      ]
      const hasNamedAmendment = hb2Amendments.some(doc =>
        sectionNames.some(section => doc.name.includes(section))
      )
      expect(hasNamedAmendment).toBe(true)
    }
  })

  it('document names are sorted alphabetically within each bill', () => {
    const index = JSON.parse(readFileSync(DOCUMENT_INDEX_PATH, 'utf-8'))

    for (const type of ['amendments', 'fiscal-notes', 'legal-notes']) {
      for (const [billId, docs] of Object.entries(index[type])) {
        if (docs.length < 2) continue
        const names = docs.map(d => d.name)
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted,
          `${type}/${billId} docs should be sorted alphabetically`)
      }
    }
  })
})

describe('bills-with-amendments.txt', () => {
  it('file exists', () => {
    expect(existsSync(BILLS_WITH_AMENDMENTS_PATH)).toBe(true)
  })

  it('contains bill IDs in "HB 123" space-separated format', () => {
    const content = readFileSync(BILLS_WITH_AMENDMENTS_PATH, 'utf-8')
    const lines = content.trim().split('\n').filter(Boolean)

    expect(lines.length).toBeGreaterThan(0)

    for (const line of lines.slice(0, 10)) {
      // Format is "HB 1" or "SB 456" (two-letter prefix + space + number)
      expect(line.trim()).toMatch(/^[A-Z]{2} \d+$/)
    }
  })

  it('is sorted by bill type then bill number', () => {
    const content = readFileSync(BILLS_WITH_AMENDMENTS_PATH, 'utf-8')
    const lines = content.trim().split('\n').filter(Boolean)

    const parsed = lines.map(line => {
      const [type, numStr] = line.trim().split(' ')
      return { type, num: parseInt(numStr, 10), original: line.trim() }
    })

    for (let i = 1; i < parsed.length; i++) {
      const prev = parsed[i - 1]
      const curr = parsed[i]
      if (prev.type === curr.type) {
        expect(curr.num).toBeGreaterThan(prev.num,
          `${curr.original} should come after ${prev.original}`)
      } else {
        expect(curr.type.localeCompare(prev.type)).toBeGreaterThanOrEqual(0,
          `${curr.type} should sort after ${prev.type}`)
      }
    }
  })
})
