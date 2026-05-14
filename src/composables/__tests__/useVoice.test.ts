import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetVoiceForTests,
  eligibleLines,
  scheduleLineForAct,
  useVoice,
} from '@/composables/useVoice'

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

describe('useVoice — scheduleLineForAct', () => {
  beforeEach(() => {
    __resetVoiceForTests()
  })

  it('assigns a matching currentLine on the first call', () => {
    scheduleLineForAct('flirt', 'playful', 800)
    const { currentLine, currentLineStartedMs } = useVoice()
    expect(currentLine.value).not.toBeNull()
    expect(currentLine.value?.act).toContain('flirt')
    expect(currentLineStartedMs.value).toBe(800)
  })

  it('records shown lines in history and never repeats them', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 11; i++) {
      scheduleLineForAct('flirt', 'playful', 10_000 * (i + 1))
      const text = useVoice().currentLine.value?.text
      expect(text, `iteration ${String(i)}`).toBeDefined()
      expect(seen.has(text ?? ''), `repeat on iteration ${String(i)}`).toBe(false)
      seen.add(text ?? '')
    }
    expect(useVoice().history.value).toHaveLength(11)
  })

  it('does not change currentLine when called within MIN_GAP_MS of the last line', () => {
    scheduleLineForAct('flirt', 'playful', 10_000)
    const first = useVoice().currentLine.value
    scheduleLineForAct('settle', 'honest', 12_000)
    expect(useVoice().currentLine.value).toBe(first)
  })

  it('changes currentLine once MIN_GAP_MS has elapsed', () => {
    scheduleLineForAct('flirt', 'playful', 10_000)
    const first = useVoice().currentLine.value
    scheduleLineForAct('settle', 'honest', 10_000 + 6_000)
    const second = useVoice().currentLine.value
    expect(second).not.toBe(first)
    expect(second?.act).toContain('settle')
  })

  it('no-ops when there is no eligible line (e.g. preflight)', () => {
    scheduleLineForAct('preflight', 'playful', 10_000)
    expect(useVoice().currentLine.value).toBeNull()
  })

  it('the first call always passes the gap check regardless of sessionMs', () => {
    scheduleLineForAct('flirt', 'playful', 1)
    expect(useVoice().currentLine.value).not.toBeNull()
  })
})
