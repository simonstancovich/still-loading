import { describe, expect, it } from 'vitest'
import { useConstellations } from '@/composables/useConstellations'
import { useGhostPool } from '@/composables/useGhostPool'
import { usePresence } from '@/composables/usePresence'

describe('async stubs reject asynchronously, not throw synchronously', () => {
  it('useGhostPool.fetchGifts returns a rejected Promise (catchable via .catch)', async () => {
    const pool = useGhostPool()
    // No try/catch — proving the rejection is a Promise, not a sync throw.
    const fired = await pool
      .fetchGifts(10)
      .then(() => 'resolved')
      .catch((err: unknown) =>
        err instanceof Error && err.message.includes('not implemented') ? 'rejected' : 'wrong-error',
      )
    expect(fired).toBe('rejected')
  })

  it('useGhostPool.submitLove returns a rejected Promise', async () => {
    await expect(useGhostPool().submitLove('test', 0.5, 0.5)).rejects.toThrow(/not implemented/)
  })

  it('usePresence.join returns a rejected Promise', async () => {
    await expect(usePresence().join()).rejects.toThrow(/not implemented/)
  })

  it('usePresence.leave returns a rejected Promise', async () => {
    await expect(usePresence().leave()).rejects.toThrow(/not implemented/)
  })

  it('useConstellations.fetchPoints returns a rejected Promise', async () => {
    await expect(useConstellations().fetchPoints(60)).rejects.toThrow(/not implemented/)
  })

  it('calling the stub does NOT throw synchronously', () => {
    // The critical assertion. If this throws, the .catch handler in real code never runs.
    expect(() => useGhostPool().fetchGifts(10).catch(() => undefined)).not.toThrow()
    expect(() => useConstellations().fetchPoints(60).catch(() => undefined)).not.toThrow()
    expect(() => usePresence().join().catch(() => undefined)).not.toThrow()
  })
})
