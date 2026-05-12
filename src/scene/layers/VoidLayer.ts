import { Mesh, PlaneGeometry, ShaderMaterial, type WebGLRenderer } from 'three'
import { tokenAsRgb } from '@/styles/tokens'

export interface VoidLayerUniforms {
  uTime: { value: number }
  uBreath: { value: number }
  uPaletteBase: { value: [number, number, number] }
}

export class VoidLayer {
  readonly mesh: Mesh
  readonly material: ShaderMaterial
  readonly uniforms: VoidLayerUniforms

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uBreath: { value: 0 },
      uPaletteBase: { value: tokenAsRgb('color.bg.base') },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: '',
      fragmentShader: '',
    })
    this.mesh = new Mesh(new PlaneGeometry(2, 2), this.material)
  }

  update(_dtMs: number): void {
    throw new Error('VoidLayer.update: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
