import { ref, type Ref } from 'vue'
import { tokens } from '@/styles/tokens'

export interface SkyPalette {
  base: string
  warm: string
  cool: string
  accent: string
}

export interface SkyApi {
  palette: Ref<SkyPalette>
  sunAltitude: Ref<number>
}

export function useSky(): SkyApi {
  const palette = ref<SkyPalette>({ ...tokens.palette.preflight })
  const sunAltitude = ref(0)
  return { palette, sunAltitude }
}
