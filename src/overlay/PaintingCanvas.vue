<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  attachPaintingCanvas,
  detachPaintingCanvas,
  usePainting,
} from '@/composables/usePainting'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const painting = usePainting()

const opacity = computed(() => (painting.isRevealed.value ? 1 : 0.06))

onMounted(() => {
  if (canvasEl.value) attachPaintingCanvas(canvasEl.value)
})

onBeforeUnmount(() => {
  detachPaintingCanvas()
})
</script>

<template>
  <canvas ref="canvasEl" class="painting-canvas" :style="{ opacity }" />
</template>

<style scoped>
.painting-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: var(--z-painting);
  transition: opacity var(--motion-duration-slow) var(--motion-ease-organic);
}
</style>
