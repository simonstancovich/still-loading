import { ref, type Ref } from 'vue'
import type { RitualState } from '@/lib/director-types'

export const HATE_ECHO_COUNT = 14

export interface LoveResolution {
  source: 'self' | 'gift'
  word: string
}

export interface RitualApi {
  state: Ref<RitualState>
  hateEchoes: Ref<readonly string[]>
  loveResolution: Ref<LoveResolution | null>
  safetyTier: Ref<1 | 2 | null>
}

const state = ref<RitualState>('idle')
const hateEchoes = ref<readonly string[]>([])
const loveResolution = ref<LoveResolution | null>(null)
const safetyTier = ref<1 | 2 | null>(null)

export function useRitual(): RitualApi {
  return { state, hateEchoes, loveResolution, safetyTier }
}

export function beginRitual(): void {
  if (state.value !== 'idle') return
  state.value = 'askingHate'
}

export function submitHate(text: string): void {
  if (state.value !== 'askingHate') return
  const trimmed = text.trim()
  if (trimmed.length === 0) return
  state.value = 'multiplyingHate'
  hateEchoes.value = Array.from({ length: HATE_ECHO_COUNT }, () => trimmed)
  state.value = 'askingLove'
}

export function __resetRitualForTests(): void {
  state.value = 'idle'
  hateEchoes.value = []
  loveResolution.value = null
  safetyTier.value = null
}
