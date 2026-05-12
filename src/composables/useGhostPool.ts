export interface GhostPoolApi {
  fetchGifts: (limit: number) => Promise<readonly string[]>
  submitLove: (word: string, x: number, y: number) => Promise<void>
  pickGiftsForNothing: (count: number) => readonly string[]
}

export function useGhostPool(): GhostPoolApi {
  return {
    fetchGifts: () => {
      throw new Error('useGhostPool.fetchGifts: not implemented')
    },
    submitLove: () => {
      throw new Error('useGhostPool.submitLove: not implemented')
    },
    pickGiftsForNothing: () => {
      throw new Error('useGhostPool.pickGiftsForNothing: not implemented')
    },
  }
}
