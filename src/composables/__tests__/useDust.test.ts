import { beforeEach, describe, expect, it } from 'vitest'
import {
  DUST_MAX,
  __resetDustForTests,
  dustCountAt,
  spawnParticle,
  startDust,
  stepParticle,
  stopDust,
  useDust,
  type DustParticle,
} from '@/composables/useDust'
import {
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'

describe('useDust — dustCountAt', () => {
  it('is 0 before the settle dust beat', () => {
    expect(dustCountAt(0)).toBe(0)
    expect(dustCountAt(160_000)).toBe(0)
  })

  it('ramps from 8 to 30 across the fade-in window', () => {
    expect(dustCountAt(165_000)).toBe(8)
    expect(dustCountAt(195_000)).toBe(30)
    const mid = dustCountAt(180_000)
    expect(mid).toBeGreaterThan(8)
    expect(mid).toBeLessThan(30)
  })

  it('holds at 30 long after the window', () => {
    expect(dustCountAt(600_000)).toBe(30)
  })

  it('never exceeds DUST_MAX', () => {
    expect(dustCountAt(1_000_000)).toBeLessThanOrEqual(DUST_MAX)
  })
})

describe('useDust — spawnParticle', () => {
  it('produces a particle inside the 0..1 field with zero initial alpha', () => {
    const p = spawnParticle()
    expect(p.x).toBeGreaterThanOrEqual(0)
    expect(p.x).toBeLessThanOrEqual(1)
    expect(p.y).toBeGreaterThanOrEqual(0)
    expect(p.y).toBeLessThanOrEqual(1)
    expect(p.alpha).toBe(0)
    expect(p.size).toBeGreaterThan(0)
  })
})

describe('useDust — stepParticle', () => {
  it('drifts the particle by its velocity scaled by dt', () => {
    const p: DustParticle = { x: 0.5, y: 0.5, vx: 0.001, vy: -0.002, size: 2, alpha: 1 }
    const next = stepParticle(p, 100)
    expect(next.x).toBeCloseTo(0.6, 5)
    expect(next.y).toBeCloseTo(0.3, 5)
  })

  it('wraps around the edges of the 0..1 field', () => {
    // x: 0.99 + 0.001*100 = 1.09 -> wraps to 0.09
    const right: DustParticle = { x: 0.99, y: 0.5, vx: 0.001, vy: 0, size: 2, alpha: 1 }
    expect(stepParticle(right, 100).x).toBeCloseTo(0.09, 5)
    // y: 0.05 + (-0.001)*100 = -0.05 -> wraps to 0.95
    const below: DustParticle = { x: 0.5, y: 0.05, vx: 0, vy: -0.001, size: 2, alpha: 1 }
    expect(stepParticle(below, 100).y).toBeCloseTo(0.95, 5)
  })

  it('fades alpha in toward 1 but never past it', () => {
    const p: DustParticle = { x: 0.5, y: 0.5, vx: 0, vy: 0, size: 2, alpha: 0 }
    const next = stepParticle(p, 100)
    expect(next.alpha).toBeGreaterThan(0)
    let cur = p
    for (let i = 0; i < 1000; i++) cur = stepParticle(cur, 100)
    expect(cur.alpha).toBe(1)
  })
})

describe('useDust — startDust', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetDustForTests()
  })

  it('spawns no particles before the settle dust beat', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startDust()
    __setActForTests('flirt', clock)
    clock.advance(10_000)
    expect(useDust().particles.value.length).toBe(0)
    stopDust()
    stopDirector()
  })

  it('spawns particles once the session passes the settle dust beat', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startDust()
    __setActForTests('settle', clock)
    clock.advance(170_000)
    expect(useDust().particles.value.length).toBeGreaterThan(0)
    expect(useDust().particles.value.length).toBeLessThanOrEqual(DUST_MAX)
    stopDust()
    stopDirector()
  })

  it('stopDust halts spawning', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startDust()
    stopDust()
    __setActForTests('settle', clock)
    clock.advance(170_000)
    expect(useDust().particles.value.length).toBe(0)
    stopDirector()
  })
})
