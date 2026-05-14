import { ref, type DeepReadonly, type Ref } from 'vue'
import type { Clock } from '@/composables/useDirector'

export const lastMoveAt = ref(0)

export interface StillnessApi {
  lastMoveAt: DeepReadonly<Ref<number>>
}

export function useStillness(): StillnessApi {
  return { lastMoveAt }
}

export function recordMove(now: number): void {
  lastMoveAt.value = now
}

export function startStillnessTracking(clock: Clock): () => void {
  lastMoveAt.value = clock.now()
  const onMove = (): void => {
    lastMoveAt.value = clock.now()
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('touchmove', onMove, { passive: true })
  return () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('touchmove', onMove)
  }
}

export function __resetStillnessForTests(): void {
  lastMoveAt.value = 0
}
