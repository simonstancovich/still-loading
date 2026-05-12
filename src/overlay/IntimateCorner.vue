<script setup lang="ts">
import { ref } from 'vue'

const line = ref<string | null>(null)
</script>

<template>
  <div v-if="line" class="intimate-corner">
    <span class="intimate-line">{{ line }}</span>
  </div>
</template>

<style scoped>
.intimate-corner {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  pointer-events: none;
  z-index: var(--z-overlay);
}

.intimate-line {
  font-family: var(--type-handwriting);
  font-size: var(--size-corner);
  color: var(--color-ink-faint);
}
</style>
