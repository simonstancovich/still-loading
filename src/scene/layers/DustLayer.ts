import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  type IUniform,
  type WebGLRenderer,
} from 'three'
import type { DustParticle } from '@/composables/useDust'

export interface DustLayerUniforms {
  uTime: IUniform<number>
  uPixelRatio: IUniform<number>
  [uniform: string]: IUniform<unknown>
}

export class DustLayer {
  readonly points: Points
  readonly geometry: BufferGeometry
  readonly material: ShaderMaterial
  readonly uniforms: DustLayerUniforms

  constructor(maxParticles: number) {
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(new Float32Array(maxParticles * 3), 3),
    )
    this.uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: '',
      fragmentShader: '',
      transparent: true,
      depthWrite: false,
    })
    this.points = new Points(this.geometry, this.material)
  }

  sync(_particles: readonly DustParticle[]): void {
    throw new Error('DustLayer.sync: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
