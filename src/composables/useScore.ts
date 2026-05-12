import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'

export interface ScoreApi {
  isPlaying: Ref<boolean>
  volume: Ref<number>
  pulse: Ref<number>
  play: () => Promise<void>
  pause: () => void
  setVolume: (v: number) => void
}

export function useScore(_director: DirectorApi): ScoreApi {
  const isPlaying = ref(false)
  const volume = ref(0.7)
  const pulse = ref(0)
  return {
    isPlaying,
    volume,
    pulse,
    play: () => {
      throw new Error('useScore.play: not implemented')
    },
    pause: () => {
      throw new Error('useScore.pause: not implemented')
    },
    setVolume: () => {
      throw new Error('useScore.setVolume: not implemented')
    },
  }
}
