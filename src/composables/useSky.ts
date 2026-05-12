import { ref, type Ref } from 'vue'

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
  const palette = ref<SkyPalette>({
    base: '#f6f4ef',
    warm: '#f8e7d4',
    cool: '#e3e8ec',
    accent: '#c0a07a',
  })
  const sunAltitude = ref(0)
  return { palette, sunAltitude }
}
