<script setup lang="ts">
import { computed } from 'vue'
import type { RuptureApi } from '@/composables/useRupture'

const props = defineProps<{ rupture: RuptureApi }>()

const isVisible = computed(() => props.rupture.state.value.phase !== 'idle')
</script>

<template>
  <div v-if="isVisible" class="rupture" :data-phase="rupture.state.value.phase" />
</template>

<style scoped>
.rupture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: #000;
  opacity: 0;
}

.rupture[data-phase='black'] {
  opacity: 1;
}

.rupture[data-phase='bloom'] {
  background: radial-gradient(circle at 50% 50%, #fff8e7 0%, transparent 70%);
  opacity: 0.85;
}
</style>
