<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { OrthographicCamera, Scene as ThreeScene, WebGLRenderer } from 'three'
import { rawShallowNullable, assignRaw } from '@/scene/raw'
import { VoidLayer } from '@/scene/layers/VoidLayer'

const canvasEl = ref<HTMLCanvasElement | null>(null)

const renderer = rawShallowNullable<WebGLRenderer>()
const scene = rawShallowNullable<ThreeScene>()
const camera = rawShallowNullable<OrthographicCamera>()
const voidLayer = rawShallowNullable<VoidLayer>()

let rafId = 0
let lastFrameAt = 0

function resize(): void {
  if (!renderer.value) return
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}

function tick(now: number): void {
  rafId = requestAnimationFrame(tick)
  const dt = lastFrameAt === 0 ? 16 : now - lastFrameAt
  lastFrameAt = now
  if (!renderer.value || !scene.value || !camera.value) return
  voidLayer.value?.update(dt)
  renderer.value.render(scene.value, camera.value)
}

onMounted(() => {
  if (!canvasEl.value) return
  try {
    assignRaw(
      renderer,
      new WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true }),
    )
  } catch {
    // WebGL unavailable (jsdom, blocked context). The CSS off-white background
    // from reset.css is the graceful fallback — the piece still works.
    return
  }
  assignRaw(scene, new ThreeScene())
  // Fullscreen-quad camera: clip space, no projection needed.
  assignRaw(camera, new OrthographicCamera(-1, 1, 1, -1, 0, 1))
  assignRaw(voidLayer, new VoidLayer())
  if (voidLayer.value && scene.value) scene.value.add(voidLayer.value.mesh)
  resize()
  window.addEventListener('resize', resize)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
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
