<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// DEV-ONLY debug scrubber. Mounted only when import.meta.env.DEV is true, so it
// is tree-shaken out of production builds. Intentionally outside the design-
// token system — this is scaffolding, removed before launch.
//
// Act buttons jump the director precisely into any act. The time slider
// advances time within an act and triggers pure-time transitions; stillness-
// gated and ritual-gated transitions are reached via the buttons.
// ─────────────────────────────────────────────────────────────────────────────
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  __setActForTests,
  createVirtualClock,
  injectDirector,
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

function togglePainting(): void {
  painting.isRevealed.value = !painting.isRevealed.value
}

const debugClock = createVirtualClock(0)
const seekBase = ref(0)
const sliderMs = ref(0)

onMounted(() => {
  stopDirector()
  startDirector(debugClock)
})

onBeforeUnmount(() => {
  stopDirector()
})

watch(sliderMs, (v) => {
  const now = seekBase.value + v
  recordMove(now) // keep stillness ~0 so only pure-time transitions fire while scrubbing
  debugClock.setNow(now)
})

function jumpToAct(act: Act): void {
  seekBase.value = debugClock.now()
  __setActForTests(act, debugClock)
  sliderMs.value = 0
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
      {{ state.paused ? 'paused' : 'running' }}
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
      <button class="debug-btn" type="button" @click="director.pause()">pause</button>
      <button class="debug-btn" type="button" @click="director.resume()">resume</button>
      <button class="debug-btn" type="button" @click="togglePainting">
        {{ painting.isRevealed.value ? 'hide painting' : 'show painting' }}
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
