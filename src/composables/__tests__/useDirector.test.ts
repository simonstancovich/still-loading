import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  DIRECTOR_KEY,
  __resetDirectorStateForTests,
  injectDirector,
  useDirector,
  type DirectorApi,
} from '@/composables/useDirector'

describe('useDirector', () => {
  beforeEach(() => {
    __resetDirectorStateForTests()
  })

  it('returns the same API instance across calls (singleton)', () => {
    const a = useDirector()
    const b = useDirector()
    expect(a).toBe(b)
  })

  it('shares state across calls', () => {
    const a = useDirector()
    const b = useDirector()
    expect(a.state.value).toBe(b.state.value)
  })

  it('initial state starts in preflight at sessionMs 0', () => {
    const director = useDirector()
    expect(director.state.value.act).toBe('preflight')
    expect(director.state.value.sessionMs).toBe(0)
  })

  it('injectDirector throws when no provider is set up', () => {
    const child = defineComponent({
      setup() {
        injectDirector()
        return () => h('div')
      },
    })

    expect(() => mount(child)).toThrow(/Director not provided/)
  })

  it('injectDirector resolves to the same singleton provided at app level', () => {
    const api = useDirector()
    let injected: DirectorApi | null = null

    const child = defineComponent({
      setup() {
        injected = injectDirector()
        return () => h('div')
      },
    })

    mount(child, {
      global: {
        provide: { [DIRECTOR_KEY as symbol]: api },
      },
    })

    expect(injected).not.toBeNull()
    expect(injected).toBe(api)
  })
})
