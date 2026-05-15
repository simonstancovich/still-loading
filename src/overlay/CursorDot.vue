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
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: var(--color-ink-base);
  pointer-events: none;
  z-index: var(--z-overlay);
  will-change: transform;
  box-shadow:
    0 0 16px 4px color-mix(in srgb, var(--color-glow-warm) 45%, transparent),
    0 0 36px 10px color-mix(in srgb, var(--color-glow-warm) 20%, transparent);
}
</style>
