import { ref, watch, type Ref } from 'vue'
import type { RitualState } from '@/lib/director-types'
import { checkSafety } from '@/corpus/safety'
import { seedGifts } from '@/corpus/seedGifts'
import {
  __registerRitualHooks,
  __registerRitualStateGetter,
  useDirector,
} from '@/composables/useDirector'

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
  const hit = checkSafety(trimmed)
  if (hit) safetyTier.value = hit.tier
  state.value = 'multiplyingHate'
  if (hit?.tier === 1) {
    // Do not amplify distress visually — skip the echo multiplication.
    hateEchoes.value = []
  } else {
    hateEchoes.value = Array.from({ length: HATE_ECHO_COUNT }, () => trimmed)
  }
  state.value = 'askingLove'
}

const NOTHING_ANSWERS: readonly string[] = ['nothing', 'idk', 'none', 'nada', 'nope']

function isNothingAnswer(trimmed: string): boolean {
  if (trimmed.length === 0) return true
  const normalized = trimmed.toLowerCase().replace(/[.!? ]+$/g, '')
  return NOTHING_ANSWERS.includes(normalized)
}

function pickGift(): string {
  const index = Math.floor(Math.random() * seedGifts.length)
  return seedGifts[index] ?? seedGifts[0] ?? 'you are here'
}

export function submitLove(text: string): void {
  if (state.value !== 'askingLove') return
  const trimmed = text.trim()
  if (isNothingAnswer(trimmed)) {
    state.value = 'nothingBranch'
    loveResolution.value = { source: 'gift', word: pickGift() }
    state.value = 'gifted'
    state.value = 'resolved'
    return
  }
  state.value = 'receivingLove'
  loveResolution.value = { source: 'self', word: trimmed }
  state.value = 'erasing'
  state.value = 'resolved'
}

let watchStop: (() => void) | null = null

export function startRitual(): void {
  if (watchStop) return
  const director = useDirector()
  watchStop = watch(
    () => director.state.value.act,
    (act) => {
      if (act === 'invite') beginRitual()
    },
    { flush: 'sync' },
  )
}

export function stopRitual(): void {
  watchStop?.()
  watchStop = null
}

export function __resetRitualForTests(): void {
  stopRitual()
  state.value = 'idle'
  hateEchoes.value = []
  loveResolution.value = null
  safetyTier.value = null
}

__registerRitualHooks({ submitHate, submitLove })
__registerRitualStateGetter(() => state.value)
