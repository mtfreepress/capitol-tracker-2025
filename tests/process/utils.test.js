import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { getJson, collectJsons, getYaml, getText, writeJson, writeCsv } from '../../process/utils.js'

let tmpDir

beforeEach(() => {
  tmpDir = join(tmpdir(), `ct-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(tmpDir, { recursive: true })
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('getJson', () => {
  it('reads and parses a JSON object', () => {
    const file = join(tmpDir, 'test.json')
    writeFileSync(file, JSON.stringify({ hello: 'world', count: 42 }))
    expect(getJson(file)).toEqual({ hello: 'world', count: 42 })
  })

  it('reads and parses a JSON array', () => {
    const file = join(tmpDir, 'arr.json')
    writeFileSync(file, JSON.stringify([1, 2, 3]))
    expect(getJson(file)).toEqual([1, 2, 3])
  })

  it('preserves nested objects', () => {
    const data = { outer: { inner: { deep: true } }, list: ['a', 'b'] }
    const file = join(tmpDir, 'nested.json')
    writeFileSync(file, JSON.stringify(data))
    expect(getJson(file)).toEqual(data)
  })
})

describe('collectJsons', () => {
  it('collects all matching JSON files', () => {
    writeFileSync(join(tmpDir, 'a.json'), JSON.stringify({ id: 'a' }))
    writeFileSync(join(tmpDir, 'b.json'), JSON.stringify({ id: 'b' }))
    const results = collectJsons(join(tmpDir, '*.json'))
    expect(results).toHaveLength(2)
    expect(results.map(r => r.id).sort()).toEqual(['a', 'b'])
  })

  it('returns empty array when no files match', () => {
    expect(collectJsons(join(tmpDir, '*.json'))).toEqual([])
  })

  it('only collects files matching the glob pattern', () => {
    writeFileSync(join(tmpDir, 'match.json'), JSON.stringify({ id: 'match' }))
    writeFileSync(join(tmpDir, 'no-match.yaml'), 'id: nope')
    const results = collectJsons(join(tmpDir, '*.json'))
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('match')
  })
})

describe('getYaml', () => {
  it('reads and parses a YAML file', () => {
    const file = join(tmpDir, 'test.yaml')
    writeFileSync(file, 'key: value\ncount: 5\n')
    expect(getYaml(file)).toEqual({ key: 'value', count: 5 })
  })

  it('handles YAML lists', () => {
    const file = join(tmpDir, 'list.yaml')
    writeFileSync(file, '- a\n- b\n- c\n')
    expect(getYaml(file)).toEqual(['a', 'b', 'c'])
  })

  it('handles nested YAML', () => {
    const file = join(tmpDir, 'nested.yaml')
    writeFileSync(file, 'outer:\n  inner: true\n  value: 42\n')
    expect(getYaml(file)).toEqual({ outer: { inner: true, value: 42 } })
  })
})

describe('getText', () => {
  it('reads text file content as a string', () => {
    const file = join(tmpDir, 'test.txt')
    writeFileSync(file, 'hello world')
    expect(getText(file)).toBe('hello world')
  })

  it('preserves newlines', () => {
    const file = join(tmpDir, 'multi.txt')
    writeFileSync(file, 'line one\nline two\nline three')
    expect(getText(file)).toBe('line one\nline two\nline three')
  })
})

describe('writeJson', () => {
  it('writes JSON to file', async () => {
    const file = join(tmpDir, 'out.json')
    writeJson(file, { test: true, items: [1, 2] })
    await new Promise(r => setTimeout(r, 150))
    expect(getJson(file)).toEqual({ test: true, items: [1, 2] })
  })

  it('writes with 4-space indentation', async () => {
    const file = join(tmpDir, 'formatted.json')
    writeJson(file, { key: 'value' })
    await new Promise(r => setTimeout(r, 150))
    const raw = readFileSync(file, 'utf-8')
    expect(raw).toContain('    "key"')
  })

  it('overwrites existing file content', async () => {
    const file = join(tmpDir, 'overwrite.json')
    writeFileSync(file, JSON.stringify({ old: true }))
    writeJson(file, { new: true })
    await new Promise(r => setTimeout(r, 150))
    expect(getJson(file)).toEqual({ new: true })
  })
})

describe('writeCsv', () => {
  it('writes a CSV file with headers and rows', async () => {
    const file = join(tmpDir, 'out.csv')
    writeCsv(file, [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ])
    await new Promise(r => setTimeout(r, 150))
    const content = readFileSync(file, 'utf-8')
    expect(content).toContain('name,age')
    expect(content).toContain('"Alice","30"')
    expect(content).toContain('"Bob","25"')
  })

  it('quotes values containing commas', async () => {
    const file = join(tmpDir, 'quoted.csv')
    writeCsv(file, [{ label: 'A, B', value: 1 }])
    await new Promise(r => setTimeout(r, 150))
    const content = readFileSync(file, 'utf-8')
    expect(content).toContain('"A, B"')
  })

  it('escapes double quotes inside values', async () => {
    const file = join(tmpDir, 'escaped.csv')
    writeCsv(file, [{ label: 'Say "hello"', value: 42 }])
    await new Promise(r => setTimeout(r, 150))
    const content = readFileSync(file, 'utf-8')
    expect(content).toContain('""hello""')
  })

  it('writes empty string for undefined values', async () => {
    const file = join(tmpDir, 'empty.csv')
    writeCsv(file, [{ name: 'Alice', optional: undefined }])
    await new Promise(r => setTimeout(r, 150))
    const content = readFileSync(file, 'utf-8')
    expect(content).toContain('name,optional')
    expect(content).toContain('"Alice",""')
  })
})
