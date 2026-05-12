import { ref, type Ref } from 'vue'

export interface ConstellationPoint {
  id: string
  word: string
  x: number
  y: number
  alpha: number
  revealedUntil: number | null
}

export interface ConstellationsApi {
  points: Ref<readonly ConstellationPoint[]>
  fetchPoints: (limit: number) => Promise<void>
}

export function useConstellations(): ConstellationsApi {
  const points = ref<readonly ConstellationPoint[]>([])
  return {
    points,
    fetchPoints: () => {
      throw new Error('useConstellations.fetchPoints: not implemented')
    },
  }
}
