export const MS_PER_GLYPH = 55
export const FADE_MS = 120

export interface CharState {
  char: string
  opacity: number
}

function clamp01(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function charStates(text: string, elapsedMs: number): CharState[] {
  return [...text].map((char, index) => {
    const revealAt = index * MS_PER_GLYPH
    const opacity = clamp01((elapsedMs - revealAt) / FADE_MS)
    return { char, opacity }
  })
}

export function totalDurationMs(text: string): number {
  if (text.length === 0) return 0
  return (text.length - 1) * MS_PER_GLYPH + FADE_MS
}

export interface HandwritingApi {
  charStates: (text: string, elapsedMs: number) => CharState[]
  totalDurationMs: (text: string) => number
}

export function useHandwriting(): HandwritingApi {
  return { charStates, totalDurationMs }
}
