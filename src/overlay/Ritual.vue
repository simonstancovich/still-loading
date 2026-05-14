<script setup lang="ts">
import { computed, ref } from 'vue'
import { submitHate, submitLove, useRitual } from '@/composables/useRitual'

const ritual = useRitual()
const input = ref('')

// Fixed ritual prompts — deliberately not pulled from the voice corpus.
const PROMPTS: Record<string, string> = {
  askingHate: 'what do you hate about yourself?',
  askingLove: 'what do you love about yourself?',
}

const prompt = computed(() => PROMPTS[ritual.state.value] ?? '')

const isOpen = computed(() => prompt.value.length > 0)

function onSubmit(): void {
  const value = input.value
  input.value = ''
  if (ritual.state.value === 'askingHate') {
    // The hate text is passed straight to the state machine and discarded.
    // It is never persisted and never sent anywhere.
    submitHate(value)
  } else if (ritual.state.value === 'askingLove') {
    submitLove(value)
  }
}
</script>

<template>
  <form v-if="isOpen" class="ritual" @submit.prevent="onSubmit">
    <p class="ritual-prompt">{{ prompt }}</p>
    <input
      v-model="input"
      class="ritual-input"
      type="text"
      maxlength="120"
      autocomplete="off"
      spellcheck="false"
      aria-label="your answer"
    />
  </form>
</template>

<style scoped>
.ritual {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  pointer-events: auto;
  z-index: var(--z-ritual);
}

.ritual-prompt {
  font-family: var(--type-handwriting);
  font-size: var(--size-voice);
  color: var(--color-ink-base);
  margin: 0;
}

.ritual-input {
  font-family: var(--type-handwriting);
  font-size: var(--size-voice);
  border: none;
  border-bottom: 1px solid var(--color-ink-faint);
  background: transparent;
  color: var(--color-ink-base);
  outline: none;
  width: min(60ch, 80vw);
  text-align: center;
}
</style>
