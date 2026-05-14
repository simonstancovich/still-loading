import { beforeEach, describe, expect, it } from 'vitest'
import { __resetStillnessForTests, recordMove, useStillness } from '@/composables/useStillness'

describe('useStillness', () => {
  beforeEach(() => {
    __resetStillnessForTests()
  })

  it('useStillness returns the shared lastMoveAt ref', () => {
    const a = useStillness()
    const b = useStillness()
    expect(a.lastMoveAt).toBe(b.lastMoveAt)
  })

  it('initial lastMoveAt is 0', () => {
    expect(useStillness().lastMoveAt.value).toBe(0)
  })

  it('recordMove updates lastMoveAt', () => {
    recordMove(1234)
    expect(useStillness().lastMoveAt.value).toBe(1234)
  })

  it('__resetStillnessForTests clears lastMoveAt back to 0', () => {
    recordMove(9999)
    __resetStillnessForTests()
    expect(useStillness().lastMoveAt.value).toBe(0)
  })
})
