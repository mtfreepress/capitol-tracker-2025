import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'


// Source-level checks for src/config/styles.js
// These caught a bug where the entire file was accidentally commented out,
// breaking consumers that import from it.


const stylesSource = readFileSync(
  resolve(process.cwd(), 'src/config/styles.js'),
  'utf-8'
)

describe('src/config/styles.js exports', () => {
  it('exports embedInputContainerStyle', () => {
    expect(stylesSource).toMatch(/export\s+const\s+embedInputContainerStyle/)
  })

  it('exports bottomFadeCss', () => {
    expect(stylesSource).toMatch(/export\s+const\s+bottomFadeCss/)
  })

  it('exports inlineButtonCss', () => {
    expect(stylesSource).toMatch(/export\s+const\s+inlineButtonCss/)
  })
})


// Ensure no source files import the removed 'next/config' module.
// next/config (publicRuntimeConfig) was removed in Next.js 13+.
// Use process.env.* instead.


import { readdirSync, statSync } from 'fs'

function collectJsFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...collectJsFiles(full))
    } else if (/\.(js|mjs|ts|tsx)$/.test(entry)) {
      results.push(full)
    }
  }
  return results
}

describe('next/config import ban', () => {
  it('no source file imports from next/config', () => {
    const srcDir = resolve(process.cwd(), 'src')
    const files = collectJsFiles(srcDir)
    const violations = files.filter(f =>
      readFileSync(f, 'utf-8').includes("from 'next/config'")
    )
    expect(violations, `Files still importing next/config: ${violations.join(', ')}`).toHaveLength(0)
  })
})
