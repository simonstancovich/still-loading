import { ShaderMaterial, type WebGLRenderer, type WebGLRenderTarget } from 'three'

export class ChromaticAberrationPass {
  readonly material: ShaderMaterial

  constructor() {
    this.material = new ShaderMaterial({
      uniforms: {
        uSource: { value: null },
        uOffset: { value: 0 },
      },
      vertexShader: '',
      fragmentShader: '',
    })
  }

  render(_renderer: WebGLRenderer, _input: WebGLRenderTarget, _output: WebGLRenderTarget): void {
    throw new Error('ChromaticAberrationPass.render: not implemented')
  }

  dispose(): void {
    this.material.dispose()
  }
}
