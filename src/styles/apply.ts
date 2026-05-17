import { flattenTokens } from '@/styles/tokens'

export function applyTokensAsCssVariables(root: HTMLElement = document.documentElement): void {
  const flat = flattenTokens()
  for (const path of Object.keys(flat)) {
    const value = flat[path]
    if (typeof value !== 'string') continue
    const name = `--${path.replaceAll('.', '-')}`
    root.style.setProperty(name, value)
  }
}
