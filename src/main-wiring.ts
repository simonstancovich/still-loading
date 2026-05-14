import { useDocumentVisibility } from '@vueuse/core'
import { watch } from 'vue'

export interface PauseTarget {
  pause: () => void
  resume: () => void
}

export function handleVisibilityChange(state: DocumentVisibilityState, target: PauseTarget): void {
  if (state === 'hidden') target.pause()
  else target.resume()
}

export function wireVisibilityToDirector(target: PauseTarget): () => void {
  const visibility = useDocumentVisibility()
  return watch(visibility, (state) => {
    handleVisibilityChange(state, target)
  })
}
