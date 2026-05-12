import { ref, type Ref } from 'vue'
import type { DirectorApi } from '@/composables/useDirector'

export interface VoidParams {
  breathingPulse: number
  causticsIntensity: number
  causticsScale: number
  noiseSeed: number
}

export interface VoidApi {
  params: Ref<VoidParams>
}

export function useVoid(_director: DirectorApi): VoidApi {
  const params = ref<VoidParams>({
    breathingPulse: 0,
    causticsIntensity: 0,
    causticsScale: 1,
    noiseSeed: Math.random(),
  })
  return { params }
}
