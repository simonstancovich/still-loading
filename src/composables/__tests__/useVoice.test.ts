import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetVoiceForTests,
  eligibleLines,
  scheduleLineForAct,
  startVoice,
  stopVoice,
  useVoice,
} from '@/composables/useVoice'
import {
  __resetDirectorStateForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests, recordMove } from '@/composables/useStillness'

describe('useVoice — eligibleLines', () => {
  it('returns lines matching the act and mood', () => {
    const lines = eligibleLines('flirt', 'playful', new Set())
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((l) => l.act.includes('flirt'))).toBe(true)
    expect(lines.every((l) => l.mood.includes('playful'))).toBe(true)
  })

  it('excludes lines whose text is already in the shown set', () => {
    // Show the opener first to get past the opener-only pool to the regular
    // pool of matching lines.
    const openers = eligibleLines('flirt', 'playful', new Set())
    const openerText = openers[0]?.text ?? ''
    const all = eligibleLines('flirt', 'playful', new Set([openerText]))
    const firstText = all[0]?.text ?? ''
    const filtered = eligibleLines('flirt', 'playful', new Set([openerText, firstText]))
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

describe('useVoice — startVoice watch wiring', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetVoiceForTests()
  })

  it('writes a flirt line when the director enters flirt', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startVoice()

    expect(useVoice().currentLine.value).toBeNull()

    clock.advance(800)
    expect(useDirector().state.value.act).toBe('flirt')
    expect(useVoice().currentLine.value?.act).toContain('flirt')

    stopVoice()
    stopDirector()
  })

  it('writes a new line on each act change, never repeating', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    startVoice()

    recordMove(clock.now())
    clock.advance(800) // sessionMs 800 → flirt
    const flirtText = useVoice().currentLine.value?.text

    recordMove(clock.now())
    clock.advance(89_200) // sessionMs 90_000 → settle
    const settleText = useVoice().currentLine.value?.text

    for (let t = 90_000; t < 180_000; t += 1000) {
      recordMove(clock.now())
      clock.advance(1000)
    }
    const cathedralText = useVoice().currentLine.value?.text

    expect(director.state.value.act).toBe('cathedral')
    expect(new Set([flirtText, settleText, cathedralText]).size).toBe(3)

    stopVoice()
    stopDirector()
  })

  it('stopVoice halts scheduling — later act changes do not write lines', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startVoice()
    stopVoice()

    clock.advance(800)
    expect(useVoice().currentLine.value).toBeNull()

    stopDirector()
  })

  it('startVoice is idempotent — calling twice does not double-schedule', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startVoice()
    startVoice()

    clock.advance(800)
    expect(useVoice().history.value).toHaveLength(1)

    stopVoice()
    stopDirector()
  })
})

describe('useVoice — opener priority', () => {
  beforeEach(() => {
    __resetVoiceForTests()
  })

  it('returns only opener lines when an unshown opener exists for the act/mood', () => {
    const lines = eligibleLines('flirt', 'playful', new Set())
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((l) => l.opener === true)).toBe(true)
  })

  it('falls back to all matching lines after the opener has been shown', () => {
    const openers = eligibleLines('flirt', 'playful', new Set())
    expect(openers.length).toBeGreaterThan(0)
    const opener = openers[0]
    expect(opener).toBeDefined()
    const next = eligibleLines('flirt', 'playful', new Set([opener?.text ?? '']))
    expect(next.length).toBeGreaterThan(0)
    expect(next.some((l) => l.opener === true)).toBe(false)
  })

  it('scheduleLineForAct picks the opener first for flirt', () => {
    scheduleLineForAct('flirt', 'playful', 800)
    const line = useVoice().currentLine.value
    expect(line?.opener).toBe(true)
    expect(line?.text).toBe('ah, there you are.')
  })
})
