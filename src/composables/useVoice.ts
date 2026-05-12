import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'
import type { VoiceLine } from '@/lib/director-types'

export interface VoiceApi {
  currentLine: Ref<VoiceLine | null>
  history: Ref<readonly string[]>
}

export function useVoice(_director: DirectorApi): VoiceApi {
  const currentLine = ref<VoiceLine | null>(null)
  const history = ref<readonly string[]>([])
  return { currentLine, history }
}
