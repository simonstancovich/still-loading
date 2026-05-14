import { Mesh, PlaneGeometry, ShaderMaterial, type IUniform, type WebGLRenderer } from 'three'
import { tokenAsRgb } from '@/styles/tokens'
import voidVert from '@/scene/shaders/void.vert?raw'
import voidFrag from '@/scene/shaders/void.frag?raw'

export interface VoidLayerUniforms {
  uTime: IUniform<number>
  uBreath: IUniform<number>
  uPaletteBase: IUniform<[number, number, number]>
  [uniform: string]: IUniform<unknown>
}

// Breath cycle ~8s, returned in 0..1. Audio-driven breath replaces this later.
const BREATH_PERIOD_MS = 8_000

export function breathAt(elapsedMs: number): number {
  return 0.5 + 0.5 * Math.sin((elapsedMs / BREATH_PERIOD_MS) * Math.PI * 2)
}

export class VoidLayer {
  readonly mesh: Mesh
  readonly material: ShaderMaterial
  readonly uniforms: VoidLayerUniforms

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uBreath: { value: breathAt(0) },
      uPaletteBase: { value: tokenAsRgb('color.bg.base') },
    }
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: voidVert,
      fragmentShader: voidFrag,
    })
    this.mesh = new Mesh(new PlaneGeometry(2, 2), this.material)
  }

  update(dtMs: number): void {
    this.uniforms.uTime.value += dtMs
    this.uniforms.uBreath.value = breathAt(this.uniforms.uTime.value)
  }

  dispose(_renderer: WebGLRenderer): void {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
