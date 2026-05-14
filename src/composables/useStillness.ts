import { ref, type DeepReadonly, type Ref } from 'vue'
import type { Clock } from '@/composables/useDirector'

export const lastMoveAt = ref(0)
export const cursorX = ref(0)
export const cursorY = ref(0)

export interface StillnessApi {
  lastMoveAt: DeepReadonly<Ref<number>>
}

export function useStillness(): StillnessApi {
  return { lastMoveAt }
}

export function recordMove(now: number): void {
  lastMoveAt.value = now
}

export function recordCursor(x: number, y: number): void {
  cursorX.value = x
  cursorY.value = y
}

export function startStillnessTracking(clock: Clock): () => void {
  lastMoveAt.value = clock.now()
  const onMouse = (ev: MouseEvent): void => {
    lastMoveAt.value = clock.now()
    cursorX.value = ev.clientX
    cursorY.value = ev.clientY
  }
  const onTouch = (ev: TouchEvent): void => {
    lastMoveAt.value = clock.now()
    const touch = ev.touches[0]
    if (touch) {
      cursorX.value = touch.clientX
      cursorY.value = touch.clientY
    }
  }
  window.addEventListener('mousemove', onMouse, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  return () => {
    window.removeEventListener('mousemove', onMouse)
    window.removeEventListener('touchmove', onTouch)
  }
}

export function __resetStillnessForTests(): void {
  lastMoveAt.value = 0
  cursorX.value = 0
  cursorY.value = 0
}
