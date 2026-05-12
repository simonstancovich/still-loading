import { ref, type Ref } from 'vue'

export interface KeystrokeRhythmApi {
  intervalsMs: Ref<readonly number[]>
  averageMs: Ref<number>
  capture: (ev: KeyboardEvent) => void
  reset: () => void
}

export function useKeystrokeRhythm(): KeystrokeRhythmApi {
  const intervalsMs = ref<readonly number[]>([])
  const averageMs = ref(55)
  return {
    intervalsMs,
    averageMs,
    capture: () => {
      throw new Error('useKeystrokeRhythm.capture: not implemented')
    },
    reset: () => {
      throw new Error('useKeystrokeRhythm.reset: not implemented')
    },
  }
}
