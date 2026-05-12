export interface IntimateLine {
  text: string
  minVisits?: number
  minSessionMs?: number
  minStillnessMs?: number
}

export const intimateLines: readonly IntimateLine[] = [
  { text: "you've been here eight minutes.", minSessionMs: 8 * 60_000 },
  { text: 'oh, you came back.', minVisits: 2 },
]
