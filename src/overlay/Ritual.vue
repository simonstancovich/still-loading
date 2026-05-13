<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRitual } from '@/composables/useRitual'

const ritual = useRitual()
const input = ref('')

const isOpen = computed(() => ritual.state.value !== 'idle' && ritual.state.value !== 'resolved')

function submit(): void {
  const value = input.value.trim()
  if (value.length === 0) return
  if (ritual.state.value === 'askingHate' || ritual.state.value === 'receivingHate') {
    ritual.submitHate(value)
  } else {
    ritual.submitLove(value)
  }
  input.value = ''
}
</script>

<template>
  <form v-if="isOpen" class="ritual" @submit.prevent="submit">
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
