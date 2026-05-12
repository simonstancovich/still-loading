import { tokens } from '@/styles/tokens/data'

export type TokenPath = string

export function token(path: TokenPath): string {
  const parts = path.split('.')
  let cursor: unknown = tokens
  for (const part of parts) {
    if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part]
    } else {
      throw new Error(`Unknown token path: ${path}`)
    }
  }
  if (typeof cursor === 'string') return cursor
  if (typeof cursor === 'number') return String(cursor)
  throw new Error(`Token path ${path} did not resolve to a primitive`)
}

export function flattenTokens(): Record<string, string> {
  const out: Record<string, string> = {}
  const walk = (node: unknown, prefix: string): void => {
    if (typeof node === 'string' || typeof node === 'number') {
      out[prefix] = String(node)
      return
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        walk(v, prefix === '' ? k : `${prefix}.${k}`)
      }
    }
  }
  walk(tokens, '')
  return out
}

export function tokenAsCssVarName(path: TokenPath): string {
  return `--${path.replaceAll('.', '-')}`
}

export function tokenAsCssVar(path: TokenPath): string {
  return `var(${tokenAsCssVarName(path)})`
}

export function tokenAsRgb(path: TokenPath): [number, number, number] {
  const value = token(path)
  const hex = value.startsWith('#') ? value.slice(1) : null
  if (hex === null || (hex.length !== 6 && hex.length !== 3)) {
    throw new Error(`Token ${path} is not a hex color (got "${value}")`)
  }
  const h = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}
