import { describe, expect, it } from 'vitest'
import { voiceLines } from '@/corpus/voiceLines'
import type { Act, Mood } from '@/lib/director-types'

const VALID_ACTS: readonly Act[] = [
  'preflight',
  'flirt',
  'settle',
  'cathedral',
  'invite',
  'ritual',
  'held',
  'secondCathedral',
  'ending',
  'longTail',
]
const VALID_MOODS: readonly Mood[] = ['playful', 'wry', 'honest', 'tender', 'held', 'reverent']
const VALID_ROLES = ['flirt', 'tease', 'soften', 'ask', 'hold', 'gift']

describe('voiceLines corpus', () => {
  it('has at least 30 lines', () => {
    expect(voiceLines.length).toBeGreaterThanOrEqual(30)
  })

  it('has no duplicate texts', () => {
    const texts = voiceLines.map((l) => l.text)
    expect(new Set(texts).size).toBe(texts.length)
  })

  it('every line has at least one act, one mood, and a valid role', () => {
    for (const line of voiceLines) {
      expect(line.act.length).toBeGreaterThan(0)
      expect(line.mood.length).toBeGreaterThan(0)
      expect(VALID_ROLES).toContain(line.role)
    }
  })

  it('every act/mood tag is a known value', () => {
    for (const line of voiceLines) {
      for (const act of line.act) expect(VALID_ACTS).toContain(act)
      for (const mood of line.mood) expect(VALID_MOODS).toContain(mood)
    }
  })

  it('every act from flirt onward has at least one line', () => {
    const actsToCover: readonly Act[] = [
      'flirt',
      'settle',
      'cathedral',
      'invite',
      'held',
      'secondCathedral',
      'ending',
      'longTail',
    ]
    for (const act of actsToCover) {
      const count = voiceLines.filter((l) => l.act.includes(act)).length
      expect(count, `act "${act}" has no lines`).toBeGreaterThan(0)
    }
  })
})
