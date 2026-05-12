import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'

export interface FireflyPath {
  word: string
  points: readonly { x: number; y: number; t: number }[]
}

export interface FireflyApi {
  active: Ref<FireflyPath | null>
  position: Ref<{ x: number; y: number } | null>
}

export function useFireflies(_director: DirectorApi): FireflyApi {
  const active = ref<FireflyPath | null>(null)
  const position = ref<{ x: number; y: number } | null>(null)
  return { active, position }
}
