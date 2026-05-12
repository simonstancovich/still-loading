import { ShaderMaterial, type WebGLRenderer, type WebGLRenderTarget } from 'three'

export class BloomPass {
  readonly material: ShaderMaterial

  constructor() {
    this.material = new ShaderMaterial({
      uniforms: {
        uSource: { value: null },
        uIntensity: { value: 0 },
        uThreshold: { value: 0.8 },
      },
      vertexShader: '',
      fragmentShader: '',
    })
  }

  render(_renderer: WebGLRenderer, _input: WebGLRenderTarget, _output: WebGLRenderTarget): void {
    throw new Error('BloomPass.render: not implemented')
  }

  dispose(): void {
    this.material.dispose()
  }
}
