import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests, recordMove } from '@/composables/useStillness'

describe('director — stillness wiring', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('state.stillnessMs equals now - lastMoveAt on every tick', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    recordMove(0)
    startDirector(clock)

    clock.advance(500)
    expect(director.state.value.stillnessMs).toBe(500)

    recordMove(500)
    clock.advance(100)
    expect(director.state.value.stillnessMs).toBe(100)

    stopDirector()
  })

  it('stillnessMs is never negative when recordMove is in the future', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    recordMove(10_000)
    startDirector(clock)

    clock.advance(100)
    expect(director.state.value.stillnessMs).toBe(0)

    stopDirector()
  })
})

describe('director — __setActForTests', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('places the director into the given act with sessionMs reset to 0', () => {
    const clock = createVirtualClock(50_000)
    const director = useDirector()
    startDirector(clock)
    clock.advance(1000)

    __setActForTests('held', clock)

    expect(director.state.value.act).toBe('held')
    expect(director.state.value.sessionMs).toBe(0)

    clock.advance(500)
    expect(director.state.value.sessionMs).toBe(500)

    stopDirector()
  })
})
