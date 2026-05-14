import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import Voice from '@/overlay/Voice.vue'
import {
  DIRECTOR_KEY,
  __resetDirectorStateForTests,
  __setActForTests,
  createVirtualClock,
  startDirector,
  stopDirector,
  useDirector,
} from '@/composables/useDirector'
import { __resetStillnessForTests } from '@/composables/useStillness'
import { __resetVoiceForTests, scheduleLineForAct, useVoice } from '@/composables/useVoice'

describe('Voice.vue', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
    __resetStillnessForTests()
    __resetVoiceForTests()
  })

  function mountVoice() {
    return mount(Voice, {
      global: { provide: { [DIRECTOR_KEY as symbol]: useDirector() } },
    })
  }

  it('renders nothing when there is no current line', () => {
    const wrapper = mountVoice()
    expect(wrapper.find('.voice-line').exists()).toBe(false)
  })

  it('renders one span per character of the current line', () => {
    scheduleLineForAct('flirt', 'playful', 0)
    const text = useVoice().currentLine.value?.text ?? ''
    const wrapper = mountVoice()
    const spans = wrapper.findAll('.voice-char')
    expect(spans).toHaveLength(Array.from(text).length)
  })

  it('characters start at opacity 0 when no time has elapsed since the line started', () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    scheduleLineForAct('flirt', 'playful', 0)
    const wrapper = mountVoice()
    const first = wrapper.find('.voice-char').element as HTMLElement
    expect(first.style.opacity).toBe('0')
    stopDirector()
  })

  it('characters become visible as director sessionMs advances past the line start', async () => {
    const clock = createVirtualClock(0)
    useDirector()
    startDirector(clock)
    __setActForTests('flirt', clock)
    scheduleLineForAct('flirt', 'playful', 0)
    const wrapper = mountVoice()

    clock.advance(5_000)
    await wrapper.vm.$nextTick()
    const first = wrapper.find('.voice-char').element as HTMLElement
    expect(Number(first.style.opacity)).toBeGreaterThan(0)

    stopDirector()
  })
})
