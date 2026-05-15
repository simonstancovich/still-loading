import { beforeEach, describe, expect, it } from 'vitest'
import {
  AVOIDANCE_MAX_NUDGE,
  AVOIDANCE_RADIUS_PX,
  FILL_KEYFRAMES,
  POSITION_Y_KEYFRAMES,
  PULSE_END_MS,
  PULSE_PEAK_MS,
  PULSE_START_MS,
  SMOOTHING,
  __resetBarForTests,
  avoidanceNudge,
  barMoodForAct,
  computeBarTarget,
  lerpKeyframes,
  pulseAt,
  startBar,
  stopBar,
  useBar,
} from '@/composables/useBar'
import {
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests } from '@/composables/useStillness'

describe('useBar — lerpKeyframes', () => {
  const kf: readonly (readonly [number, number])[] = [
    [0, 0],
    [100, 10],
    [200, 10],
    [300, 50],
  ]

  it('returns the first value when t is at or before the first keyframe', () => {
    expect(lerpKeyframes(kf, -10)).toBe(0)
    expect(lerpKeyframes(kf, 0)).toBe(0)
  })

  it('returns the last value when t is at or after the last keyframe', () => {
    expect(lerpKeyframes(kf, 300)).toBe(50)
    expect(lerpKeyframes(kf, 9999)).toBe(50)
  })

  it('interpolates linearly between two keyframes', () => {
    expect(lerpKeyframes(kf, 50)).toBe(5)
    expect(lerpKeyframes(kf, 250)).toBe(30)
  })

  it('holds a constant value across a flat segment', () => {
    expect(lerpKeyframes(kf, 150)).toBe(10)
  })

  it('FILL_KEYFRAMES encodes the flirt comedy sequence', () => {
    expect(lerpKeyframes(FILL_KEYFRAMES, 0)).toBe(0)
    expect(lerpKeyframes(FILL_KEYFRAMES, 7_000)).toBe(8)
    expect(lerpKeyframes(FILL_KEYFRAMES, 15_000)).toBe(28)
    expect(lerpKeyframes(FILL_KEYFRAMES, 16_000)).toBe(22)
    expect(lerpKeyframes(FILL_KEYFRAMES, 27_700)).toBe(96)
    expect(lerpKeyframes(FILL_KEYFRAMES, 30_000)).toBe(11)
    expect(lerpKeyframes(FILL_KEYFRAMES, 162_000)).toBe(24)
  })

  it('POSITION_Y_KEYFRAMES holds 50 then migrates to 33', () => {
    expect(lerpKeyframes(POSITION_Y_KEYFRAMES, 0)).toBe(50)
    expect(lerpKeyframes(POSITION_Y_KEYFRAMES, 220_000)).toBe(50)
    expect(lerpKeyframes(POSITION_Y_KEYFRAMES, 260_000)).toBe(33)
    expect(lerpKeyframes(POSITION_Y_KEYFRAMES, 240_000)).toBe(41.5)
  })
})

describe('useBar — barMoodForAct', () => {
  it('flirt is misbehaving', () => {
    expect(barMoodForAct('flirt')).toBe('misbehaving')
  })

  it('preflight, settle, cathedral, invite, ritual, longTail are calm', () => {
    for (const act of ['preflight', 'settle', 'cathedral', 'invite', 'ritual', 'longTail'] as const) {
      expect(barMoodForAct(act)).toBe('calm')
    }
  })

  it('held is held', () => {
    expect(barMoodForAct('held')).toBe('held')
  })

  it('secondCathedral and ending are radiant', () => {
    expect(barMoodForAct('secondCathedral')).toBe('radiant')
    expect(barMoodForAct('ending')).toBe('radiant')
  })
})

describe('useBar — avoidanceNudge', () => {
  const VW = 1000
  const VH = 1000

  it('is zero when the cursor is beyond the avoidance radius', () => {
    const nudge = avoidanceNudge(50, 50, 50, 50, VW, VH)
    expect(nudge.dx).toBe(0)
    expect(nudge.dy).toBe(0)
  })

  it('pushes away from a cursor that is to the left of the bar', () => {
    const nudge = avoidanceNudge(50, 50, 450, 500, VW, VH)
    expect(nudge.dx).toBeGreaterThan(0)
    expect(Math.abs(nudge.dy)).toBeLessThan(0.0001)
  })

  it('pushes away from a cursor that is below the bar', () => {
    const nudge = avoidanceNudge(50, 50, 500, 450, VW, VH)
    expect(nudge.dy).toBeGreaterThan(0)
    expect(Math.abs(nudge.dx)).toBeLessThan(0.0001)
  })

  it('pushes harder when the cursor is closer', () => {
    const near = avoidanceNudge(50, 50, 490, 500, VW, VH)
    const far = avoidanceNudge(50, 50, 350, 500, VW, VH)
    expect(near.dx).toBeGreaterThan(far.dx)
  })

  it('never exceeds AVOIDANCE_MAX_NUDGE on either axis', () => {
    const nudge = avoidanceNudge(50, 50, 500, 500, VW, VH)
    expect(Math.abs(nudge.dx)).toBeLessThanOrEqual(AVOIDANCE_MAX_NUDGE)
    expect(Math.abs(nudge.dy)).toBeLessThanOrEqual(AVOIDANCE_MAX_NUDGE)
  })

  it('AVOIDANCE_RADIUS_PX is 250', () => {
    expect(AVOIDANCE_RADIUS_PX).toBe(250)
  })
})

