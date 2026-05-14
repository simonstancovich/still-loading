import { describe, expect, it } from 'vitest'
import { eligibleLines } from '@/composables/useVoice'

describe('useVoice — eligibleLines', () => {
  it('returns lines matching the act and mood', () => {
    const lines = eligibleLines('flirt', 'playful', new Set())
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((l) => l.act.includes('flirt'))).toBe(true)
    expect(lines.every((l) => l.mood.includes('playful'))).toBe(true)
  })

  it('excludes lines whose text is already in the shown set', () => {
    const all = eligibleLines('flirt', 'playful', new Set())
    const firstText = all[0]?.text ?? ''
    const filtered = eligibleLines('flirt', 'playful', new Set([firstText]))
    expect(filtered.some((l) => l.text === firstText)).toBe(false)
    expect(filtered.length).toBe(all.length - 1)
  })

  it('returns an empty array when act and mood have no corpus match', () => {
    expect(eligibleLines('preflight', 'playful', new Set())).toEqual([])
  })

  it('returns an empty array when every matching line has been shown', () => {
    const all = eligibleLines('settle', 'honest', new Set())
    const shown = new Set(all.map((l) => l.text))
    expect(eligibleLines('settle', 'honest', shown)).toEqual([])
  })
})
