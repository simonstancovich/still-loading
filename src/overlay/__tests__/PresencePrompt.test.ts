import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import PresencePrompt from '@/overlay/PresencePrompt.vue'
import {
  DIRECTOR_KEY,
  __resetDirectorStateForTests,
  __setAwaitingPresenceForTests,
  useDirector,
} from '@/composables/useDirector'

function withAwaiting(): ReturnType<typeof useDirector> {
  const director = useDirector()
  __setAwaitingPresenceForTests(true)
  return director
}

function mountPrompt() {
  return mount(PresencePrompt, {
    global: { provide: { [DIRECTOR_KEY as symbol]: useDirector() } },
  })
}

describe('PresencePrompt.vue', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
  })

  it('renders one span per character of the prompt', () => {
    withAwaiting()
    const wrapper = mountPrompt()
    const chars = wrapper.findAll('.presence-prompt-char')
    expect(chars).toHaveLength('are you here?'.length)
    wrapper.unmount()
  })

  it('is not marked dismissed while awaitingPresence is true', () => {
    withAwaiting()
    const wrapper = mountPrompt()
    expect(wrapper.classes()).not.toContain('presence-prompt-dismissed')
    wrapper.unmount()
  })

  it('is marked dismissed once awaitingPresence flips to false', async () => {
    const director = withAwaiting()
    const wrapper = mountPrompt()
    director.confirmPresence()
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('presence-prompt-dismissed')
    wrapper.unmount()
  })
})
