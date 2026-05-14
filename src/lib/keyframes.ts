export type Keyframe = readonly [number, number]

export function lerpKeyframes(keyframes: readonly Keyframe[], t: number): number {
  const first = keyframes[0]
  if (!first) return 0
  if (t <= first[0]) return first[1]
  const last = keyframes[keyframes.length - 1]
  if (!last) return 0
  if (t >= last[0]) return last[1]
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (!a || !b) continue
    if (t >= a[0] && t <= b[0]) {
      const span = b[0] - a[0]
      if (span === 0) return a[1]
      const ratio = (t - a[0]) / span
      return a[1] + (b[1] - a[1]) * ratio
    }
  }
  return last[1]
}
