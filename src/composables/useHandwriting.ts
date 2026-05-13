import { ref, type Ref } from 'vue'

export interface HandwritingGlyph {
  char: string
  path: string
  width: number
}

export interface HandwritingRender {
  paths: readonly string[]
  totalLengthPx: number
  durationMs: number
}

export interface HandwritingApi {
  ready: Ref<boolean>
  loadAtlas: () => Promise<void>
  renderText: (text: string, strokeMs: number) => HandwritingRender
}

export function useHandwriting(): HandwritingApi {
  const ready = ref(false)
  return {
    ready,
    loadAtlas: () => Promise.reject(new Error('useHandwriting.loadAtlas: not implemented')),
    renderText: () => {
      throw new Error('useHandwriting.renderText: not implemented')
    },
  }
}
