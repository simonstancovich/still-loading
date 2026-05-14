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

export const AVOIDANCE_RADIUS_PX = 250
export const AVOIDANCE_MAX_NUDGE = 8
export const AVOIDANCE_START_MS = 4_000
export const AVOIDANCE_END_MS = 80_000

export interface Nudge {
  dx: number
  dy: number
}

export function avoidanceNudge(
  barXPct: number,
  barYPct: number,
  cursorXPx: number,
  cursorYPx: number,
  viewportW: number,
  viewportH: number,
): Nudge {
  const barCx = (barXPct / 100) * viewportW
  const barCy = (barYPct / 100) * viewportH
  const awayX = barCx - cursorXPx
  const awayY = barCy - cursorYPx
  const distance = Math.hypot(awayX, awayY)
  if (distance >= AVOIDANCE_RADIUS_PX) return { dx: 0, dy: 0 }
  const strength = (AVOIDANCE_RADIUS_PX - distance) / AVOIDANCE_RADIUS_PX
  if (distance < 1) {
    return { dx: 0, dy: -AVOIDANCE_MAX_NUDGE * strength }
  }
  const dirX = awayX / distance
  const dirY = awayY / distance
  return {
    dx: dirX * strength * AVOIDANCE_MAX_NUDGE,
    dy: dirY * strength * AVOIDANCE_MAX_NUDGE,
  }
}

export interface BarTarget {
  x: number
  y: number
  fill: number
  mood: BarMood
}

export function computeBarTarget(
  act: Act,
  sessionMs: number,
  cursorXPx: number,
  cursorYPx: number,
  viewportW: number,
  viewportH: number,
): BarTarget {
  const fill = lerpKeyframes(FILL_KEYFRAMES, sessionMs)
  const mood = barMoodForAct(act)
  const restX = 50
  const restY = lerpKeyframes(POSITION_Y_KEYFRAMES, sessionMs)
  let x = restX
  let y = restY
  const avoidanceActive =
    act === 'flirt' && sessionMs >= AVOIDANCE_START_MS && sessionMs <= AVOIDANCE_END_MS
  if (avoidanceActive) {
    const nudge = avoidanceNudge(restX, restY, cursorXPx, cursorYPx, viewportW, viewportH)
    x += nudge.dx
    y += nudge.dy
  }
  return { x, y, fill, mood }
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
