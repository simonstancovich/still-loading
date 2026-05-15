import { beforeEach, describe, expect, it } from 'vitest'
import {
  PREFLIGHT_MS,
  __resetDirectorStateForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests, recordMove } from '@/composables/useStillness'
import { __resetVoiceForTests, startVoice, stopVoice, useVoice } from '@/composables/useVoice'
import { charStates } from '@/composables/useHandwriting'

describe('voice integration — director drives a revealing line', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetVoiceForTests()
  })

  it('flirt begins, a line is written, and it reveals as the clock advances', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    recordMove(0)
    startDirector(clock)
    startVoice()

    clock.advance(PREFLIGHT_MS)
    const voice = useVoice()
    const line = voice.currentLine.value
    expect(line).not.toBeNull()
    expect(line?.act).toContain('flirt')
    expect(voice.currentLineStartedMs.value).toBe(PREFLIGHT_MS)

    const elapsed0 = director.state.value.sessionMs - voice.currentLineStartedMs.value
    expect(elapsed0).toBe(0)
    expect(charStates(line?.text ?? '', elapsed0).every((c) => c.opacity === 0)).toBe(true)

    clock.advance(10_000)
    const elapsed1 = director.state.value.sessionMs - voice.currentLineStartedMs.value
    expect(elapsed1).toBe(10_000)
    expect(charStates(line?.text ?? '', elapsed1).every((c) => c.opacity === 1)).toBe(true)

    stopVoice()
    stopDirector()
  })
})
