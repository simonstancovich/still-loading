import type { PerformanceTier } from '@/lib/director-types'

export interface PerformanceProfile {
  tier: PerformanceTier
  maxDustParticles: number
  causticsResolution: 'full' | 'half' | 'off'
  bloomEnabled: boolean
  chromaticAberrationEnabled: boolean
  targetFps: number
}

export const performanceProfiles: Readonly<Record<PerformanceTier, PerformanceProfile>> = {
  low: {
    tier: 'low',
    maxDustParticles: 40,
    causticsResolution: 'off',
    bloomEnabled: false,
    chromaticAberrationEnabled: false,
    targetFps: 30,
  },
  mid: {
    tier: 'mid',
    maxDustParticles: 60,
    causticsResolution: 'half',
    bloomEnabled: true,
    chromaticAberrationEnabled: false,
    targetFps: 60,
  },
  high: {
    tier: 'high',
    maxDustParticles: 90,
    causticsResolution: 'full',
    bloomEnabled: true,
    chromaticAberrationEnabled: true,
    targetFps: 60,
  },
}

export function detectPerformanceTier(): PerformanceTier {
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4
  const cores = navigator.hardwareConcurrency || 4
  if (memory >= 8 && cores >= 8) return 'high'
  if (memory >= 4 && cores >= 4) return 'mid'
  return 'low'
}
