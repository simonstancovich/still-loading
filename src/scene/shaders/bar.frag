precision highp float;

uniform float uFill;
uniform float uGlow;
uniform float uMood;
uniform float uTime;

varying vec2 vUv;

void main() {
  float fillMask = step(vUv.x, uFill);
  vec3 color = mix(vec3(0.55, 0.55, 0.55), vec3(1.0, 0.92, 0.78), uGlow);
  gl_FragColor = vec4(color, fillMask);
}
