import { ref, type Ref } from 'vue'

export interface PresenceApi {
  presenceCount: Ref<number>
  lifetimeCount: Ref<number>
  join: () => Promise<void>
  leave: () => Promise<void>
}

export function usePresence(): PresenceApi {
  const presenceCount = ref(1)
  const lifetimeCount = ref(0)
  return {
    presenceCount,
    lifetimeCount,
    join: () => Promise.reject(new Error('usePresence.join: not implemented')),
    leave: () => Promise.reject(new Error('usePresence.leave: not implemented')),
  }
}
