precision highp float;

uniform sampler2D uSource;
uniform float uIntensity;
uniform float uThreshold;

varying vec2 vUv;

void main() {
  vec4 c = texture2D(uSource, vUv);
  gl_FragColor = c;
}
