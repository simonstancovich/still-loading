<script setup lang="ts">
import Scene from '@/scene/Scene.vue'
import PaintingCanvas from '@/overlay/PaintingCanvas.vue'
import Bar from '@/overlay/Bar.vue'
import Voice from '@/overlay/Voice.vue'
import PresencePrompt from '@/overlay/PresencePrompt.vue'
import Ritual from '@/overlay/Ritual.vue'
import IntimateCorner from '@/overlay/IntimateCorner.vue'
import PresenceCorner from '@/overlay/PresenceCorner.vue'
import Rupture from '@/overlay/Rupture.vue'
import CursorDot from '@/overlay/CursorDot.vue'
import CursorTrail from '@/overlay/CursorTrail.vue'
import DebugScrubber from '@/overlay/DebugScrubber.vue'

const isDebug = import.meta.env.DEV
</script>

<template>
  <Scene />
  <PaintingCanvas />
  <Bar />
  <PresencePrompt />
  <Voice />
  <Ritual />
  <IntimateCorner />
  <PresenceCorner />
  <Rupture />
  <CursorTrail />
  <CursorDot />
  <DebugScrubber v-if="isDebug" />
</template>
