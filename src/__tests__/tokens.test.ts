import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { applyTokensAsCssVariables } from '@/styles/apply'
import { flattenTokens, token, tokenAsRgb } from '@/styles/tokens'

function walk(dir: string, exts: readonly string[]): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) {
      out.push(...walk(full, exts))
    } else if (exts.some((e) => full.endsWith(e))) {
      out.push(full)
    }
  }
  return out
}

function extractCssVars(text: string): Set<string> {
  const out = new Set<string>()
  const re = /var\(--([a-z0-9-]+)(?:\s*,[^)]*)?\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    out.add(m[1] ?? '')
  }
  return out
}

const SRC_DIR = join(import.meta.dirname, '..')

describe('tokens — single source of truth', () => {
  it('flattenTokens returns a flat map keyed by dot-paths', () => {
    const flat = flattenTokens()
    expect(flat['color.ink.base']).toBe('#2a2a28')
    expect(flat['space.3']).toBe('1rem')
  })

  it('token() resolves dot-paths to primitive strings', () => {
    expect(token('color.ink.base')).toBe('#2a2a28')
    expect(token('type.handwriting')).toBe("'Caveat', cursive")
  })

  it('token() throws on unknown paths', () => {
    expect(() => token('color.nope')).toThrow(/Unknown token path/)
  })

  it('tokenAsRgb parses hex into 0–1 floats', () => {
    const [r, g, b] = tokenAsRgb('color.rupture.black')
    expect(r).toBe(0)
    expect(g).toBe(0)
    expect(b).toBe(0)
    const [r2] = tokenAsRgb('color.bg.base')
    expect(r2).toBeCloseTo(0xf6 / 255, 5)
  })

  it('every var(--*) reference in src/ resolves to a defined token', () => {
    const files = walk(SRC_DIR, ['.vue', '.css'])
    const usedVars = new Set<string>()
    for (const f of files) {
      const text = readFileSync(f, 'utf8')
      for (const v of extractCssVars(text)) usedVars.add(v)
    }
    const flat = flattenTokens()
    const definedVars = new Set<string>(
      Object.keys(flat).map((p) => p.replaceAll('.', '-')),
    )
    const undefined_ = [...usedVars].filter((v) => !definedVars.has(v))
    expect(undefined_, `Undefined CSS variables in src/: ${undefined_.join(', ')}`).toEqual([])
  })

  it('applyTokensAsCssVariables sets a CSS variable per leaf token', () => {
    const fakeRoot = document.createElement('div')
    applyTokensAsCssVariables(fakeRoot)
    expect(fakeRoot.style.getPropertyValue('--color-ink-base')).toBe('#2a2a28')
    expect(fakeRoot.style.getPropertyValue('--space-3')).toBe('1rem')
  })
})
