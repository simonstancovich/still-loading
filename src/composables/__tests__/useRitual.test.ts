import { beforeEach, describe, expect, it } from 'vitest'
import {
  HATE_ECHO_COUNT,
  __resetRitualForTests,
  beginRitual,
  submitHate,
  useRitual,
} from '@/composables/useRitual'

describe('useRitual — submitHate (happy path)', () => {
  beforeEach(() => {
    __resetRitualForTests()
  })

  it('starts idle', () => {
    expect(useRitual().state.value).toBe('idle')
  })

  it('beginRitual moves the state to askingHate', () => {
    beginRitual()
    expect(useRitual().state.value).toBe('askingHate')
  })

  it('submitHate multiplies the answer into HATE_ECHO_COUNT echoes and asks for love', () => {
    beginRitual()
    submitHate('my impatience')
    const ritual = useRitual()
    expect(ritual.hateEchoes.value).toHaveLength(HATE_ECHO_COUNT)
    expect(ritual.hateEchoes.value.every((e) => e === 'my impatience')).toBe(true)
    expect(ritual.state.value).toBe('askingLove')
  })

  it('ignores an empty hate answer — stays in askingHate', () => {
    beginRitual()
    submitHate('   ')
    expect(useRitual().state.value).toBe('askingHate')
    expect(useRitual().hateEchoes.value).toHaveLength(0)
  })

  it('does nothing if submitHate is called while not in askingHate', () => {
    submitHate('something')
    expect(useRitual().state.value).toBe('idle')
  })
})
