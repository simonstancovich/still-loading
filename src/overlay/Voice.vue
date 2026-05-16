<script setup lang="ts">
import { computed } from 'vue'
import { injectDirector } from '@/composables/useDirector'
import { useBar } from '@/composables/useBar'
import { useVoice } from '@/composables/useVoice'
import { charStates } from '@/composables/useHandwriting'

// The voice sits this many pixels above the bar's vertical center, so the
// line of handwriting hovers as a caption rather than crossing the bar.
const VOICE_ABOVE_BAR_PX = 36

const director = injectDirector()
const bar = useBar()
const voice = useVoice()

const elapsedMs = computed(() => {
  if (voice.currentLine.value === null) return 0
  return director.state.value.sessionMs - voice.currentLineStartedMs.value
})

const chars = computed(() => {
  const line = voice.currentLine.value
  if (line === null) return []
  return charStates(line.text, elapsedMs.value)
})

// Follow the bar's vertical position so the voice stays a fixed gap above
// it as the bar migrates from 50% (phase 1) to 33% (cathedral onward).
const voiceStyle = computed(() => ({
  top: `calc(${String(bar.state.value.positionY)}% - ${String(VOICE_ABOVE_BAR_PX)}px)`,
}))
</script>

<template>
  <div class="voice" :style="voiceStyle" aria-live="polite">
    <span v-if="voice.currentLine.value" class="voice-line">
      <span
        v-for="(state, index) in chars"
        :key="index"
        class="voice-char"
        :style="{ opacity: String(state.opacity) }"
        >{{ state.char }}</span
      >
    </span>
  </div>
</template>

<style scoped>
.voice {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -100%);
  pointer-events: none;
  z-index: var(--z-voice);
  transition: top var(--motion-duration-slow) var(--motion-ease-organic);
}

.voice-line {
  font-family: var(--type-handwriting);
  font-size: var(--size-voice);
  line-height: 1;
  color: var(--color-ink-base);
  white-space: pre;
}

.voice-char {
  display: inline;
}
</style>
