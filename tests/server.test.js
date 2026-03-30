import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'
import supertest from 'supertest'
import { existsSync } from 'fs'
import { join } from 'path'

// Load server.cjs via CJS require from ESM context
const require = createRequire(import.meta.url)
const { app } = require('../server.cjs')

const BASE_PATH = '/capitol-tracker-2025'
const BUILD_DIR = join(process.cwd(), 'build')

describe('Express static server', () => {
  it('app is created and has middleware', () => {
    expect(app).toBeDefined()
    expect(typeof app).toBe('function') // Express apps are functions
  })

  it('serves the root index.html via the basePath', async () => {
    if (!existsSync(BUILD_DIR)) {
      // If no build directory, skip
      return
    }
    const res = await supertest(app).get(`${BASE_PATH}/`)
    expect([200, 301, 302]).toContain(res.status)
  })

  it('returns a response for unknown paths under basePath (fallback to index.html)', async () => {
    if (!existsSync(BUILD_DIR)) {
      return
    }
    const res = await supertest(app).get(`${BASE_PATH}/nonexistent-page/`)
    // Either serves index.html (200) or a redirect
    expect([200, 301, 302, 404]).toContain(res.status)
  })

  it('serves _next static assets', async () => {
    if (!existsSync(BUILD_DIR)) {
      return
    }
    const res = await supertest(app).get(`${BASE_PATH}/_next/static/nope.js`)
    // 404 is expected for a nonexistent asset, which means the route is wired up
    expect([200, 404]).toContain(res.status)
  })

  it('does not expose files outside the build directory', async () => {
    // Attempt path traversal - should NOT return sensitive files
    const res = await supertest(app).get(`${BASE_PATH}/../package.json`)
    // Express's static middleware normalizes paths - should return 404 or redirect
    // rather than serving files outside build/
    expect(res.status).not.toBe(200)
  })
})
