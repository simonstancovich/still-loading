import { ref, watch, type Ref } from 'vue'
import type { Act } from '@/lib/director-types'
import { useDirector } from '@/composables/useDirector'
import { cursorX, cursorY } from '@/composables/useStillness'
import { lerpKeyframes, type Keyframe } from '@/lib/keyframes'

export { lerpKeyframes, type Keyframe }

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

export const SMOOTHING = 0.15

// The bar's staged entrance during preflight: invisible from sec 0, fades
// in starting at BAR_ENTRANCE_MS. Earlier than flirt entry (see
// PREFLIGHT_MS in useDirector) so there's a beat with bar-but-no-voice
// before the greeting arrives.
export const BAR_ENTRANCE_MS = 1_500

// Sprint pulse: a warm bloom radiating from the bar across the flirt-act
// sprint moment (fill 22 → 96 → 11 between ~27 000 and 30 000 ms). Pure —
// renderers compute their scale/opacity from this.
export const PULSE_START_MS = 27_000
export const PULSE_PEAK_MS = 27_700
export const PULSE_END_MS = 28_500

export interface PulseEnvelope {
  scale: number
  alpha: number
}

export function pulseAt(sessionMs: number): PulseEnvelope {
  if (sessionMs < PULSE_START_MS || sessionMs > PULSE_END_MS) {
    return { scale: 1, alpha: 0 }
  }
  if (sessionMs <= PULSE_PEAK_MS) {
    const r = (sessionMs - PULSE_START_MS) / (PULSE_PEAK_MS - PULSE_START_MS)
    return { scale: 1 + r * 3, alpha: r * 0.8 }
  }
  const r = (sessionMs - PULSE_PEAK_MS) / (PULSE_END_MS - PULSE_PEAK_MS)
  return { scale: 4 - r, alpha: 0.8 * (1 - r) }
}

function updateBar(act: Act, sessionMs: number): void {
  const viewportW = typeof window === 'undefined' ? 1 : window.innerWidth
  const viewportH = typeof window === 'undefined' ? 1 : window.innerHeight
  const target = computeBarTarget(act, sessionMs, cursorX.value, cursorY.value, viewportW, viewportH)
  const s = barState.value
  s.positionX += (target.x - s.positionX) * SMOOTHING
  s.positionY += (target.y - s.positionY) * SMOOTHING
  s.fillPercent = target.fill
  s.mood = target.mood
}

let watchStop: (() => void) | null = null

export function startBar(): void {
  if (watchStop) return
  const director = useDirector()
  watchStop = watch(
    () => director.state.value.sessionMs,
    () => {
      updateBar(director.state.value.act, director.state.value.sessionMs)
    },
    { flush: 'sync' },
  )
}

export function stopBar(): void {
  watchStop?.()
  watchStop = null
}

export function __resetBarForTests(): void {
  stopBar()
  barState.value = {
    positionX: 50,
    positionY: 50,
    widthPx: 220,
    fillPercent: 0,
    mood: 'calm',
    glowing: false,
  }
}
