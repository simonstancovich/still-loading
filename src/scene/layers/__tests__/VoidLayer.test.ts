import { describe, expect, it } from 'vitest'
import { VoidLayer, breathAt } from '@/scene/layers/VoidLayer'

describe('breathAt', () => {
  it('stays within the 0..1 range for any elapsed time', () => {
    for (const t of [0, 1_000, 4_000, 8_000, 123_456, 1_000_000]) {
      const b = breathAt(t)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(1)
    }
  })

  it('oscillates — it is not constant', () => {
    const samples = [0, 2_000, 4_000, 6_000].map((t) => breathAt(t))
    const unique = new Set(samples.map((s) => s.toFixed(4)))
    expect(unique.size).toBeGreaterThan(1)
  })
})

describe('VoidLayer', () => {
  it('constructs with shader source loaded into the material', () => {
    const layer = new VoidLayer()
    expect(layer.material.vertexShader.length).toBeGreaterThan(0)
    expect(layer.material.fragmentShader.length).toBeGreaterThan(0)
  })

  it('update advances uTime by the delta and writes uBreath in range', () => {
    const layer = new VoidLayer()
    expect(layer.uniforms.uTime.value).toBe(0)
    layer.update(16)
    expect(layer.uniforms.uTime.value).toBe(16)
    layer.update(16)
    expect(layer.uniforms.uTime.value).toBe(32)
    expect(layer.uniforms.uBreath.value).toBeGreaterThanOrEqual(0)
    expect(layer.uniforms.uBreath.value).toBeLessThanOrEqual(1)
  })
})
