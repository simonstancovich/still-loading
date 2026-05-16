<script setup lang="ts">
import { computed } from 'vue'
import { BAR_ENTRANCE_MS, pulseAt, useBar } from '@/composables/useBar'
import { injectDirector } from '@/composables/useDirector'
import { cursorX, cursorY } from '@/composables/useStillness'

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

// The looking-back eye — a directional bright spot on the bar that orients
// toward the cursor. Reads cursor position directly; does not mutate bar state.
const EYE_FALLOFF_PX = 400

const barCenterPx = computed(() => {
  const vw = typeof window === 'undefined' ? 1 : window.innerWidth
  const vh = typeof window === 'undefined' ? 1 : window.innerHeight
  return {
    x: (bar.state.value.positionX / 100) * vw,
    y: (bar.state.value.positionY / 100) * vh,
  }
})

const eyeOffsetPx = computed(() => {
  const left = barCenterPx.value.x - bar.state.value.widthPx / 2
  return Math.max(0, Math.min(bar.state.value.widthPx, cursorX.value - left))
})

const eyeIntensity = computed(() => {
  const dx = cursorX.value - barCenterPx.value.x
  const dy = cursorY.value - barCenterPx.value.y
  const d = Math.hypot(dx, dy)
  return Math.max(0, Math.min(1, 1 - d / EYE_FALLOFF_PX))
})

const eyeStyle = computed(() => ({
  left: `${String(eyeOffsetPx.value)}px`,
  opacity: String(eyeIntensity.value),
}))

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
    <div class="bar-eye" :style="eyeStyle" />
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
    opacity var(--motion-duration-med) var(--motion-ease-organic),
    left var(--motion-duration-slow) var(--motion-ease-organic),
    top var(--motion-duration-slow) var(--motion-ease-organic),
    width var(--motion-duration-med) var(--motion-ease-organic);
}

.bar.bar-visible {
  opacity: 1;
}

/* The bar's entrance: the track draws outward from the center as a line
   being inked. Combined with the .bar's opacity fade, the gesture reads
   as deliberate — not a slow fade-in. */
.bar-track {
  position: absolute;
  inset: 0;
  background: var(--color-bar-track);
  border-radius: calc(var(--size-barHeight) / 2);
  overflow: hidden;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--motion-duration-med) var(--motion-ease-organic);
}

.bar.bar-visible .bar-track {
  transform: scaleX(1);
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

/* The eye opens via a vertical scale-in once the bar is present —
   reads as an eyelid lifting, not just a fade. The slight overshoot
   ease lands with a felt blink. Cursor proximity still drives opacity. */
.bar-eye {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--color-ink-base);
  box-shadow:
    0 0 8px 2px color-mix(in srgb, var(--color-glow-warm) 60%, transparent),
    0 0 22px 7px color-mix(in srgb, var(--color-glow-warm) 28%, transparent);
  pointer-events: none;
  transform: scaleY(0);
  transform-origin: center;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-organic),
    transform var(--motion-duration-med) cubic-bezier(0.34, 1.45, 0.64, 1);
}

.bar.bar-visible .bar-eye {
  transform: scaleY(1);
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
