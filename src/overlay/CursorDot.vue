<script setup lang="ts">
import { computed } from 'vue'
import { cursorX, cursorY } from '@/composables/useStillness'

const transform = computed(
  () => `translate(${String(cursorX.value)}px, ${String(cursorY.value)}px)`,
)
</script>

<template>
  <div class="cursor-dot" :style="{ transform }" />
</template>

<style scoped>
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--color-ink-base);
  pointer-events: none;
  z-index: var(--z-overlay);
  will-change: transform;
}
</style>
