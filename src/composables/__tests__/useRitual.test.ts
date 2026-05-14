import { beforeEach, describe, expect, it } from 'vitest'
import {
  HATE_ECHO_COUNT,
  __resetRitualForTests,
  beginRitual,
  startRitual,
  stopRitual,
  submitHate,
  submitLove,
  useRitual,
} from '@/composables/useRitual'
import { seedGifts } from '@/corpus/seedGifts'
import {
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests } from '@/composables/useStillness'

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

describe('useRitual — submitHate safety branch', () => {
  beforeEach(() => {
    __resetRitualForTests()
  })

  it('a tier-1 hit skips hate-echo multiplication', () => {
    beginRitual()
    submitHate('i want to die')
    const ritual = useRitual()
    expect(ritual.safetyTier.value).toBe(1)
    expect(ritual.hateEchoes.value).toHaveLength(0)
    expect(ritual.state.value).toBe('askingLove')
  })

  it('a tier-2 hit still multiplies but records the tier', () => {
    beginRitual()
    submitHate('i feel worthless')
    const ritual = useRitual()
    expect(ritual.safetyTier.value).toBe(2)
    expect(ritual.hateEchoes.value).toHaveLength(HATE_ECHO_COUNT)
    expect(ritual.state.value).toBe('askingLove')
  })

  it('a clean answer leaves safetyTier null', () => {
    beginRitual()
    submitHate('my impatience')
    expect(useRitual().safetyTier.value).toBeNull()
  })
})

describe('useRitual — submitLove resolution', () => {
  beforeEach(() => {
    __resetRitualForTests()
  })

  function advanceToAskingLove(): void {
    beginRitual()
    submitHate('my impatience')
  }

  it('a real love-word resolves with source self', () => {
    advanceToAskingLove()
    submitLove('my patience with my mother')
    const ritual = useRitual()
    expect(ritual.loveResolution.value).toEqual({
      source: 'self',
      word: 'my patience with my mother',
    })
    expect(ritual.state.value).toBe('resolved')
  })

  it('an empty answer routes to the nothing branch with a gift word', () => {
    advanceToAskingLove()
    submitLove('   ')
    const ritual = useRitual()
    expect(ritual.loveResolution.value?.source).toBe('gift')
    expect(seedGifts).toContain(ritual.loveResolution.value?.word)
    expect(ritual.state.value).toBe('resolved')
  })

  it('"nothing", "idk", "none" all route to the nothing branch', () => {
    for (const answer of ['nothing', 'idk', 'none', 'Nothing.']) {
      __resetRitualForTests()
      advanceToAskingLove()
      submitLove(answer)
      expect(useRitual().loveResolution.value?.source, answer).toBe('gift')
    }
  })

  it('does nothing if submitLove is called while not in askingLove', () => {
    submitLove('my laugh')
    expect(useRitual().loveResolution.value).toBeNull()
  })
})

describe('useRitual — startRitual act-watch', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetRitualForTests()
  })

  it('opens the ritual (askingHate) when the director enters invite', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startRitual()

    expect(useRitual().state.value).toBe('idle')

    __setActForTests('invite', clock)
    clock.advance(1)

    expect(useRitual().state.value).toBe('askingHate')

    stopRitual()
    stopDirector()
  })

  it('stopRitual halts the act-watch', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    startRitual()
    stopRitual()

    __setActForTests('invite', clock)
    clock.advance(1)

    expect(useRitual().state.value).toBe('idle')

    stopDirector()
  })
})
