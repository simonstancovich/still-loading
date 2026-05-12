precision highp float;

uniform float uFill;
uniform float uGlow;
uniform float uMood;
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorGlow;

varying vec2 vUv;

void main() {
  float fillMask = step(vUv.x, uFill);
  vec3 color = mix(uColorBase, uColorGlow, uGlow);
  gl_FragColor = vec4(color, fillMask);
}
