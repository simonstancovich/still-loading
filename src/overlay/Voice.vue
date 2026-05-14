<script setup lang="ts">
import { computed } from 'vue'
import { injectDirector } from '@/composables/useDirector'
import { useVoice } from '@/composables/useVoice'
import { charStates } from '@/composables/useHandwriting'

const director = injectDirector()
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
</script>

<template>
  <div class="voice" aria-live="polite">
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
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: var(--z-voice);
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
