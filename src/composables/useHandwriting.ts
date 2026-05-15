// Cadence of the letter-by-letter opacity fade (the Phase 1 fallback for the
// stroke-by-stroke handwriting renderer). Tuned to feel handwritten — slower
// than typing, deliberately not literal handwriting pace. The 17-char greeting
// reveals over ~2.8s, slow enough for the user to *watch* the line arrive.
export const MS_PER_GLYPH = 150
export const FADE_MS = 350

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
  return Array.from(text, (char, index) => {
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
