<script setup lang="ts">
import { computed } from 'vue'
import { BAR_ENTRANCE_MS, pulseAt, useBar } from '@/composables/useBar'
import { injectDirector } from '@/composables/useDirector'

const bar = useBar()
const director = injectDirector()

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

const pulse = computed(() => pulseAt(director.state.value.sessionMs))

const pulseStyle = computed(() => ({
  transform: `scale(${String(pulse.value.scale)})`,
  opacity: String(pulse.value.alpha),
}))

// Staged entry: the bar is invisible while the page is awaiting presence
// (the "are you here?" prompt is up). The instant the user clicks, the
// bar begins its slow CSS-driven fade-in. BAR_ENTRANCE_MS adds an optional
// post-confirm delay (currently 0 — bar morphs in as the prompt morphs out).
const isVisible = computed(
  () =>
    !director.state.value.awaitingPresence &&
    director.state.value.sessionMs >= BAR_ENTRANCE_MS,
)
</script>

<template>
  <div
    class="bar"
    :class="{ 'bar-visible': isVisible }"
    :style="trackStyle"
    :data-mood="bar.state.value.mood"
  >
    <div class="bar-pulse" :style="pulseStyle" />
    <div class="bar-track">
      <div class="bar-fill" :class="{ 'bar-fill-glowing': isGlowing }" :style="fillStyle" />
    </div>
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  height: var(--size-barHeight);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: var(--z-overlay);
  opacity: 0;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-organic),
    left var(--motion-duration-slow) var(--motion-ease-organic),
    top var(--motion-duration-slow) var(--motion-ease-organic),
    width var(--motion-duration-med) var(--motion-ease-organic);
}

.bar.bar-visible {
  opacity: 1;
}

/* The bar's entrance: the track gets drawn left-to-right like a loading
   bar filling itself — matching the piece's central metaphor. The clip
   reveals more visual punch than a center-out scale on a thin line. */
.bar-track {
  position: absolute;
  inset: 0;
  background: var(--color-bar-track);
  border-radius: calc(var(--size-barHeight) / 2);
  overflow: hidden;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--motion-duration-med) cubic-bezier(0.65, 0, 0.35, 1);
}

.bar.bar-visible .bar-track {
  clip-path: inset(0 0 0 0);
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

.bar-pulse {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--color-glow-warm) 80%, transparent) 0%,
    transparent 60%
  );
  pointer-events: none;
  transform-origin: center;
  filter: blur(8px);
}
</style>
