import type { Act } from '@/lib/director-types'
import { flattenTokens, tokens } from '@/styles/tokens'

export function applyTokensAsCssVariables(root: HTMLElement = document.documentElement): void {
  const flat = flattenTokens()
  for (const path of Object.keys(flat)) {
    const value = flat[path]
    if (typeof value !== 'string') continue
    const name = `--${path.replaceAll('.', '-')}`
    root.style.setProperty(name, value)
  }
  setActPalette('preflight', root)
}

export function setActPalette(act: Act, root: HTMLElement = document.documentElement): void {
  const palette = tokens.palette[act]
  root.style.setProperty('--palette-current-base', palette.base)
  root.style.setProperty('--palette-current-warm', palette.warm)
  root.style.setProperty('--palette-current-cool', palette.cool)
  root.style.setProperty('--palette-current-accent', palette.accent)
}
