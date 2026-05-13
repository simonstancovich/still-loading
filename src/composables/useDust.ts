import { ref, type Ref } from 'vue'
import { injectDirector } from '@/composables/useDirector'

export type DustKind = 'pollen' | 'gold' | 'ash' | 'motes'
export type DustPersonality = 'curious' | 'shy' | 'indifferent'

export interface DustParticle {
  id: number
  kind: DustKind
  personality: DustPersonality
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export interface DustApi {
  particles: Ref<readonly DustParticle[]>
  targetCount: Ref<number>
}

export function useDust(): DustApi {
  const _director = injectDirector()
  const particles = ref<readonly DustParticle[]>([])
  const targetCount = ref(0)
  return { particles, targetCount }
}
