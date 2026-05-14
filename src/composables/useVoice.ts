import { ref, watch, type Ref } from 'vue'
import { voiceLines } from '@/corpus/voiceLines'
import { useDirector } from '@/composables/useDirector'
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
const shown = new Set<string>()
let lastLineAtMs = Number.NEGATIVE_INFINITY

export function useVoice(): VoiceApi {
  return { currentLine, currentLineStartedMs, history }
}

function chooseRandom(lines: readonly VoiceLine[]): VoiceLine | null {
  if (lines.length === 0) return null
  const index = Math.floor(Math.random() * lines.length)
  return lines[index] ?? null
}

export function scheduleLineForAct(act: Act, mood: Mood, sessionMs: number): void {
  if (sessionMs - lastLineAtMs < MIN_GAP_MS) return
  const candidate = chooseRandom(eligibleLines(act, mood, shown))
  if (!candidate) return
  currentLine.value = candidate
  currentLineStartedMs.value = sessionMs
  lastLineAtMs = sessionMs
  shown.add(candidate.text)
  history.value = [...history.value, candidate.text]
}

let watchStop: (() => void) | null = null

export function startVoice(): void {
  if (watchStop) return
  const director = useDirector()
  watchStop = watch(
    () => director.state.value.act,
    () => {
      scheduleLineForAct(
        director.state.value.act,
        director.state.value.mood,
        director.state.value.sessionMs,
      )
    },
    { flush: 'sync' },
  )
}

export function stopVoice(): void {
  watchStop?.()
  watchStop = null
}

export function __resetVoiceForTests(): void {
  stopVoice()
  currentLine.value = null
  currentLineStartedMs.value = Number.NEGATIVE_INFINITY
  history.value = []
  shown.clear()
  lastLineAtMs = Number.NEGATIVE_INFINITY
}
