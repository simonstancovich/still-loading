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

export interface DirectorState {
  act: Act
  mood: Mood
  sessionMs: number
  paused: boolean
  awaitingPresence: boolean
}
