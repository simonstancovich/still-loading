import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import Bar from '@/overlay/Bar.vue'
import {
  DIRECTOR_KEY,
  __resetDirectorStateForTests,
  useDirector,
} from '@/composables/useDirector'

describe('Bar.vue', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
  })

  function mountBar() {
    return mount(Bar, {
      global: {
        provide: { [DIRECTOR_KEY as symbol]: useDirector() },
      },
    })
  }

  it('renders the bar track and a fill child', () => {
    const wrapper = mountBar()
    expect(wrapper.find('.bar').exists()).toBe(true)
    expect(wrapper.find('.bar-fill').exists()).toBe(true)
  })

  it('positions the track with inline left/top/width derived from useBar state', () => {
    const wrapper = mountBar()
    const track = wrapper.find('.bar').element as HTMLElement
    expect(track.style.left).toBe('50%')
    expect(track.style.top).toBe('50%')
    expect(track.style.width).toBe('220px')
  })

  it('renders the initial fill at scaleX(0) (0% fill)', () => {
    const wrapper = mountBar()
    const fill = wrapper.find('.bar-fill').element as HTMLElement
    expect(fill.style.transform).toBe('scaleX(0)')
  })

  it('does not apply the glowing class when bar.state.glowing is false', () => {
    const wrapper = mountBar()
    expect(wrapper.find('.bar-fill').classes()).not.toContain('bar-fill-glowing')
  })

  it('mood is exposed as a data-attribute for downstream styling', () => {
    const wrapper = mountBar()
    expect(wrapper.find('.bar').attributes('data-mood')).toBe('calm')
  })

  it('throws a useful error when mounted without a director provider', () => {
    expect(() => mount(Bar)).toThrow(/Director not provided/)
  })
})
