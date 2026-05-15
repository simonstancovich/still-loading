import type { VoiceLine } from '@/lib/director-types'

export const voiceLines: readonly VoiceLine[] = [
  // ACT I — flirt (playful, tender — the voice is fond of the bar, apologises for it)
  {
    text: 'ah, there you are.',
    act: ['flirt'],
    mood: ['playful'],
    role: 'soften',
    opener: true,
  },
  { text: "don't look directly at it.", act: ['flirt'], mood: ['playful'], role: 'flirt' },
  { text: '...stop looking.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: 'hold on. almost.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: 'ah. no, it lied. sorry.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  { text: 'it does that.', act: ['flirt'], mood: ['playful'], role: 'tease' },
  {
    text: "don't take it personally. it's just shy.",
    act: ['flirt'],
    mood: ['playful'],
    role: 'soften',
  },
  { text: "it's shy.", act: ['flirt'], mood: ['playful'], role: 'flirt' },
  { text: "give it a second. or don't.", act: ['flirt'], mood: ['playful'], role: 'tease' },
  {
    text: "see? it doesn't like being watched.",
    act: ['flirt'],
    mood: ['playful'],
    role: 'tease',
  },
  {
    text: "okay it's definitely doing something now.",
    act: ['flirt'],
    mood: ['playful'],
    role: 'tease',
  },
  { text: '...that was a lie. sorry.', act: ['flirt'], mood: ['playful'], role: 'tease' },

  // ACT II — settle (honest)
  { text: "...you're still here?", act: ['settle'], mood: ['honest'], role: 'soften' },
  { text: "that's nice.", act: ['settle'], mood: ['honest'], role: 'soften' },
  { text: 'most people have left by now.', act: ['settle'], mood: ['honest'], role: 'soften' },
  { text: "i didn't expect company.", act: ['settle'], mood: ['honest'], role: 'soften' },
  {
    text: 'you can stay as long as you like.',
    act: ['settle'],
    mood: ['honest'],
    role: 'soften',
  },
  {
    text: 'there is nothing to wait for. you know that, right?',
    act: ['settle'],
    mood: ['honest'],
    role: 'soften',
  },
  { text: 'good. stay.', act: ['settle'], mood: ['honest'], role: 'soften' },

  // ACT III — cathedral (reverent)
  { text: "it's quieter in here.", act: ['cathedral'], mood: ['reverent'], role: 'hold' },
  { text: 'look how the light pools.', act: ['cathedral'], mood: ['reverent'], role: 'hold' },
  {
    text: 'the sky over stockholm is doing that thing.',
    act: ['cathedral'],
    mood: ['reverent'],
    role: 'hold',
  },
  {
    text: 'breathe with it, if you want.',
    act: ['cathedral'],
    mood: ['reverent'],
    role: 'hold',
  },
  {
    text: 'nothing is loading. nothing was ever loading.',
    act: ['cathedral'],
    mood: ['reverent'],
    role: 'hold',
  },
  {
    text: 'you are allowed to just be here.',
    act: ['cathedral'],
    mood: ['reverent'],
    role: 'hold',
  },

  // invite (tender)
  { text: 'can i ask you something?', act: ['invite'], mood: ['tender'], role: 'ask' },
  { text: "you don't have to answer.", act: ['invite'], mood: ['tender'], role: 'ask' },
  {
    text: 'it stays between us. it does not even stay with me.',
    act: ['invite'],
    mood: ['tender'],
    role: 'ask',
  },

  // held (held)
  { text: 'thank you for that.', act: ['held'], mood: ['held'], role: 'hold' },
  {
    text: "it's okay that you can't answer some of these.",
    act: ['held'],
    mood: ['held'],
    role: 'hold',
  },
  { text: 'you did the hard part already.', act: ['held'], mood: ['held'], role: 'hold' },
  { text: "i've got you. for a little longer.", act: ['held'], mood: ['held'], role: 'hold' },

  // secondCathedral (reverent)
  {
    text: 'almost. but not the way you thought.',
    act: ['secondCathedral'],
    mood: ['reverent'],
    role: 'hold',
  },
  {
    text: 'the bar is glowing now. from the inside.',
    act: ['secondCathedral'],
    mood: ['reverent'],
    role: 'hold',
  },

  // ending (reverent)
  {
    text: 'this is your time, made visible.',
    act: ['ending'],
    mood: ['reverent'],
    role: 'gift',
  },
  {
    text: 'you can save this, if you want to keep it.',
    act: ['ending'],
    mood: ['reverent'],
    role: 'gift',
  },

  // longTail (reverent)
  {
    text: 'there is nothing more to find. but you are welcome to stay.',
    act: ['longTail'],
    mood: ['reverent'],
    role: 'gift',
  },
  { text: 'you only see this once.', act: ['longTail'], mood: ['reverent'], role: 'gift' },
]
