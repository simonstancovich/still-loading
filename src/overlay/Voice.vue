<script setup lang="ts">
import { computed } from 'vue'
import type { VoiceApi } from '@/composables/useVoice'

const props = defineProps<{ voice: VoiceApi }>()

const text = computed(() => props.voice.currentLine.value?.text ?? '')
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
}

.voice-line {
  font-family: 'Caveat', cursive;
  font-size: 2rem;
  line-height: 1;
  color: var(--token-ink, #2a2a28);
}
</style>
