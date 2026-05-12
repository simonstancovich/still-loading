import { Mesh, PlaneGeometry, ShaderMaterial, type WebGLRenderer } from 'three'

export interface CausticsLayerUniforms {
  uTime: { value: number }
  uIntensity: { value: number }
  uScale: { value: number }
}

export class CausticsLayer {
  readonly mesh: Mesh
  readonly material: ShaderMaterial
  readonly uniforms: CausticsLayerUniforms

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uScale: { value: 1 },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: '',
      fragmentShader: '',
      transparent: true,
    })
    this.mesh = new Mesh(new PlaneGeometry(2, 2), this.material)
  }

  update(_dtMs: number): void {
    throw new Error('CausticsLayer.update: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
