<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  // TODO: mount Three.js renderer + layers, start RAF loop
})

onBeforeUnmount(() => {
  // TODO: dispose Three.js resources, stop RAF loop
})
</script>

<template>
  <canvas ref="canvasEl" class="scene-canvas" />
</template>

<style scoped>
.scene-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  pointer-events: none;
}
</style>
