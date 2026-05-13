import { describe, expect, it } from 'vitest'
import { isProxy, isReactive, reactive } from 'vue'
import { assignRaw, rawShallow, rawShallowNullable } from '@/scene/raw'

class FakeThreeObject {
  constructor(public value = 0) {}
  internals: number[] = new Array(1000).fill(0)
}

describe('three.js raw discipline', () => {
  it('rawShallow does not proxy the wrapped object', () => {
    const original = new FakeThreeObject(7)
    const wrapped = rawShallow(original)
    expect(wrapped.value).toBe(original)
    expect(isProxy(wrapped.value)).toBe(false)
    expect(isReactive(wrapped.value)).toBe(false)
  })

  it('marked-raw objects survive being put into reactive()', () => {
    const original = rawShallow(new FakeThreeObject()).value
    const container = reactive({ engine: original })
    expect(container.engine).toBe(original)
    expect(isProxy(container.engine)).toBe(false)
  })

  it('rawShallowNullable starts null and can be assigned with assignRaw', () => {
    const slot = rawShallowNullable<FakeThreeObject>()
    expect(slot.value).toBeNull()
    const obj = new FakeThreeObject(42)
    assignRaw(slot, obj)
    expect(slot.value).toBe(obj)
    expect(isProxy(slot.value)).toBe(false)
  })

  it('mutating an internal field on a raw object does not throw or proxy', () => {
    const ref = rawShallow(new FakeThreeObject())
    expect(ref.value.internals.length).toBe(1000)
    ref.value.internals[0] = 1
    ref.value.internals[999] = 2
    expect(ref.value.internals[0]).toBe(1)
    expect(ref.value.internals[999]).toBe(2)
    expect(isProxy(ref.value.internals)).toBe(false)
  })
})
