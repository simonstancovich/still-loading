import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  type WebGLRenderer,
} from 'three'
import type { ConstellationPoint } from '@/composables/useConstellations'

export class ConstellationsLayer {
  readonly points: Points
  readonly geometry: BufferGeometry
  readonly material: ShaderMaterial

  constructor(maxPoints: number) {
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(new Float32Array(maxPoints * 3), 3),
    )
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: '',
      fragmentShader: '',
      transparent: true,
      depthWrite: false,
    })
    this.points = new Points(this.geometry, this.material)
  }

  sync(_points: readonly ConstellationPoint[]): void {
    throw new Error('ConstellationsLayer.sync: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
