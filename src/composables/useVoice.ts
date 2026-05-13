import { ref, type Ref } from 'vue'
import { injectDirector } from '@/composables/useDirector'
import type { VoiceLine } from '@/lib/director-types'

export interface VoiceApi {
  currentLine: Ref<VoiceLine | null>
  history: Ref<readonly string[]>
}

export function useVoice(): VoiceApi {
  const _director = injectDirector()
  const currentLine = ref<VoiceLine | null>(null)
  const history = ref<readonly string[]>([])
  return { currentLine, history }
}
