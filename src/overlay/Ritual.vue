<script setup lang="ts">
import { computed, ref } from 'vue'
import { submitHate, useRitual } from '@/composables/useRitual'

const ritual = useRitual()
const input = ref('')

// Interim: hate prompt only. Full state-machine wiring lands in sub-plan 4 T7.
const isOpen = computed(() => ritual.state.value === 'askingHate')

function onSubmit(): void {
  const value = input.value
  input.value = ''
  if (ritual.state.value === 'askingHate') submitHate(value)
}
</script>

<template>
  <form v-if="isOpen" class="ritual" @submit.prevent="onSubmit">
    <input
      v-model="input"
      class="ritual-input"
      type="text"
      maxlength="120"
      autocomplete="off"
      spellcheck="false"
    />
  </form>
</template>

<style scoped>
.ritual {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: auto;
  z-index: var(--z-ritual);
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