describe('useBar — computeBarTarget', () => {
  const VW = 1000
  const VH = 1000
  const FAR_X = 0
  const FAR_Y = 0

  it('fill follows the keyframe timeline regardless of act', () => {
    expect(computeBarTarget('flirt', 7_000, FAR_X, FAR_Y, VW, VH).fill).toBe(8)
    expect(computeBarTarget('settle', 162_000, FAR_X, FAR_Y, VW, VH).fill).toBe(24)
  })

  it('mood follows the act', () => {
    expect(computeBarTarget('flirt', 5_000, FAR_X, FAR_Y, VW, VH).mood).toBe('misbehaving')
    expect(computeBarTarget('cathedral', 200_000, FAR_X, FAR_Y, VW, VH).mood).toBe('calm')
  })

  it('x is 50 and y is 50 before the cathedral migration', () => {
    const target = computeBarTarget('settle', 100_000, FAR_X, FAR_Y, VW, VH)
    expect(target.x).toBe(50)
    expect(target.y).toBe(50)
  })

  it('y migrates toward the upper third during cathedral', () => {
    expect(computeBarTarget('cathedral', 220_000, FAR_X, FAR_Y, VW, VH).y).toBe(50)
    expect(computeBarTarget('cathedral', 260_000, FAR_X, FAR_Y, VW, VH).y).toBe(33)
  })

  it('applies cursor avoidance only during the flirt avoidance window', () => {
    const duringFlirt = computeBarTarget('flirt', 10_000, 500, 500, VW, VH)
    expect(duringFlirt.x !== 50 || duringFlirt.y !== 50).toBe(true)

    const duringSettle = computeBarTarget('settle', 100_000, 500, 500, VW, VH)
    expect(duringSettle.x).toBe(50)
    expect(duringSettle.y).toBe(50)
  })

  it('does not apply avoidance before AVOIDANCE_START_MS or after AVOIDANCE_END_MS', () => {
    const tooEarly = computeBarTarget('flirt', 2_000, 500, 500, VW, VH)
    expect(tooEarly.x).toBe(50)
    expect(tooEarly.y).toBe(50)

    const tooLate = computeBarTarget('flirt', 85_000, 500, 500, VW, VH)
    expect(tooLate.x).toBe(50)
  })
})

describe('useBar — startBar / updateBar', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetBarForTests()
  })

  it('updates fillPercent to follow the keyframe timeline as the clock advances', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startBar()
    __setActForTests('flirt', clock)

    clock.advance(7_000)
    expect(useBar().state.value.fillPercent).toBe(8)

    clock.advance(27_700 - 7_000)
    expect(useBar().state.value.fillPercent).toBe(96)

    stopBar()
    stopDirector()
  })

  it('eases positionY toward the target rather than snapping', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startBar()
    __setActForTests('cathedral', clock)

    clock.advance(260_000)
    const afterOneTick = useBar().state.value.positionY
    expect(afterOneTick).toBeGreaterThan(33)
    expect(afterOneTick).toBeLessThan(50)
    expect(afterOneTick).toBeCloseTo(50 + (33 - 50) * SMOOTHING, 5)

    stopBar()
    stopDirector()
  })

  it('stopBar halts updates — later clock advances do not change bar state', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startBar()
    __setActForTests('flirt', clock)
    stopBar()

    clock.advance(7_000)
    expect(useBar().state.value.fillPercent).toBe(0)

    stopDirector()
  })

  it('startBar is idempotent', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startBar()
    startBar()
    __setActForTests('flirt', clock)

    clock.advance(7_000)
    expect(useBar().state.value.fillPercent).toBe(8)

    stopBar()
    stopDirector()
  })
})

describe('useBar — pulseAt', () => {
  it('is silent outside the sprint window', () => {
    expect(pulseAt(PULSE_START_MS - 1)).toEqual({ scale: 1, alpha: 0 })
    expect(pulseAt(PULSE_END_MS + 1)).toEqual({ scale: 1, alpha: 0 })
    expect(pulseAt(0)).toEqual({ scale: 1, alpha: 0 })
  })

  it('peaks at PULSE_PEAK_MS', () => {
    const peak = pulseAt(PULSE_PEAK_MS)
    expect(peak.scale).toBeCloseTo(4, 5)
    expect(peak.alpha).toBeCloseTo(0.8, 5)
  })

  it('alpha is in 0..1 across the window', () => {
    for (let t = PULSE_START_MS; t <= PULSE_END_MS; t += 100) {
      const p = pulseAt(t)
      expect(p.alpha).toBeGreaterThanOrEqual(0)
      expect(p.alpha).toBeLessThanOrEqual(1)
    }
  })

  it('scale grows monotonically up to the peak, falls back down after', () => {
    let prev = pulseAt(PULSE_START_MS).scale
    for (let t = PULSE_START_MS + 50; t <= PULSE_PEAK_MS; t += 50) {
      const s = pulseAt(t).scale
      expect(s).toBeGreaterThanOrEqual(prev)
      prev = s
    }
    prev = pulseAt(PULSE_PEAK_MS).scale
    for (let t = PULSE_PEAK_MS + 50; t <= PULSE_END_MS; t += 50) {
      const s = pulseAt(t).scale
      expect(s).toBeLessThanOrEqual(prev)
      prev = s
    }
  })
})
