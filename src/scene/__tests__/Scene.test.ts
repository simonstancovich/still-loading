import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Scene from '@/scene/Scene.vue'

describe('Scene.vue', () => {
  it('mounts without throwing even when WebGL is unavailable (jsdom)', () => {
    const wrapper = mount(Scene)
    expect(wrapper.find('canvas.scene-canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})
