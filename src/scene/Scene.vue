<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Scene as ThreeScene, WebGLRenderer } from 'three'
import { rawShallowNullable, assignRaw } from '@/scene/raw'
import { VoidLayer } from '@/scene/layers/VoidLayer'

const canvasEl = ref<HTMLCanvasElement | null>(null)

const renderer = rawShallowNullable<WebGLRenderer>()
const scene = rawShallowNullable<ThreeScene>()
const voidLayer = rawShallowNullable<VoidLayer>()

let rafId = 0

function tick(_now: number): void {
  rafId = requestAnimationFrame(tick)
  if (!renderer.value || !scene.value) return
  // TODO: drive layer uniforms, render scene
}

onMounted(() => {
  if (!canvasEl.value) return
  assignRaw(renderer, new WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true }))
  assignRaw(scene, new ThreeScene())
  assignRaw(voidLayer, new VoidLayer())
  if (voidLayer.value && scene.value) {
    scene.value.add(voidLayer.value.mesh)
  }
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (voidLayer.value && renderer.value) voidLayer.value.dispose(renderer.value)
  renderer.value?.dispose()
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
  z-index: var(--z-scene);
}
</style>
