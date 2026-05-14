import { describe, expect, it } from 'vitest'
import { handleVisibilityChange, wireVisibilityToDirector } from '@/main-wiring'

interface Calls {
  pause: number
  resume: number
}

function makeTarget(): { target: { pause: () => void; resume: () => void }; calls: Calls } {
  const calls: Calls = { pause: 0, resume: 0 }
  return {
    calls,
    target: {
      pause: () => {
        calls.pause += 1
      },
      resume: () => {
        calls.resume += 1
      },
    },
  }
}

describe('handleVisibilityChange', () => {
  it('"hidden" calls pause()', () => {
    const { target, calls } = makeTarget()
    handleVisibilityChange('hidden', target)
    expect(calls).toEqual({ pause: 1, resume: 0 })
  })

  it('"visible" calls resume()', () => {
    const { target, calls } = makeTarget()
    handleVisibilityChange('visible', target)
    expect(calls).toEqual({ pause: 0, resume: 1 })
  })
})

describe('wireVisibilityToDirector', () => {
  it('returns a dispose function and does not throw at construction', () => {
    const { target } = makeTarget()
    const dispose = wireVisibilityToDirector(target)
    expect(typeof dispose).toBe('function')
    dispose()
  })
})
