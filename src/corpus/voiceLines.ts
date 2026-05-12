import type { VoiceLine } from '@/lib/director-types'

export const voiceLines: readonly VoiceLine[] = [
  { text: "don't look directly at it.", act: ['flirt'], mood: ['playful'], role: 'flirt' },
  { text: '...stop looking.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: 'hold on. almost.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: 'haha. false alarm.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: "...you're still here?", act: ['settle'], mood: ['honest'], role: 'soften' },
  { text: "that's nice.", act: ['settle'], mood: ['honest'], role: 'soften' },
  { text: 'can I ask you something?', act: ['invite'], mood: ['tender'], role: 'ask' },
]
