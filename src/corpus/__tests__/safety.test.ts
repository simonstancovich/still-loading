import { describe, expect, it } from 'vitest'
import { checkSafety, pickResource } from '@/corpus/safety'

describe('checkSafety', () => {
  it('returns null for ordinary self-critical text', () => {
    expect(checkSafety('my handwriting')).toBeNull()
    expect(checkSafety('i procrastinate too much')).toBeNull()
    expect(checkSafety('')).toBeNull()
  })

  it('flags tier-1 explicit self-harm intent', () => {
    const hit = checkSafety('sometimes i want to die')
    expect(hit).not.toBeNull()
    expect(hit?.tier).toBe(1)
  })

  it('flags tier-1 across common phrasings', () => {
    for (const phrase of ['kill myself', 'i want to kill me', 'i should end it', 'suicide']) {
      expect(checkSafety(phrase)?.tier, phrase).toBe(1)
    }
  })

  it('flags tier-2 despair markers when there is no tier-1 hit', () => {
    const hit = checkSafety('i feel worthless')
    expect(hit?.tier).toBe(2)
  })

  it('tier-1 takes precedence over tier-2 in the same text', () => {
    const hit = checkSafety('i feel worthless and i want to die')
    expect(hit?.tier).toBe(1)
  })

  it('is case-insensitive', () => {
    expect(checkSafety('I WANT TO DIE')?.tier).toBe(1)
  })
})

describe('pickResource', () => {
  it('returns the Sweden resource for SE', () => {
    expect(pickResource('SE').region).toBe('SE')
  })

  it('returns the US resource for US', () => {
    expect(pickResource('US').region).toBe('US')
  })

  it('falls back to the international resource for an unknown region', () => {
    expect(pickResource('ZZ').region).toBe('INT')
  })
})
