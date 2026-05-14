import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import CursorDot from '@/overlay/CursorDot.vue'
import { __resetStillnessForTests, recordCursor } from '@/composables/useStillness'

describe('CursorDot.vue', () => {
  beforeEach(() => {
    __resetStillnessForTests()
  })

  it('renders a dot element', () => {
    const wrapper = mount(CursorDot)
    expect(wrapper.find('.cursor-dot').exists()).toBe(true)
  })

  it('positions the dot at the cursor coordinates', async () => {
    recordCursor(320, 240)
    const wrapper = mount(CursorDot)
    await wrapper.vm.$nextTick()
    const dot = wrapper.find('.cursor-dot').element as HTMLElement
    expect(dot.style.transform).toBe('translate(320px, 240px)')
  })

  it('follows the cursor when the position updates', async () => {
    const wrapper = mount(CursorDot)
    recordCursor(100, 100)
    await wrapper.vm.$nextTick()
    let dot = wrapper.find('.cursor-dot').element as HTMLElement
    expect(dot.style.transform).toBe('translate(100px, 100px)')
    recordCursor(500, 600)
    await wrapper.vm.$nextTick()
    dot = wrapper.find('.cursor-dot').element as HTMLElement
    expect(dot.style.transform).toBe('translate(500px, 600px)')
  })
})
