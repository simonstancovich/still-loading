import { ref, watch, type Ref } from 'vue'
import { useDirector } from '@/composables/useDirector'
import { lerpKeyframes, type Keyframe } from '@/lib/keyframes'

export const DUST_MAX = 30
const ALPHA_FADE_PER_MS = 1 / 1_200

export interface DustParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export interface DustApi {
  particles: Ref<readonly DustParticle[]>
}

const DUST_COUNT_KEYFRAMES: readonly Keyframe[] = [
  [0, 0],
  [164_000, 0],
  [165_000, 8],
  [195_000, 30],
  [600_000, 30],
]

export function dustCountAt(sessionMs: number): number {
  return Math.min(DUST_MAX, Math.round(lerpKeyframes(DUST_COUNT_KEYFRAMES, sessionMs)))
}

export function spawnParticle(): DustParticle {
  return {
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00012,
    vy: (Math.random() - 0.5) * 0.00012,
    size: 1.5 + Math.random() * 2.5,
    alpha: 0,
  }
}

function wrap01(v: number): number {
  // Modulo wrap — robust to any overshoot, not just one field-width.
  return ((v % 1) + 1) % 1
}

export function stepParticle(p: DustParticle, dtMs: number): DustParticle {
  return {
    x: wrap01(p.x + p.vx * dtMs),
    y: wrap01(p.y + p.vy * dtMs),
    vx: p.vx,
    vy: p.vy,
    size: p.size,
    alpha: Math.min(1, p.alpha + ALPHA_FADE_PER_MS * dtMs),
  }
}

const particles = ref<readonly DustParticle[]>([])

export function useDust(): DustApi {
  return { particles }
}

function updateDust(sessionMs: number, dtMs: number): void {
  const target = dustCountAt(sessionMs)
  // Spawn toward the target first, then step every particle — so a
  // freshly-spawned particle participates in this frame (it fades in and
  // drifts immediately rather than waiting a tick). This also makes the
  // dust visible under the debug scrubber's single large time jumps.
  const current: DustParticle[] = [...particles.value]
  while (current.length < target) current.push(spawnParticle())
  if (current.length > target) current.length = target
  particles.value = current.map((p) => stepParticle(p, dtMs))
}

let watchStop: (() => void) | null = null
let lastSessionMs = 0

export function startDust(): void {
  if (watchStop) return
  const director = useDirector()
  lastSessionMs = director.state.value.sessionMs
  watchStop = watch(
    () => director.state.value.sessionMs,
    (sessionMs) => {
      const dt = Math.max(0, sessionMs - lastSessionMs)
      lastSessionMs = sessionMs
      updateDust(sessionMs, dt)
    },
    { flush: 'sync' },
  )
}

export function stopDust(): void {
  watchStop?.()
  watchStop = null
}

export function __resetDustForTests(): void {
  stopDust()
  particles.value = []
  lastSessionMs = 0
}
