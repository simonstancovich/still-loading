<script setup lang="ts">
import { computed } from 'vue'
import { useBar } from '@/composables/useBar'

const bar = useBar()

const trackStyle = computed(() => ({
  left: `${String(bar.state.value.positionX)}%`,
  top: `${String(bar.state.value.positionY)}%`,
  width: `${String(bar.state.value.widthPx)}px`,
}))

const fillScale = computed(() => Math.max(0, Math.min(1, bar.state.value.fillPercent / 100)))

const fillStyle = computed(() => ({
  transform: `scaleX(${String(fillScale.value)})`,
}))

const isGlowing = computed(() => bar.state.value.glowing)
</script>

<template>
  <div class="bar" :style="trackStyle" :data-mood="bar.state.value.mood">
    <div class="bar-fill" :class="{ 'bar-fill-glowing': isGlowing }" :style="fillStyle" />
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  height: var(--size-barHeight);
  transform: translate(-50%, -50%);
  background: var(--color-bar-track);
  border-radius: calc(var(--size-barHeight) / 2);
  pointer-events: none;
  z-index: var(--z-overlay);
  overflow: hidden;
  transition:
    left var(--motion-duration-slow) var(--motion-ease-organic),
    top var(--motion-duration-slow) var(--motion-ease-organic),
    width var(--motion-duration-med) var(--motion-ease-organic);
}

.bar-fill {
  width: 100%;
  height: 100%;
  background: var(--color-bar-dim);
  transform-origin: left center;
  transition:
    transform var(--motion-duration-med) var(--motion-ease-organic),
    background var(--motion-duration-slow) var(--motion-ease-organic);
}

.bar-fill-glowing {
  background: var(--color-bar-bright);
  box-shadow: 0 0 12px var(--color-glow-warm);
}
</style>
