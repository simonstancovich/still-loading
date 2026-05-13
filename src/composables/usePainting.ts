import { ref, type Ref } from 'vue'
import { injectDirector } from '@/composables/useDirector'

export interface PaintingApi {
  canvas: Ref<HTMLCanvasElement | null>
  isRevealed: Ref<boolean>
  reveal: () => void
  exportPng: () => Promise<Blob>
}

export function usePainting(): PaintingApi {
  const _director = injectDirector()
  const canvas = ref<HTMLCanvasElement | null>(null)
  const isRevealed = ref(false)
  return {
    canvas,
    isRevealed,
    reveal: () => {
      throw new Error('usePainting.reveal: not implemented')
    },
    exportPng: () => {
      throw new Error('usePainting.exportPng: not implemented')
    },
  }
}
