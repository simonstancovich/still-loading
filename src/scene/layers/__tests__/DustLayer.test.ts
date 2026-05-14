import { describe, expect, it } from 'vitest'
import { DustLayer } from '@/scene/layers/DustLayer'
import type { DustParticle } from '@/composables/useDust'

function particle(x: number, y: number, alpha: number): DustParticle {
  return { x, y, vx: 0, vy: 0, size: 3, alpha }
}

describe('DustLayer', () => {
  it('constructs with shader source loaded', () => {
    const layer = new DustLayer(30)
    expect(layer.material.vertexShader.length).toBeGreaterThan(0)
    expect(layer.material.fragmentShader.length).toBeGreaterThan(0)
  })

  it('sync maps 0..1 particle coords into clip space and sets the draw range', () => {
    const layer = new DustLayer(30)
    layer.sync([particle(0.5, 0.5, 1), particle(0, 1, 0.5)])
    const pos = layer.geometry.getAttribute('position')
    expect(pos.getX(0)).toBeCloseTo(0, 5)
    expect(pos.getY(0)).toBeCloseTo(0, 5)
    expect(pos.getX(1)).toBeCloseTo(-1, 5)
    expect(pos.getY(1)).toBeCloseTo(1, 5)
    expect(layer.geometry.drawRange.count).toBe(2)
  })

  it('sync writes per-particle alpha into the aAlpha attribute', () => {
    const layer = new DustLayer(30)
    layer.sync([particle(0.5, 0.5, 0.25)])
    expect(layer.geometry.getAttribute('aAlpha').getX(0)).toBeCloseTo(0.25, 5)
  })

  it('sync clamps to the layer capacity', () => {
    const layer = new DustLayer(2)
    layer.sync([particle(0.1, 0.1, 1), particle(0.2, 0.2, 1), particle(0.3, 0.3, 1)])
    expect(layer.geometry.drawRange.count).toBe(2)
  })
})
