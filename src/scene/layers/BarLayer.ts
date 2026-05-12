import { Mesh, PlaneGeometry, ShaderMaterial, type IUniform, type WebGLRenderer } from 'three'
import type { BarState } from '@/composables/useBar'
import { tokenAsRgb } from '@/styles/tokens'

export interface BarLayerUniforms {
  uFill: IUniform<number>
  uGlow: IUniform<number>
  uMood: IUniform<number>
  uTime: IUniform<number>
  uColorBase: IUniform<[number, number, number]>
  uColorGlow: IUniform<[number, number, number]>
  [uniform: string]: IUniform<unknown>
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
      uColorBase: { value: tokenAsRgb('color.bar.dim') },
      uColorGlow: { value: tokenAsRgb('color.bar.bright') },
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
