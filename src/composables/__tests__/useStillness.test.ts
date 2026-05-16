import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetStillnessForTests,
  cursorX,
  cursorY,
  recordCursor,
  recordMove,
  startPresenceListener,
  useStillness,
} from '@/composables/useStillness'

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

describe('useStillness — cursor position', () => {
  beforeEach(() => {
    __resetStillnessForTests()
  })

  it('cursorX and cursorY start at 0', () => {
    expect(cursorX.value).toBe(0)
    expect(cursorY.value).toBe(0)
  })

  it('recordCursor updates cursorX and cursorY', () => {
    recordCursor(640, 360)
    expect(cursorX.value).toBe(640)
    expect(cursorY.value).toBe(360)
  })

  it('__resetStillnessForTests clears cursor position back to 0', () => {
    recordCursor(100, 200)
    __resetStillnessForTests()
    expect(cursorX.value).toBe(0)
    expect(cursorY.value).toBe(0)
  })
})

describe('startPresenceListener', () => {
  it('calls confirm on mousedown and removes itself', () => {
    let calls = 0
    const stop = startPresenceListener(() => {
      calls++
    })
    window.dispatchEvent(new MouseEvent('mousedown'))
    expect(calls).toBe(1)
    // After the first event the listener is gone — subsequent events do nothing.
    window.dispatchEvent(new MouseEvent('mousedown'))
    expect(calls).toBe(1)
    stop()
  })

  it('also fires on touchstart and keydown', () => {
    let calls = 0
    const stop1 = startPresenceListener(() => {
      calls++
    })
    window.dispatchEvent(new TouchEvent('touchstart'))
    expect(calls).toBe(1)
    stop1()

    let calls2 = 0
    const stop2 = startPresenceListener(() => {
      calls2++
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(calls2).toBe(1)
    stop2()
  })
})
