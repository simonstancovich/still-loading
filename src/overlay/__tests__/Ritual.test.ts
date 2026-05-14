import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import Ritual from '@/overlay/Ritual.vue'
import { __resetRitualForTests, beginRitual, useRitual } from '@/composables/useRitual'

describe('Ritual.vue', () => {
  beforeEach(() => {
    __resetRitualForTests()
  })

  it('renders nothing while the ritual is idle', () => {
    const wrapper = mount(Ritual)
    expect(wrapper.find('.ritual').exists()).toBe(false)
  })

  it('shows the hate prompt and an input while askingHate', () => {
    beginRitual()
    const wrapper = mount(Ritual)
    expect(wrapper.find('.ritual').exists()).toBe(true)
    expect(wrapper.find('.ritual-prompt').text().length).toBeGreaterThan(0)
    expect(wrapper.find('input.ritual-input').exists()).toBe(true)
  })

  it('submitting the hate input advances the ritual to askingLove', async () => {
    beginRitual()
    const wrapper = mount(Ritual)
    await wrapper.find('input.ritual-input').setValue('my impatience')
    await wrapper.find('form.ritual').trigger('submit')
    expect(useRitual().state.value).toBe('askingLove')
  })

  it('submitting the love input resolves the ritual', async () => {
    beginRitual()
    const wrapper = mount(Ritual)
    await wrapper.find('input.ritual-input').setValue('my impatience')
    await wrapper.find('form.ritual').trigger('submit')
    await wrapper.find('input.ritual-input').setValue('my laugh')
    await wrapper.find('form.ritual').trigger('submit')
    expect(useRitual().state.value).toBe('resolved')
  })

  it('renders nothing once the ritual is resolved', async () => {
    beginRitual()
    const wrapper = mount(Ritual)
    await wrapper.find('input.ritual-input').setValue('x')
    await wrapper.find('form.ritual').trigger('submit')
    await wrapper.find('input.ritual-input').setValue('my laugh')
    await wrapper.find('form.ritual').trigger('submit')
    expect(wrapper.find('.ritual').exists()).toBe(false)
  })
})
