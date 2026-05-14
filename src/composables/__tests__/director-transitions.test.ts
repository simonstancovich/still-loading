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

describe('director — settle → cathedral', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('transitions at 180s when the cursor keeps moving (stillness never builds)', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('settle', clock)

    for (let elapsed = 0; elapsed < 179_000; elapsed += 1000) {
      recordMove(clock.now())
      clock.advance(1000)
    }
    expect(director.state.value.act).toBe('settle')

    recordMove(clock.now())
    clock.advance(1000)
    expect(director.state.value.sessionMs).toBe(180_000)
    expect(director.state.value.act).toBe('cathedral')

    stopDirector()
  })
})

describe('director — settle → cathedral OR stillness > 8s', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('transitions early when stillness exceeds 8s during settle', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('settle', clock)
    recordMove(clock.now())

    clock.advance(7_999)
    expect(director.state.value.act).toBe('settle')

    clock.advance(2)
    expect(director.state.value.act).toBe('cathedral')

    stopDirector()
  })

  it('does not transition early if the cursor keeps moving', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('settle', clock)

    for (let i = 0; i < 50; i++) {
      recordMove(clock.now())
      clock.advance(1000)
    }
    expect(director.state.value.act).toBe('settle')

    stopDirector()
  })
})

describe('director — cathedral → invite (AND stillness > 4s)', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('does not transition at 390s if cursor is still moving', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('cathedral', clock)

    for (let i = 0; i < 400; i++) {
      recordMove(clock.now())
      clock.advance(1000)
    }
    expect(director.state.value.act).toBe('cathedral')

    stopDirector()
  })

  it('transitions when both gates are met: 390s passed AND stillness > 4s', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('cathedral', clock)
    recordMove(clock.now())

    clock.advance(389_000)
    expect(director.state.value.act).toBe('cathedral')

    clock.advance(1_000)
    expect(director.state.value.sessionMs).toBe(390_000)
    expect(director.state.value.act).toBe('invite')

    stopDirector()
  })
})

describe('director — held → secondCathedral', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('transitions at 600s of held time', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('held', clock)
    recordMove(clock.now())

    clock.advance(599_999)
    expect(director.state.value.act).toBe('held')

    clock.advance(1)
    expect(director.state.value.act).toBe('secondCathedral')

    stopDirector()
  })
})

describe('director — secondCathedral → ending', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
  })

  it('transitions at 690s', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    __setActForTests('secondCathedral', clock)
    recordMove(clock.now())

    clock.advance(689_999)
    expect(director.state.value.act).toBe('secondCathedral')

    clock.advance(1)
    expect(director.state.value.act).toBe('ending')

    stopDirector()
  })
})
