import { describe, expect, it } from 'vitest'
import { lerpKeyframes, type Keyframe } from '@/lib/keyframes'

describe('lerpKeyframes', () => {
  const kf: readonly Keyframe[] = [
    [0, 0],
    [100, 10],
    [200, 10],
    [300, 50],
  ]

  it('clamps to the first value before the first keyframe', () => {
    expect(lerpKeyframes(kf, -10)).toBe(0)
    expect(lerpKeyframes(kf, 0)).toBe(0)
  })

  it('clamps to the last value after the last keyframe', () => {
    expect(lerpKeyframes(kf, 300)).toBe(50)
    expect(lerpKeyframes(kf, 9999)).toBe(50)
  })

  it('interpolates linearly between keyframes', () => {
    expect(lerpKeyframes(kf, 50)).toBe(5)
    expect(lerpKeyframes(kf, 250)).toBe(30)
  })

  it('holds across a flat segment', () => {
    expect(lerpKeyframes(kf, 150)).toBe(10)
  })

  it('returns 0 for an empty keyframe list', () => {
    expect(lerpKeyframes([], 100)).toBe(0)
  })
})
