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
  right: 1.5rem;
  bottom: 1.5rem;
  pointer-events: none;
}

.intimate-line {
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: var(--token-ink-faint, #00000055);
}
</style>
