import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  type IUniform,
  type WebGLRenderer,
} from 'three'
import type { DustParticle } from '@/composables/useDust'
import { tokenAsRgb } from '@/styles/tokens'
import dustVert from '@/scene/shaders/dust.vert?raw'
import dustFrag from '@/scene/shaders/dust.frag?raw'

export interface DustLayerUniforms {
  uTime: IUniform<number>
  uPixelRatio: IUniform<number>
  [uniform: string]: IUniform<unknown>
}

// A pale warm mote against the off-white. Personality-coloured dust is Phase 2.
function dustColor(): readonly [number, number, number] {
  return tokenAsRgb('color.dust.base')
}

export class DustLayer {
  readonly points: Points
  readonly geometry: BufferGeometry
  readonly material: ShaderMaterial
  readonly uniforms: DustLayerUniforms
  private readonly capacity: number

  constructor(maxParticles: number) {
    this.capacity = maxParticles
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(new Float32Array(maxParticles * 3), 3),
    )
    this.geometry.setAttribute(
      'aSize',
      new Float32BufferAttribute(new Float32Array(maxParticles), 1),
    )
    this.geometry.setAttribute(
      'aAlpha',
      new Float32BufferAttribute(new Float32Array(maxParticles), 1),
    )
    this.geometry.setAttribute(
      'aColor',
      new Float32BufferAttribute(new Float32Array(maxParticles * 3), 3),
    )
    this.geometry.setDrawRange(0, 0)
    this.uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      transparent: true,
      depthWrite: false,
    })
    this.points = new Points(this.geometry, this.material)
  }

  sync(particles: readonly DustParticle[]): void {
    const count = Math.min(particles.length, this.capacity)
    const position = this.geometry.getAttribute('position')
    const aSize = this.geometry.getAttribute('aSize')
    const aAlpha = this.geometry.getAttribute('aAlpha')
    const aColor = this.geometry.getAttribute('aColor')
    const [dr, dg, db] = dustColor()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      if (!p) continue
      position.setXYZ(i, p.x * 2 - 1, p.y * 2 - 1, 0)
      aSize.setX(i, p.size)
      aAlpha.setX(i, p.alpha)
      aColor.setXYZ(i, dr, dg, db)
    }
    position.needsUpdate = true
    aSize.needsUpdate = true
    aAlpha.needsUpdate = true
    aColor.needsUpdate = true
    this.geometry.setDrawRange(0, count)
  }

  dispose(_renderer: WebGLRenderer): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
