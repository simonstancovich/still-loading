<script setup lang="ts">
import { ref } from 'vue'
import type { RitualApi } from '@/composables/useRitual'

const props = defineProps<{ ritual: RitualApi }>()

const input = ref('')

function submit(): void {
  const value = input.value.trim()
  if (value.length === 0) return
  if (props.ritual.state.value === 'askingHate' || props.ritual.state.value === 'receivingHate') {
    props.ritual.submitHate(value)
  } else {
    props.ritual.submitLove(value)
  }
  input.value = ''
}
</script>

<template>
  <form class="ritual" @submit.prevent="submit">
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
