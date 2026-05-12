precision highp float;

uniform sampler2D uSource;
uniform float uOffset;

varying vec2 vUv;

void main() {
  vec2 dir = vUv - 0.5;
  float r = texture2D(uSource, vUv + dir * uOffset).r;
  float g = texture2D(uSource, vUv).g;
  float b = texture2D(uSource, vUv - dir * uOffset).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
