import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetDirectorStateForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'

describe('useDirector — virtual clock + transitions', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
  })

  it('starts in preflight at sessionMs 0', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)
    expect(director.state.value.act).toBe('preflight')
    expect(director.state.value.sessionMs).toBe(0)
    stopDirector()
  })

  it('preflight → flirt fires at exactly 800ms (boundary)', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(799)
    expect(director.state.value.act).toBe('preflight')
    expect(director.state.value.sessionMs).toBe(799)

    clock.advance(1)
    expect(director.state.value.act).toBe('flirt')
    expect(director.state.value.sessionMs).toBe(800)

    stopDirector()
  })

  it('flirt → settle fires at 90 seconds', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(800)
    expect(director.state.value.act).toBe('flirt')

    clock.advance(89_000)
    expect(director.state.value.act).toBe('flirt')
    expect(director.state.value.sessionMs).toBe(89_800)

    clock.advance(200)
    expect(director.state.value.act).toBe('settle')
    expect(director.state.value.sessionMs).toBe(90_000)

    stopDirector()
  })

  it('clock starts at a non-zero monotonic time without breaking transitions', () => {
    const clock = createVirtualClock(1_000_000)
    const director = useDirector()
    startDirector(clock)
    expect(director.state.value.sessionMs).toBe(0)
    clock.advance(800)
    expect(director.state.value.act).toBe('flirt')
    expect(director.state.value.sessionMs).toBe(800)
    stopDirector()
  })

  it('pause freezes sessionMs; resume continues from where it left off', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(500)
    expect(director.state.value.sessionMs).toBe(500)

    director.pause()
    clock.advance(10_000)
    expect(director.state.value.paused).toBe(true)
    expect(director.state.value.sessionMs).toBe(500)

    director.resume()
    clock.advance(300)
    expect(director.state.value.paused).toBe(false)
    expect(director.state.value.sessionMs).toBe(800)
    expect(director.state.value.act).toBe('flirt')

    stopDirector()
  })

  it('stopDirector halts ticking — further clock advances do not update state', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(500)
    expect(director.state.value.sessionMs).toBe(500)

    stopDirector()
    clock.advance(1_000_000)
    expect(director.state.value.sessionMs).toBe(500)
    expect(director.state.value.act).toBe('preflight')
  })

  it('does not transition twice — once in flirt, stays in flirt even if advanced past 800ms again', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(800)
    expect(director.state.value.act).toBe('flirt')

    clock.advance(1)
    expect(director.state.value.act).toBe('flirt')

    stopDirector()
  })
})
