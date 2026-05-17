import { beforeEach, describe, expect, it } from 'vitest'
import {
  PREFLIGHT_MS,
  __resetDirectorStateForTests,
  __setAwaitingPresenceForTests,
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

  it('preflight → flirt fires at exactly PREFLIGHT_MS (boundary)', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(PREFLIGHT_MS - 1)
    expect(director.state.value.act).toBe('preflight')
    expect(director.state.value.sessionMs).toBe(PREFLIGHT_MS - 1)

    clock.advance(1)
    expect(director.state.value.act).toBe('flirt')
    expect(director.state.value.sessionMs).toBe(PREFLIGHT_MS)

    stopDirector()
  })

  it('clock starts at a non-zero monotonic time without breaking transitions', () => {
    const clock = createVirtualClock(1_000_000)
    const director = useDirector()
    startDirector(clock)
    expect(director.state.value.sessionMs).toBe(0)
    clock.advance(PREFLIGHT_MS)
    expect(director.state.value.act).toBe('flirt')
    expect(director.state.value.sessionMs).toBe(PREFLIGHT_MS)
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
    clock.advance(PREFLIGHT_MS - 500)
    expect(director.state.value.paused).toBe(false)
    expect(director.state.value.sessionMs).toBe(PREFLIGHT_MS)
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

  it('does not transition twice — once in flirt, stays in flirt even if advanced past PREFLIGHT_MS again', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    startDirector(clock)

    clock.advance(PREFLIGHT_MS)
    expect(director.state.value.act).toBe('flirt')

    clock.advance(1)
    expect(director.state.value.act).toBe('flirt')

    stopDirector()
  })
})

describe('useDirector — presence gate', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
  })

  it('sessionMs does not advance while awaitingPresence is true', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    __setAwaitingPresenceForTests(true)
    startDirector(clock)

    clock.advance(10_000)
    expect(director.state.value.sessionMs).toBe(0)
    expect(director.state.value.act).toBe('preflight')

    stopDirector()
  })

  it('confirmPresence flips awaitingPresence and lets sessionMs advance from 0', () => {
    const clock = createVirtualClock(0)
    const director = useDirector()
    __setAwaitingPresenceForTests(true)
    startDirector(clock)

    clock.advance(5_000)
    expect(director.state.value.sessionMs).toBe(0)

    director.confirmPresence()
    expect(director.state.value.awaitingPresence).toBe(false)

    clock.advance(PREFLIGHT_MS)
    expect(director.state.value.sessionMs).toBe(PREFLIGHT_MS)
    expect(director.state.value.act).toBe('flirt')

    stopDirector()
  })
})
