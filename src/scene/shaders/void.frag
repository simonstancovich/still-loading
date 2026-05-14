precision highp float;

uniform float uTime;
uniform float uBreath;
uniform vec3 uPaletteBase;

varying vec2 vUv;

// A very low-contrast, slow-moving value so the off-white is never dead flat.
float softNoise(vec2 p) {
  return sin(p.x * 1.7 + uTime * 0.04) * sin(p.y * 2.3 - uTime * 0.03);
}

void main() {
  // Breathing: uBreath is 0..1; map to a tiny brightness delta (about +/-2%).
  float breath = (uBreath - 0.5) * 0.04;
  // Faint large-scale variation, kept under ~3% contrast.
  float grain = softNoise(vUv * 3.0) * 0.015;
  vec3 color = uPaletteBase * (1.0 + breath + grain);
  gl_FragColor = vec4(color, 1.0);
}
