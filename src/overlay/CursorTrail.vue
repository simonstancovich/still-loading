<script setup lang="ts">
import { ref, watch } from 'vue'
import { cursorX, cursorY } from '@/composables/useStillness'

const TRAIL_MS = 600
const MAX_POINTS = 24

interface TrailPoint {
  x: number
  y: number
  t: number
}

const points = ref<readonly TrailPoint[]>([])

watch([cursorX, cursorY], ([x, y]) => {
  const now = performance.now()
  const fresh = points.value.filter((p) => now - p.t < TRAIL_MS)
  points.value = [...fresh, { x, y, t: now }].slice(-MAX_POINTS)
})
</script>

<template>
  <div class="cursor-trail">
    <span
      v-for="p in points"
      :key="p.t"
      class="trail-point"
      :style="{ transform: `translate(${String(p.x)}px, ${String(p.y)}px)` }"
    />
  </div>
</template>

<style scoped>
.cursor-trail {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-overlay);
}

.trail-point {
  position: absolute;
  top: 0;
  left: 0;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-glow-warm) 70%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  will-change: opacity, transform;
  animation: trail-fade 600ms forwards;
}

@keyframes trail-fade {
  0% {
    opacity: 0.55;
  }
  100% {
    opacity: 0;
  }
}
</style>
