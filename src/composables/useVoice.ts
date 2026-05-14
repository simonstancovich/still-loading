import { ref, type Ref } from 'vue'
import { voiceLines } from '@/corpus/voiceLines'
import type { Act, Mood, VoiceLine } from '@/lib/director-types'

export const MIN_GAP_MS = 6_000

export function eligibleLines(act: Act, mood: Mood, shown: ReadonlySet<string>): VoiceLine[] {
  return voiceLines.filter(
    (line) => line.act.includes(act) && line.mood.includes(mood) && !shown.has(line.text),
  )
}

export interface VoiceApi {
  currentLine: Ref<VoiceLine | null>
  currentLineStartedMs: Ref<number>
  history: Ref<readonly string[]>
}

const currentLine = ref<VoiceLine | null>(null)
const currentLineStartedMs = ref(Number.NEGATIVE_INFINITY)
const history = ref<readonly string[]>([])

export function useVoice(): VoiceApi {
  return { currentLine, currentLineStartedMs, history }
}
