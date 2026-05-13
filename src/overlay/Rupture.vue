<script setup lang="ts">
import { computed } from 'vue'
import { useRupture } from '@/composables/useRupture'

const rupture = useRupture()
const isVisible = computed(() => rupture.state.value.phase !== 'idle')
</script>

<template>
  <div v-if="isVisible" class="rupture" :data-phase="rupture.state.value.phase" />
</template>

<style scoped>
.rupture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: var(--color-rupture-black);
  opacity: 0;
  z-index: var(--z-rupture);
}

.rupture[data-phase='black'] {
  opacity: 1;
}

.rupture[data-phase='bloom'] {
  background: radial-gradient(circle at 50% 50%, var(--color-rupture-bloom) 0%, transparent 70%);
  opacity: 0.85;
}
</style>
