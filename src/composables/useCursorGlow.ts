import { ref, type Ref } from 'vue'

export interface CursorGlowState {
  x: number
  y: number
  intensity: number
  warmth: number
}

export interface CursorGlowApi {
  glow: Ref<CursorGlowState>
}

export function useCursorGlow(): CursorGlowApi {
  const glow = ref<CursorGlowState>({ x: 0, y: 0, intensity: 0, warmth: 0.5 })
  return { glow }
}
