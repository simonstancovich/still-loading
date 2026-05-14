import { describe, expect, it } from 'vitest'
import {
  FADE_MS,
  MS_PER_GLYPH,
  charStates,
  totalDurationMs,
  useHandwriting,
} from '@/composables/useHandwriting'

describe('useHandwriting — charStates', () => {
  it('at elapsed 0, every character has opacity 0', () => {
    const states = charStates('hello', 0)
    expect(states).toHaveLength(5)
    expect(states.every((s) => s.opacity === 0)).toBe(true)
    expect(states.map((s) => s.char).join('')).toBe('hello')
  })

  it('the first character begins fading in while the second has not started', () => {
    // Pick an elapsed time strictly between 0 and MS_PER_GLYPH so char 0 is
    // partway through its fade and char 1 has not begun revealing.
    const elapsed = MS_PER_GLYPH / 2
    const states = charStates('ab', elapsed)
    expect(states[0]?.opacity).toBeGreaterThan(0)
    expect(states[0]?.opacity).toBeLessThan(1)
    expect(states[1]?.opacity).toBe(0)
  })

  it('a character is fully opaque once FADE_MS has passed since its reveal time', () => {
    const states = charStates('ab', FADE_MS)
    expect(states[0]?.opacity).toBe(1)
  })

  it('the second character starts revealing at MS_PER_GLYPH', () => {
    const atGlyph = charStates('ab', MS_PER_GLYPH)
    expect(atGlyph[1]?.opacity).toBe(0)
    const past = charStates('ab', MS_PER_GLYPH + FADE_MS)
    expect(past[1]?.opacity).toBe(1)
  })

  it('opacity never exceeds 1 even long after reveal', () => {
    const states = charStates('abc', 1_000_000)
    expect(states.every((s) => s.opacity === 1)).toBe(true)
  })

  it('an empty string yields an empty array', () => {
    expect(charStates('', 0)).toEqual([])
  })
})

describe('useHandwriting — totalDurationMs', () => {
  it('is the last glyph reveal time plus one fade window', () => {
    expect(totalDurationMs('ab')).toBe(MS_PER_GLYPH * 1 + FADE_MS)
    expect(totalDurationMs('a')).toBe(FADE_MS)
  })

  it('is 0 for an empty string', () => {
    expect(totalDurationMs('')).toBe(0)
  })
})

describe('useHandwriting — composable surface', () => {
  it('exposes charStates and totalDurationMs', () => {
    const hw = useHandwriting()
    expect(typeof hw.charStates).toBe('function')
    expect(typeof hw.totalDurationMs).toBe('function')
    expect(hw.charStates('x', 0)).toHaveLength(1)
  })
})
