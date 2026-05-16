export type Act =
  | 'preflight'
  | 'flirt'
  | 'settle'
  | 'cathedral'
  | 'invite'
  | 'ritual'
  | 'held'
  | 'secondCathedral'
  | 'ending'
  | 'longTail'

export type Mood = 'playful' | 'wry' | 'honest' | 'tender' | 'held' | 'reverent'

export type RitualState =
  | 'idle'
  | 'askingHate'
  | 'receivingHate'
  | 'multiplyingHate'
  | 'askingLove'
  | 'receivingLove'
  | 'erasing'
  | 'nothingBranch'
  | 'gifted'
  | 'resolved'

export type VisitorTier = 'first' | 'returning' | 'unfinished' | 'patient'

export type PerformanceTier = 'low' | 'mid' | 'high'

export interface DirectorState {
  act: Act
  mood: Mood
  ritual: RitualState
  sessionMs: number
  stillnessMs: number
  visitorTier: VisitorTier
  presenceCount: number
  lifetimeCount: number
  paused: boolean
  // True from page load until the user confirms presence (clicks, taps, or
  // presses any key). While true, sessionMs does not advance and no act
  // transitions occur. The "are you here?" prompt is visible during this time.
  awaitingPresence: boolean
}

export interface VoiceLine {
  text: string
  act: readonly Act[]
  mood: readonly Mood[]
  role: 'flirt' | 'tease' | 'soften' | 'ask' | 'hold' | 'gift'
  minStillnessMs?: number
  oncePerSession?: boolean
  // When true, this line is preferred as the first line scheduled for its
  // (act, mood) pair. Once shown, the rest of the corpus becomes eligible.
  opener?: boolean
}

export type DirectorEvent =
  | { type: 'act-change'; from: Act; to: Act; at: number }
  | { type: 'ritual-change'; from: RitualState; to: RitualState; at: number }
  | { type: 'safety-flag'; at: number }
  | { type: 'cursor-move'; x: number; y: number; at: number }
  | { type: 'ritual-submit'; kind: 'hate' | 'love'; at: number }
