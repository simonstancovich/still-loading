import { ref, type Ref } from 'vue'

export interface VisitRecord {
  startedAt: number
  durationMs: number
  reachedRitual: boolean
  gaveLoveWord: boolean
}

export interface PaintingThumbnail {
  dataUrl: string
  timestamp: number
}

export interface Memory {
  firstVisitAt: number
  visits: readonly VisitRecord[]
  loveWordsGiven: readonly string[]
  longTailUnlocked: boolean
  paintings: readonly PaintingThumbnail[]
}

export interface MemoryApi {
  memory: Ref<Memory>
  recordVisitStart: () => void
  recordVisitEnd: (record: Omit<VisitRecord, 'startedAt'>) => void
  recordLoveWord: (word: string) => void
  unlockLongTail: () => void
  savePainting: (thumbnail: PaintingThumbnail) => void
}

export function useMemory(): MemoryApi {
  const memory = ref<Memory>({
    firstVisitAt: 0,
    visits: [],
    loveWordsGiven: [],
    longTailUnlocked: false,
    paintings: [],
  })
  return {
    memory,
    recordVisitStart: () => {
      throw new Error('useMemory.recordVisitStart: not implemented')
    },
    recordVisitEnd: () => {
      throw new Error('useMemory.recordVisitEnd: not implemented')
    },
    recordLoveWord: () => {
      throw new Error('useMemory.recordLoveWord: not implemented')
    },
    unlockLongTail: () => {
      throw new Error('useMemory.unlockLongTail: not implemented')
    },
    savePainting: () => {
      throw new Error('useMemory.savePainting: not implemented')
    },
  }
}
