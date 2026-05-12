import { readonly, ref, type Readonly, type Ref } from 'vue'
import type { DirectorState } from '@/lib/director-types'

export interface DirectorApi {
  state: Readonly<Ref<DirectorState>>
  submitHate: (text: string) => void
  submitLove: (text: string) => void
  flagSafetyConcern: () => void
  pause: () => void
  resume: () => void
}

export function useDirector(): DirectorApi {
  const state = ref<DirectorState>({
    act: 'preflight',
    mood: 'playful',
    ritual: 'idle',
    sessionMs: 0,
    stillnessMs: 0,
    visitorTier: 'first',
    presenceCount: 1,
    lifetimeCount: 0,
    paused: false,
  })

  return {
    state: readonly(state) as Readonly<Ref<DirectorState>>,
    submitHate: () => {
      throw new Error('useDirector.submitHate: not implemented')
    },
    submitLove: () => {
      throw new Error('useDirector.submitLove: not implemented')
    },
    flagSafetyConcern: () => {
      throw new Error('useDirector.flagSafetyConcern: not implemented')
    },
    pause: () => {
      throw new Error('useDirector.pause: not implemented')
    },
    resume: () => {
      throw new Error('useDirector.resume: not implemented')
    },
  }
}
