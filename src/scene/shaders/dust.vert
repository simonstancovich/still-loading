precision highp float;

attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;

uniform float uTime;
uniform float uPixelRatio;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio;
}
