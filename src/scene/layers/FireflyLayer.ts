import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  type WebGLRenderer,
} from 'three'

export class FireflyLayer {
  readonly points: Points
  readonly geometry: BufferGeometry
  readonly material: ShaderMaterial

  constructor() {
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(3), 3))
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
      },
      vertexShader: '',
      fragmentShader: '',
      transparent: true,
      depthWrite: false,
    })
    this.points = new Points(this.geometry, this.material)
  }

  setPosition(_x: number, _y: number, _intensity: number): void {
    throw new Error('FireflyLayer.setPosition: not implemented')
  }

  dispose(_renderer: WebGLRenderer): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
