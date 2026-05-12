precision highp float;

uniform float uTime;
uniform float uBreath;
uniform vec3 uPaletteBase;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(uPaletteBase, 1.0);
}
