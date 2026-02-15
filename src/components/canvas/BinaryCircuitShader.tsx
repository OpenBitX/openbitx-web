"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Vertex shader — full-screen quad via clip-space positions.
 * Passes UVs to fragment shader. No matrix transforms needed.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

/**
 * Fragment shader — "Binary Circuit Cascade"
 *
 * Pure GPU animation. Zero JS-side per-frame math beyond uTime.
 *
 * Architecture (bottom to top):
 *   1. Circuit substrate — procedural grid traces
 *   2. Binary rain — 3 parallax depth layers via column hashing
 *   3. Data packets — bright flashes traveling along traces
 *   4. Soft glow — analytical approximation (no multi-sample bloom)
 *   5. Vignette + scanlines — final compositing
 */
const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // ── Hash functions (no texture lookups) ──
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // ── Circuit board pattern ──
  float circuit(vec2 uv) {
    float s = 20.0;
    vec2 g = uv * s;
    vec2 c = floor(g);
    vec2 f = fract(g);

    // Horizontal & vertical traces (sparse)
    float lw = 0.045;
    float h = smoothstep(lw, 0.0, abs(f.y - 0.5)) * step(0.5, hash21(c * 1.7));
    float v = smoothstep(lw, 0.0, abs(f.x - 0.5)) * step(0.5, hash21(c * 2.3 + 99.0));

    // Junction nodes
    float nd = length(f - 0.5);
    float node = smoothstep(0.12, 0.05, nd) * step(0.65, hash21(c * 3.1 + 50.0));

    // Large-scale bus traces
    vec2 g2 = uv * 5.0;
    vec2 f2 = fract(g2);
    float bus = smoothstep(0.025, 0.0, abs(f2.y - 0.5)) * 0.25
              + smoothstep(0.025, 0.0, abs(f2.x - 0.5)) * 0.25;

    return min(h + v + node + bus, 1.0);
  }

  // ── Single rain column ──
  float rainCol(vec2 uv, float id, float speed) {
    float phase = hash11(id * 17.31) * 100.0;
    float yOff = uTime * speed + phase;

    float charH = 30.0;
    float cy = floor(uv.y * charH + yOff * charH);
    float cf = fract(uv.y * charH + yOff * charH);

    // Stream head position & fade
    float headY = fract(yOff * 0.25 + hash11(id * 3.33));
    float streamLen = 6.0 + hash11(id * 7.77) * 14.0;
    float dist = fract(uv.y - headY);
    float fade = 1.0 - smoothstep(0.0, streamLen / charH, dist);
    fade *= fade;

    // Binary digit visibility
    float digit = step(0.25, hash21(vec2(id, cy + floor(uTime * 1.5))));

    // Character block shape
    float shape = step(0.12, cf) * step(cf, 0.88);

    return fade * digit * shape;
  }

  // ── Data packet flashes ──
  float packets(vec2 uv, float t) {
    float r = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float px = hash11(fi * 13.7 + floor(t * 0.4) * 0.1);
      float py = fract(t * (0.15 + hash11(fi * 9.1) * 0.25) + hash11(fi * 11.1));
      float d = length(uv - vec2(px, py));
      r += exp(-d * 40.0) * (0.5 + 0.5 * sin(t * 6.0 + fi * 2.5));
    }
    return min(r, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float asp = uResolution.x / uResolution.y;
    vec2 uvA = vec2(uv.x * asp, uv.y);

    // ── Base ──
    vec3 col = vec3(0.02);

    // ── Circuit substrate ──
    float circ = circuit(uvA);
    col += vec3(0.0, 0.05, 0.03) * circ;

    // ── Binary rain: 3 parallax layers ──
    // Far (slow, dim)
    float r1 = 0.0;
    for (float i = 0.0; i < 40.0; i++) {
      float cx = (i + 0.5) / 40.0 * asp;
      float w = asp / 40.0;
      float mask = 1.0 - smoothstep(0.0, w * 0.35, abs(uvA.x - cx));
      r1 += rainCol(vec2(cx, uv.y), i, 0.12) * mask * 0.2;
    }

    // Mid
    float r2 = 0.0;
    for (float i = 0.0; i < 22.0; i++) {
      float cx = (i + 0.5) / 22.0 * asp;
      float w = asp / 22.0;
      float mask = 1.0 - smoothstep(0.0, w * 0.4, abs(uvA.x - cx));
      r2 += rainCol(vec2(cx, uv.y), i + 100.0, 0.28) * mask * 0.45;
    }

    // Near (fast, bright)
    float r3 = 0.0;
    for (float i = 0.0; i < 12.0; i++) {
      float cx = (i + 0.5) / 12.0 * asp;
      float w = asp / 12.0;
      float mask = 1.0 - smoothstep(0.0, w * 0.5, abs(uvA.x - cx));
      r3 += rainCol(vec2(cx, uv.y), i + 200.0, 0.5) * mask * 0.85;
    }

    float rain = min(r1 + r2 + r3, 1.0);

    // Neon cyan (#00FF94)
    vec3 neon = vec3(0.0, 1.0, 0.58);

    // Rain color + circuit illumination
    float circGlow = circ * rain * 2.5;
    col += neon * rain * 0.35;
    col += neon * circGlow * 0.55;

    // ── Data packets ──
    float pk = packets(uv, uTime);
    col += vec3(0.85, 1.0, 0.92) * pk * 0.9;

    // ── Analytical soft glow (no multi-sample!) ──
    float glowSrc = rain * 0.4 + circGlow * 0.3 + pk * 0.5;
    col += neon * glowSrc * glowSrc * 0.3;

    // ── Vignette ──
    float vig = 1.0 - length((uv - 0.5) * 1.4);
    vig = smoothstep(0.0, 0.65, vig);
    col *= vig;

    // ── Scanlines ──
    col *= 0.95 + 0.05 * sin(uv.y * uResolution.y * 1.5);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * BinaryCircuitShader — Full-screen GPU shader background.
 *
 * Renders a single PlaneGeometry with a custom ShaderMaterial.
 * All animation runs in GLSL. The only JS work per frame is
 * updating the uTime uniform (a single float upload).
 */
export default function BinaryCircuitShader() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(
              size.width * Math.min(window.devicePixelRatio, 1.5),
              size.height * Math.min(window.devicePixelRatio, 1.5)
            ),
          },
        }}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
