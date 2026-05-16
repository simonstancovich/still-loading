<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// DEV-ONLY debug scrubber. Mounted only when import.meta.env.DEV is true, so it
// is tree-shaken out of production builds. Intentionally outside the design-
// token system — this is scaffolding, removed before launch.
//
// By default the real clock keeps running so the piece plays normally. The
// scrubber TAKES OVER (switches the director onto a virtual clock) only when
// the user touches a scrubber control — the slider or an act/play/pause
// button. Press ▶ play to return control to the real clock.
// ─────────────────────────────────────────────────────────────────────────────
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  __setActForTests,
  createVirtualClock,
  injectDirector,
  realClock,
  startDirector,
  stopDirector,
} from '@/composables/useDirector'
import { recordMove } from '@/composables/useStillness'
import { useBar } from '@/composables/useBar'
import { useVoice } from '@/composables/useVoice'
import { useRitual } from '@/composables/useRitual'
import { usePainting } from '@/composables/usePainting'
import type { Act } from '@/lib/director-types'

const ACTS: readonly Act[] = [
  'preflight',
  'flirt',
  'settle',
  'cathedral',
  'invite',
  'ritual',
  'held',
  'secondCathedral',
  'ending',
  'longTail',
]

const MAX_MS = 720_000

const director = injectDirector()
const bar = useBar()
const voice = useVoice()
const ritual = useRitual()
const painting = usePainting()

const debugClock = createVirtualClock(0)
const isFrozen = ref(false)
const seekBase = ref(0)
const sliderMs = ref(0)

function freeze(): void {
  if (isFrozen.value) return
  const sessionAtFreeze = director.state.value.sessionMs
  stopDirector()
  // Mount the virtual clock at the current session time so the user picks
  // up where the real clock was, not at 0.
  debugClock.setNow(sessionAtFreeze)
  seekBase.value = 0
  sliderMs.value = sessionAtFreeze
  startDirector(debugClock)
  isFrozen.value = true
}

function play(): void {
  if (!isFrozen.value) return
  stopDirector()
  startDirector(realClock)
  isFrozen.value = false
}

onBeforeUnmount(() => {
  // Restore the real clock if the scrubber unmounts while frozen.
  if (isFrozen.value) {
    stopDirector()
    startDirector(realClock)
  }
})

watch(sliderMs, (v) => {
  // Slider movement → freeze if not already, then setNow to that value.
  if (!isFrozen.value) freeze()
  const now = seekBase.value + v
  recordMove(now) // keep stillness ~0 so only pure-time transitions fire while scrubbing
  debugClock.setNow(now)
})

function jumpToAct(act: Act): void {
  if (!isFrozen.value) freeze()
  seekBase.value = debugClock.now()
  __setActForTests(act, debugClock)
  sliderMs.value = 0
}

function togglePainting(): void {
  painting.isRevealed.value = !painting.isRevealed.value
}

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m)}:${String(s).padStart(2, '0')}`
}

const state = computed(() => director.state.value)
</script>

<template>
  <aside class="debug-scrubber">
    <div class="debug-row">
      <strong>{{ state.act }}</strong> · {{ state.mood }} · ritual: {{ ritual.state.value }}
    </div>
    <div class="debug-row">
      session {{ formatMs(state.sessionMs) }} · still {{ formatMs(state.stillnessMs) }} ·
      {{
        isFrozen
          ? 'scrubbing'
          : state.paused
            ? 'paused'
            : state.awaitingPresence
              ? 'awaiting'
              : 'live'
      }}
    </div>
    <div class="debug-row">
      bar {{ Math.round(bar.state.value.fillPercent) }}% ·
      pos {{ Math.round(bar.state.value.positionX) }},{{ Math.round(bar.state.value.positionY) }} ·
      {{ bar.state.value.mood }}
    </div>
    <div class="debug-row">voice: {{ voice.currentLine.value?.text ?? '—' }}</div>
    <input
      v-model.number="sliderMs"
      class="debug-slider"
      type="range"
      min="0"
      :max="MAX_MS"
      step="1000"
      aria-label="scrub session time"
    />
    <div class="debug-acts">
      <button
        v-for="act in ACTS"
        :key="act"
        class="debug-btn"
        type="button"
        @click="jumpToAct(act)"
      >
        {{ act }}
      </button>
    </div>
    <div class="debug-row">
      <button class="debug-btn" type="button" @click="play">▶ play</button>
      <button class="debug-btn" type="button" @click="director.pause()">pause</button>
      <button class="debug-btn" type="button" @click="director.resume()">resume</button>
      <button class="debug-btn" type="button" @click="togglePainting">
        {{ painting.isRevealed.value ? 'hide painting' : 'show painting' }}
      </button>
      <button class="debug-btn" type="button" @click="director.confirmPresence">
        confirm presence
      </button>
    </div>
  </aside>
</template>

<style scoped>
.debug-scrubber {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.82);
  color: #e8e8e8;
  font-family: var(--type-mono);
  font-size: 11px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 380px;
  pointer-events: auto;
}

.debug-row {
  line-height: 1.4;
}

.debug-slider {
  width: 100%;
}

.debug-acts {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.debug-btn {
  font-family: var(--type-mono);
  font-size: 10px;
  background: #222;
  color: #ddd;
  border: 1px solid #444;
  padding: 2px 5px;
  cursor: pointer;
}

.debug-btn:hover {
  background: #333;
}
</style>
