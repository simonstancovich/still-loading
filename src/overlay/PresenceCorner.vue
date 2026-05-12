<script setup lang="ts">
import type { PresenceApi } from '@/composables/usePresence'

defineProps<{ presence: PresenceApi }>()
</script>

<template>
  <div class="presence-corner">
    <span class="presence-line">{{ presence.presenceCount.value }} here</span>
    <span class="presence-line presence-faint">{{ presence.lifetimeCount.value }} ever</span>
  </div>
</template>

<style scoped>
.presence-corner {
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.presence-line {
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: var(--token-ink-faint, #00000055);
}

.presence-faint {
  color: var(--token-ink-fainter, #00000033);
}
</style>
