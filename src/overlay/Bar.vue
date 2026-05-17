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

// Eye anatomy & gaze tracking. The eye stays centered on the bar; the iris
// (and pupil + glint) shifts inside the white toward the cursor with
// eye-physics: directional, saturating, and constrained to the iris's
// physical room inside the white. The eye fades in proximally — full
// presence when the cursor is near, soft retreat when it's far away.
const EYE_FALLOFF_PX = 400
const IRIS_REACH_PX = 90
const IRIS_MAX_X = 5
const IRIS_MAX_Y = 2.2

const barCenterPx = computed(() => {
  const vw = typeof window === 'undefined' ? 1 : window.innerWidth
  const vh = typeof window === 'undefined' ? 1 : window.innerHeight
  return {
    x: (bar.state.value.positionX / 100) * vw,
    y: (bar.state.value.positionY / 100) * vh,
  }
})

const eyeIntensity = computed(() => {
  const dx = cursorX.value - barCenterPx.value.x
  const dy = cursorY.value - barCenterPx.value.y
  const d = Math.hypot(dx, dy)
  return Math.max(0, Math.min(1, 1 - d / EYE_FALLOFF_PX))
})

const irisOffset = computed(() => {
  const dx = cursorX.value - barCenterPx.value.x
  const dy = cursorY.value - barCenterPx.value.y
  const d = Math.hypot(dx, dy)
  if (d < 1) return { x: 0, y: 0 }
  const factor = Math.min(1, d / IRIS_REACH_PX)
  return {
    x: (dx / d) * factor * IRIS_MAX_X,
    y: (dy / d) * factor * IRIS_MAX_Y,
  }
})

const irisCx = computed(() => 12 + irisOffset.value.x)
const irisCy = computed(() => 8 + irisOffset.value.y)
const glintCx = computed(() => irisCx.value + 1.3)
const glintCy = computed(() => irisCy.value - 1.3)

const eyeStyle = computed(() => ({
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
    <div class="bar-eye" :style="eyeStyle">
      <svg class="bar-eye-svg" viewBox="0 0 24 16" aria-hidden="true">
        <ellipse class="bar-eye-white" cx="12" cy="8" rx="11" ry="6.5" />
        <circle class="bar-eye-iris" :cx="irisCx" :cy="irisCy" r="3.6" />
        <circle class="bar-eye-pupil" :cx="irisCx" :cy="irisCy" r="1.5" />
        <circle class="bar-eye-glint" :cx="glintCx" :cy="glintCy" r="0.7" />
      </svg>
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

/* The eye: a proper SVG eye centered on the bar. The outer .bar-eye owns
   the entrance (eyelid lifting), while the inner .bar-eye-svg breathes and
   blinks on independent timers. The iris (with pupil + glint) shifts within
   the white toward the cursor via reactive cx/cy bindings — eye-physics, not
   1:1 — so the eye reads as a being looking at you, not a cursor follower. */
.bar-eye {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -12px;
  width: 24px;
  height: 16px;
  pointer-events: none;
  transform: scaleY(0);
  transform-origin: center;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-organic),
    transform var(--motion-duration-med) cubic-bezier(0.34, 1.45, 0.64, 1) 400ms;
}

.bar.bar-visible .bar-eye {
  transform: scaleY(1);
}

.bar-eye-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  transform-origin: center;
  filter:
    drop-shadow(0 0 5px color-mix(in srgb, var(--color-glow-warm) 55%, transparent))
    drop-shadow(0 0 14px color-mix(in srgb, var(--color-glow-warm) 22%, transparent));
  scale: 1;
  animation:
    bar-eye-breath 5200ms ease-in-out infinite,
    bar-eye-blink 6400ms steps(1, end) infinite;
}

/* `scale` is independent from `transform` — letting breath and blink layer
   without fighting each other. */
@keyframes bar-eye-breath {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 1.035;
  }
}

@keyframes bar-eye-blink {
  0%,
  93%,
  100% {
    transform: scaleY(1);
  }
  95%,
  97% {
    transform: scaleY(0.06);
  }
}

.bar-eye-white {
  fill: color-mix(in srgb, var(--color-glow-warm) 78%, var(--color-dust-base) 22%);
  stroke: var(--color-ink-fainter);
  stroke-width: 0.6;
}

.bar-eye-iris {
  fill: var(--color-ink-base);
  transition:
    cx var(--motion-duration-fast) var(--motion-ease-organic),
    cy var(--motion-duration-fast) var(--motion-ease-organic);
}

.bar-eye-pupil {
  fill: #000;
  transition:
    cx var(--motion-duration-fast) var(--motion-ease-organic),
    cy var(--motion-duration-fast) var(--motion-ease-organic);
}

.bar-eye-glint {
  fill: rgba(255, 255, 255, 0.85);
  transition:
    cx var(--motion-duration-fast) var(--motion-ease-organic),
    cy var(--motion-duration-fast) var(--motion-ease-organic);
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
