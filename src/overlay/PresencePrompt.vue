<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { injectDirector } from '@/composables/useDirector'
import { charStates } from '@/composables/useHandwriting'

const PROMPT_TEXT = 'are you here?'
// The page sits in silence for this long before the prompt begins writing
// itself — gives the user a moment to land on the page and notice the
// cursor halo and faint painting strokes.
const APPEAR_DELAY_MS = 1_500

const director = injectDirector()

const mountedAt = ref(performance.now())
const localElapsed = ref(0)
let rafHandle = 0

const tick = (): void => {
  localElapsed.value = performance.now() - mountedAt.value
  rafHandle = requestAnimationFrame(tick)
}

onMounted(() => {
  rafHandle = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafHandle)
})

const writeElapsedMs = computed(() => Math.max(0, localElapsed.value - APPEAR_DELAY_MS))

const chars = computed(() => charStates(PROMPT_TEXT, writeElapsedMs.value))

const isAwaiting = computed(() => director.state.value.awaitingPresence)
</script>

<template>
  <div class="presence-prompt" :class="{ 'presence-prompt-dismissed': !isAwaiting }">
    <span class="presence-prompt-line">
      <span
        v-for="(state, index) in chars"
        :key="index"
        class="presence-prompt-char"
        :style="{ opacity: String(state.opacity) }"
        >{{ state.char }}</span
      >
    </span>
  </div>
</template>

<style scoped>
.presence-prompt {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: var(--z-voice);
  opacity: 1;
  transition: opacity var(--motion-duration-med) var(--motion-ease-organic);
}

.presence-prompt.presence-prompt-dismissed {
  opacity: 0;
}

.presence-prompt-line {
  font-family: var(--type-handwriting);
  font-size: var(--size-voice);
  line-height: 1;
  color: var(--color-ink-base);
  white-space: pre;
}

.presence-prompt-char {
  display: inline;
}
</style>
