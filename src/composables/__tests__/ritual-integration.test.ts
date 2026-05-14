import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests } from '@/composables/useStillness'
import {
  __resetRitualForTests,
  startRitual,
  stopRitual,
  useRitual,
} from '@/composables/useRitual'

describe('ritual integration — invite through to held', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetRitualForTests()
  })

  it('a self-answered ritual: invite → ritual → held, hate echoes present', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    startRitual()

    __setActForTests('invite', clock)
    clock.advance(1)
    expect(useRitual().state.value).toBe('askingHate')

    director.submitHate('my impatience')
    clock.advance(1)
    expect(director.state.value.act).toBe('ritual')
    expect(useRitual().hateEchoes.value.length).toBeGreaterThan(0)

    director.submitLove('my steadiness')
    clock.advance(1)
    expect(director.state.value.act).toBe('held')
    expect(useRitual().loveResolution.value).toEqual({
      source: 'self',
      word: 'my steadiness',
    })

    stopRitual()
    stopDirector()
  })

  it('a tier-1 safety run: no hate echoes, nothing branch gifts a word, still reaches held', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    startRitual()

    __setActForTests('invite', clock)
    clock.advance(1)

    director.submitHate('i want to die')
    clock.advance(1)
    expect(director.state.value.act).toBe('ritual')
    expect(useRitual().safetyTier.value).toBe(1)
    expect(useRitual().hateEchoes.value).toHaveLength(0)

    director.submitLove('') // gives nothing
    clock.advance(1)
    expect(director.state.value.act).toBe('held')
    expect(useRitual().loveResolution.value?.source).toBe('gift')

    stopRitual()
    stopDirector()
  })
})
