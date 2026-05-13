import { inject, readonly, ref, type DeepReadonly, type InjectionKey, type Ref } from 'vue'
import type { DirectorState } from '@/lib/director-types'

export interface DirectorApi {
  state: DeepReadonly<Ref<DirectorState>>
  submitHate: (text: string) => void
  submitLove: (text: string) => void
  flagSafetyConcern: () => void
  pause: () => void
  resume: () => void
}

function createInitialState(): DirectorState {
  return {
    act: 'preflight',
    mood: 'playful',
    ritual: 'idle',
    sessionMs: 0,
    stillnessMs: 0,
    visitorTier: 'first',
    presenceCount: 1,
    lifetimeCount: 0,
    paused: false,
  }
}

const directorState = ref<DirectorState>(createInitialState())

let cachedApi: DirectorApi | null = null

function buildApi(): DirectorApi {
  return {
    state: readonly(directorState),
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

export function useDirector(): DirectorApi {
  cachedApi ??= buildApi()
  return cachedApi
}

export const DIRECTOR_KEY: InjectionKey<DirectorApi> = Symbol('director')

export function injectDirector(): DirectorApi {
  const api = inject(DIRECTOR_KEY)
  if (!api) {
    throw new Error(
      'Director not provided. Call app.provide(DIRECTOR_KEY, useDirector()) in main.ts before mount.',
    )
  }
  return api
}

export function __resetDirectorStateForTests(): void {
  directorState.value = createInitialState()
  cachedApi = null
}
