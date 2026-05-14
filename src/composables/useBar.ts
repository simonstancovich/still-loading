import { ref, type Ref } from 'vue'
import type { Act } from '@/lib/director-types'

export type BarMood = 'misbehaving' | 'calm' | 'radiant' | 'held'

export interface BarState {
  positionX: number
  positionY: number
  widthPx: number
  fillPercent: number
  mood: BarMood
  glowing: boolean
}

export interface BarApi {
  state: Ref<BarState>
}

export type Keyframe = readonly [number, number]

export const FILL_KEYFRAMES: readonly Keyframe[] = [
  [0, 0],
  [1_000, 0],
  [7_000, 8],
  [15_000, 28],
  [16_000, 22],
  [27_000, 22],
  [27_700, 96],
  [30_000, 11],
  [90_000, 11],
  [150_000, 11],
  [162_000, 24],
  [600_000, 24],
]

export const POSITION_Y_KEYFRAMES: readonly Keyframe[] = [
  [0, 50],
  [220_000, 50],
  [260_000, 33],
  [600_000, 33],
]

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

const MOOD_BY_ACT: Readonly<Record<Act, BarMood>> = {
  preflight: 'calm',
  flirt: 'misbehaving',
  settle: 'calm',
  cathedral: 'calm',
  invite: 'calm',
  ritual: 'calm',
  held: 'held',
  secondCathedral: 'radiant',
  ending: 'radiant',
  longTail: 'calm',
}

export function barMoodForAct(act: Act): BarMood {
  return MOOD_BY_ACT[act]
}

const barState = ref<BarState>({
  positionX: 50,
  positionY: 50,
  widthPx: 220,
  fillPercent: 0,
  mood: 'calm',
  glowing: false,
})

export function useBar(): BarApi {
  return { state: barState }
}
