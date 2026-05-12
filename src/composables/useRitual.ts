import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'
import type { RitualState } from '@/lib/director-types'

export interface RitualApi {
  state: Ref<RitualState>
  hateEchoes: Ref<readonly string[]>
  loveResolution: Ref<{ source: 'self' | 'gift'; word: string } | null>
  submitHate: (text: string) => void
  submitLove: (text: string) => void
}

export function useRitual(_director: DirectorApi): RitualApi {
  const state = ref<RitualState>('idle')
  const hateEchoes = ref<readonly string[]>([])
  const loveResolution = ref<{ source: 'self' | 'gift'; word: string } | null>(null)
  return {
    state,
    hateEchoes,
    loveResolution,
    submitHate: () => {
      throw new Error('useRitual.submitHate: not implemented')
    },
    submitLove: () => {
      throw new Error('useRitual.submitLove: not implemented')
    },
  }
}
