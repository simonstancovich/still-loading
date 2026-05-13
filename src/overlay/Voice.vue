<script setup lang="ts">
import { computed } from 'vue'
import { useVoice } from '@/composables/useVoice'

const voice = useVoice()
const text = computed(() => voice.currentLine.value?.text ?? '')
</script>

<template>
  <div class="voice" aria-live="polite">
    <span class="voice-line">{{ text }}</span>
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
}
</style>
