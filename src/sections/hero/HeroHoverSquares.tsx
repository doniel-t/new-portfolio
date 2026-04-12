"use client";

import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type HeroHoverSquaresProps = {
  isMobile: boolean;
};

type SceneProps = {
  activeRef: React.MutableRefObject<boolean>;
  pointerRef: React.MutableRefObject<THREE.Vector2>;
  isMobile: boolean;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uIntensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 frag = vUv * uResolution;
  vec2 cellSize = vec2(20.0);
  vec2 cell = floor(frag / cellSize);
  vec2 cellUv = fract(frag / cellSize);
  vec2 cellCenter = (cell + 0.5) * cellSize;

  float dist = distance(cellCenter, uMouse);
  float sphere = 1.0 - smoothstep(uRadius * 0.12, uRadius, dist);
  float rnd = hash(cell);
  float fillThreshold = 0.16 + sphere * 0.92;
  float showCell = step(rnd, fillThreshold);

  float margin = 0.1;
  float insideX = step(margin, cellUv.x) * step(cellUv.x, 1.0 - margin);
  float insideY = step(margin, cellUv.y) * step(cellUv.y, 1.0 - margin);
  float squareMask = insideX * insideY;

  float alpha = squareMask * showCell * sphere * uIntensity * (0.34 + (1.0 - rnd) * 0.22);
  vec3 lightTone = vec3(0.88, 0.83, 0.74);
  vec3 darkTone = vec3(0.16, 0.12, 0.08);
  vec3 color = mix(lightTone, darkTone, step(0.48, rnd));

  gl_FragColor = vec4(color, alpha);
}
`;

function HoverSquaresScene({ activeRef, pointerRef, isMobile }: SceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const smoothedPointerRef = useRef(new THREE.Vector2(0, 0));
  const intensityRef = useRef(0);
  const { viewport, size, gl, invalidate } = useThree();

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      if (activeRef.current || intensityRef.current > 0.01) {
        invalidate();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [activeRef, invalidate]);

  useEffect(() => {
    if (!materialRef.current) return;

    const dpr = gl.getPixelRatio();
    materialRef.current.uniforms.uResolution.value.set(
      size.width * dpr,
      size.height * dpr
    );
    materialRef.current.uniforms.uRadius.value = Math.min(size.width, size.height) * (isMobile ? 0.24 : 0.22);
    invalidate();
  }, [gl, invalidate, isMobile, size.height, size.width]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const targetIntensity = activeRef.current ? 1 : 0;
    intensityRef.current = THREE.MathUtils.damp(intensityRef.current, targetIntensity, 7.5, delta);

    smoothedPointerRef.current.lerp(pointerRef.current, 1 - Math.exp(-12 * delta));

    material.uniforms.uMouse.value.copy(smoothedPointerRef.current);
    material.uniforms.uIntensity.value = intensityRef.current;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={{
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
          uMouse: { value: new THREE.Vector2(size.width * 0.5, size.height * 0.5) },
          uRadius: { value: Math.min(size.width, size.height) * 0.22 },
          uIntensity: { value: 0 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function HeroHoverSquares({ isMobile }: HeroHoverSquaresProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const activeRef = useRef(false);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    pointerRef.current.set(
      event.clientX - rect.left,
      rect.height - (event.clientY - rect.top)
    );
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      onPointerEnter={(event) => {
        activeRef.current = true;
        updatePointer(event);
      }}
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        activeRef.current = false;
      }}
    >
      <Canvas
        className="pointer-events-none absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 1] }}
        dpr={1}
        frameloop="demand"
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <HoverSquaresScene
          activeRef={activeRef}
          pointerRef={pointerRef}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
