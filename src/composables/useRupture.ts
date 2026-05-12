import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'

export interface RuptureState {
  phase: 'idle' | 'black' | 'bloom'
  startedAt: number
  intensity: number
}

export interface RuptureApi {
  state: Ref<RuptureState>
  trigger: (intensity: number) => void
}

export function useRupture(_director: DirectorApi): RuptureApi {
  const state = ref<RuptureState>({ phase: 'idle', startedAt: 0, intensity: 0 })
  return {
    state,
    trigger: () => {
      throw new Error('useRupture.trigger: not implemented')
    },
  }
}
