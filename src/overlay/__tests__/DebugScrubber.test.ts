import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import DebugScrubber from '@/overlay/DebugScrubber.vue'
import {
  DIRECTOR_KEY,
  __resetDirectorStateForTests,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests } from '@/composables/useStillness'
import { __resetRitualForTests } from '@/composables/useRitual'

describe('DebugScrubber.vue', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetRitualForTests()
  })

  function mountScrubber() {
    return mount(DebugScrubber, {
      global: { provide: { [DIRECTOR_KEY as symbol]: useDirector() } },
    })
  }

  it('renders the scrubber with a time slider and one button per act', () => {
    const wrapper = mountScrubber()
    expect(wrapper.find('.debug-scrubber').exists()).toBe(true)
    expect(wrapper.find('input.debug-slider').exists()).toBe(true)
    // 10 act buttons + pause + resume
    expect(wrapper.findAll('button.debug-btn')).toHaveLength(12)
    wrapper.unmount()
    stopDirector()
  })

  it('shows the current director act in its readout', () => {
    const wrapper = mountScrubber()
    expect(wrapper.text()).toContain('preflight')
    wrapper.unmount()
    stopDirector()
  })

  it('jumping to an act updates the director state', async () => {
    const wrapper = mountScrubber()
    const cathedralBtn = wrapper
      .findAll('button.debug-btn')
      .find((b) => b.text() === 'cathedral')
    expect(cathedralBtn).toBeDefined()
    await cathedralBtn?.trigger('click')
    expect(useDirector().state.value.act).toBe('cathedral')
    wrapper.unmount()
    stopDirector()
  })
})
