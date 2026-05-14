import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetDirectorStateForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests, recordCursor } from '@/composables/useStillness'
import { __resetBarForTests, startBar, stopBar, useBar } from '@/composables/useBar'

describe('bar integration — director run drives the flirt fill comedy', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetBarForTests()
  })

  it('fill rises to 8, sprints to 96, then collapses to 11 across the flirt act', () => {
    const clock = createVirtualClock(0)
    useDirector()
    recordCursor(-9999, -9999)
    startDirector(clock)
    startBar()

    const bar = useBar()

    clock.advance(7_000)
    expect(bar.state.value.fillPercent).toBe(8)

    clock.advance(15_000 - 7_000)
    expect(bar.state.value.fillPercent).toBe(28)

    clock.advance(27_700 - 15_000)
    expect(bar.state.value.fillPercent).toBe(96)

    clock.advance(30_000 - 27_700)
    expect(bar.state.value.fillPercent).toBe(11)

    stopBar()
    stopDirector()
  })
})
