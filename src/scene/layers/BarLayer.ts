import { Mesh, PlaneGeometry, ShaderMaterial, type WebGLRenderer } from 'three'
import type { BarState } from '@/composables/useBar'

export interface BarLayerUniforms {
  uFill: { value: number }
  uGlow: { value: number }
  uMood: { value: number }
  uTime: { value: number }
}

export class BarLayer {
  readonly mesh: Mesh
  readonly material: ShaderMaterial
  readonly uniforms: BarLayerUniforms

  constructor() {
    this.uniforms = {
      uFill: { value: 0 },
      uGlow: { value: 0 },
      uMood: { value: 0 },
      uTime: { value: 0 },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: '',
      fragmentShader: '',
      transparent: true,
    })
    this.mesh = new Mesh(new PlaneGeometry(1, 1), this.material)
  }

  sync(_state: BarState): void {
    throw new Error('BarLayer.sync: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
