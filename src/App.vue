<script setup lang="ts">
import Scene from '@/scene/Scene.vue'
import Voice from '@/overlay/Voice.vue'
import Ritual from '@/overlay/Ritual.vue'
import IntimateCorner from '@/overlay/IntimateCorner.vue'
import PresenceCorner from '@/overlay/PresenceCorner.vue'
import Rupture from '@/overlay/Rupture.vue'
import { useDirector } from '@/composables/useDirector'
import { useVoice } from '@/composables/useVoice'
import { useRitual } from '@/composables/useRitual'
import { usePresence } from '@/composables/usePresence'
import { useRupture } from '@/composables/useRupture'

const director = useDirector()
const voice = useVoice(director)
const ritual = useRitual(director)
const presence = usePresence()
const rupture = useRupture(director)
</script>

<template>
  <Scene />
  <Voice :voice="voice" />
  <Ritual v-if="ritual.state.value !== 'idle' && ritual.state.value !== 'resolved'" :ritual="ritual" />
  <IntimateCorner />
  <PresenceCorner :presence="presence" />
  <Rupture :rupture="rupture" />
</template>
