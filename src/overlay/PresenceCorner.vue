<script setup lang="ts">
import { usePresence } from '@/composables/usePresence'

const presence = usePresence()
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
  left: var(--space-4);
  bottom: var(--space-4);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  z-index: var(--z-overlay);
}

.presence-line {
  font-family: var(--type-handwriting);
  font-size: var(--size-corner);
  color: var(--color-ink-faint);
}

.presence-faint {
  color: var(--color-ink-fainter);
}
</style>
