import { ref, type Ref } from 'vue'

export interface StillnessApi {
  stillnessMs: Ref<number>
  lastMoveAt: Ref<number>
}

export function useStillness(): StillnessApi {
  const stillnessMs = ref(0)
  const lastMoveAt = ref(0)
  return { stillnessMs, lastMoveAt }
}
