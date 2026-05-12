import type { Act } from '@/lib/director-types'

export interface ActTransition {
  from: Act
  to: Act
  timeMs: number | null
  stillnessGate?: { op: 'AND' | 'OR'; ms: number }
}

export const actTransitions: readonly ActTransition[] = [
  { from: 'preflight', to: 'flirt', timeMs: 800 },
  { from: 'flirt', to: 'settle', timeMs: 90_000 },
  { from: 'settle', to: 'cathedral', timeMs: 180_000, stillnessGate: { op: 'OR', ms: 8_000 } },
  { from: 'cathedral', to: 'invite', timeMs: 390_000, stillnessGate: { op: 'AND', ms: 4_000 } },
  { from: 'invite', to: 'ritual', timeMs: null },
  { from: 'ritual', to: 'held', timeMs: null },
  { from: 'held', to: 'secondCathedral', timeMs: 600_000 },
  { from: 'secondCathedral', to: 'ending', timeMs: 690_000 },
  { from: 'ending', to: 'longTail', timeMs: 720_000 },
]

export interface BeatSheetEvent {
  atMs: number
  act: Act
  layer: string
  description: string
}

export const beatSheet: readonly BeatSheetEvent[] = []
