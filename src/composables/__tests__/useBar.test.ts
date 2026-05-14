import { describe, expect, it } from 'vitest'
import {
  FILL_KEYFRAMES,
  POSITION_Y_KEYFRAMES,
  barMoodForAct,
  lerpKeyframes,
} from '@/composables/useBar'

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
