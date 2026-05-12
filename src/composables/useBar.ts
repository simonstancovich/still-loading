import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'

export type BarMood = 'misbehaving' | 'calm' | 'radiant' | 'held'

export interface BarState {
  positionX: number
  positionY: number
  widthPx: number
  fillPercent: number
  mood: BarMood
  glowing: boolean
}

export interface BarApi {
  state: Ref<BarState>
}

export function useBar(_director: DirectorApi): BarApi {
  const state = ref<BarState>({
    positionX: 50,
    positionY: 50,
    widthPx: 220,
    fillPercent: 0,
    mood: 'calm',
    glowing: false,
  })
  return { state }
}
