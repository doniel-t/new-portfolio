"use client";

import React, { useEffect, forwardRef, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';
import { useGPUDetection, usePageVisibility } from '@/hooks/useGPUDetection';
import { useIsMobile } from '@/hooks/useIsMobile';

function useIsVisible(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '100px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

const ditherSepiaFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
uniform vec2 resolution;

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  // Reduce color depth
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  
  // Sepia conversion
  float grey = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 sepia = vec3(grey * 1.2, grey * 1.0, grey * 0.8);
  color = mix(color, sepia, 0.75); // Mix 75% sepia

  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroSepiaEffectImpl extends Effect {
  public uniforms: Map<string, THREE.Uniform<any>>;
  
  constructor({ colorNum = 4.0, pixelSize = 64.0, resolution = new THREE.Vector2(1, 1) }) {
    const uniforms = new Map<string, THREE.Uniform<any>>([
      ['colorNum', new THREE.Uniform(colorNum)],
      ['pixelSize', new THREE.Uniform(pixelSize)],
      ['resolution', new THREE.Uniform(resolution)]
    ]);
    
    super('RetroSepiaEffect', ditherSepiaFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }

  update(renderer: any, inputBuffer: any, _deltaTime: number) {
    // Ensure resolution uniform is updated if size changes
    const width = inputBuffer.width;
    const height = inputBuffer.height;
    this.uniforms.get('resolution')!.value.set(width, height);
  }
}

const RetroSepiaEffect = forwardRef<RetroSepiaEffectImpl, { colorNum: number; pixelSize: number }>((props, ref) => {
  const { colorNum, pixelSize } = props;
  const effect = React.useMemo(() => new RetroSepiaEffectImpl({ colorNum, pixelSize }), [colorNum, pixelSize]);
  
  // Update uniforms when props change
  useEffect(() => {
    effect.uniforms.get('pixelSize')!.value = pixelSize;
    effect.uniforms.get('colorNum')!.value = colorNum;
  }, [pixelSize, colorNum, effect]);

  return <primitive object={effect} ref={ref} dispose={null} />;
});

RetroSepiaEffect.displayName = 'RetroSepiaEffect';

function ImagePlane({ src }: { src: string }) {
  const texture = useLoader(THREE.TextureLoader, src);
  const viewport = useThree((state) => state.viewport);
  
  const scale = React.useMemo(() => {
    // Calculate scale to cover viewport (like object-fit: cover)
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;
    
    let scaleX, scaleY;
    if (viewportAspect > imageAspect) {
      scaleX = viewport.width;
      scaleY = viewport.width / imageAspect;
    } else {
      scaleY = viewport.height;
      scaleX = viewport.height * imageAspect;
    }

    // Add a small buffer to prevent edge snapping artifacts
    scaleX *= 1.01;
    scaleY *= 1.01;

    return [scaleX, scaleY, 1] as [number, number, number];
  }, [texture, viewport.width, viewport.height]);

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function DitherScene({ src, active, hasAnimated, onAnimationComplete, skipAnimation }: { 
  src: string; 
  active: boolean; 
  hasAnimated: boolean;
  onAnimationComplete: () => void;
  skipAnimation?: boolean;
}) {
  const effectRef = useRef<RetroSepiaEffectImpl>(null);
  const elapsedRef = useRef(0);
  const targetPixelSize = 3;
  const duration = 1; // Animation duration in seconds
  
  // If skipAnimation is true or already animated, start at the final state
  const shouldSkip = skipAnimation || hasAnimated;
  
  useEffect(() => {
    if (shouldSkip && effectRef.current) {
      effectRef.current.uniforms.get('pixelSize')!.value = targetPixelSize;
    }
  }, [shouldSkip]);
  
  useFrame((state, delta) => {
    // Only animate if active, not skipping, and not yet completed
    if (active && effectRef.current && !shouldSkip) {
      elapsedRef.current += delta;
      const progress = Math.min(elapsedRef.current / duration, 1);
      
      // Non-linear interpolation for better effect (starts fast, slows down)
      const current = 128 - (128 - targetPixelSize) * Math.pow(progress, 0.5);
      
      const newPixelSize = Math.max(current, targetPixelSize);
      effectRef.current.uniforms.get('pixelSize')!.value = newPixelSize;
      
      // Mark as complete when animation finishes
      if (progress >= 1) {
        onAnimationComplete();
      }
    }
  });

  return (
    <>
      <ImagePlane src={src} />
      <EffectComposer>
        <RetroSepiaEffect ref={effectRef} colorNum={6} pixelSize={shouldSkip ? targetPixelSize : 1024} />
      </EffectComposer>
    </>
  );
}

interface DitherImageProps {
  src: string;
  active?: boolean;
  className?: string;
  skipAnimation?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
      <div className="relative w-10 h-10">
        <div 
          className="absolute inset-0 border-2 border-muted/30 border-t-muted/80 rounded-full animate-spin"
          style={{ animationDuration: '0.8s' }}
        />
        <div 
          className="absolute inset-1 border-2 border-muted/20 border-b-muted/60 rounded-full animate-spin"
          style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
        />
      </div>
    </div>
  );
}

function FallbackDitherImage({ src, className }: { src: string; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%', minHeight: '100%' }}>
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        loading="lazy"
      />
    </div>
  );
}

export default function DitherImage({ src, active = false, className, skipAnimation = false }: DitherImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef);
  const isPageVisible = usePageVisibility();
  const gpuSupport = useGPUDetection();
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);
  
  // Track if canvas has ever been rendered
  // On mobile, allow canvas if skipAnimation is true (for static dithered image)
  const canUseCanvas = gpuSupport !== 'none' && (!isMobile || skipAnimation);
  const shouldRenderCanvas = canUseCanvas && (hasRenderedOnce || isVisible);
  
  // Mark as rendered once visible for the first time
  React.useEffect(() => {
    if (canUseCanvas && isVisible && !hasRenderedOnce) {
      setHasRenderedOnce(true);
    }
  }, [canUseCanvas, isVisible, hasRenderedOnce]);
  
  // Control frameloop based on visibility
  // On mobile with skipAnimation, use "demand" to render once then stop (better performance)
  const frameloop = skipAnimation && isMobile 
    ? "demand" 
    : (isPageVisible && isVisible ? "always" : "never");

  return (
    <div ref={containerRef} className={`${className} relative`}>
      {/* Loading spinner - always rendered behind, gets covered by canvas/image */}
      <LoadingSpinner />
      
      {shouldRenderCanvas ? (
        <Canvas
          camera={{ position: [0, 0, 5] }}
          dpr={[1, 2]}
          frameloop={frameloop}
          gl={{ antialias: false, preserveDrawingBuffer: true }}
          className="relative z-10 grayscale-50 brightness-110 saturate-50"
        >
          <React.Suspense fallback={null}>
            <DitherScene 
              src={src} 
              active={active} 
              hasAnimated={hasAnimated}
              onAnimationComplete={() => setHasAnimated(true)}
              skipAnimation={skipAnimation}
            />
          </React.Suspense>
        </Canvas>
      ) : (
        <div className="relative z-10 w-full h-full">
          <FallbackDitherImage src={src} className={className} />
        </div>
      )}
    </div>
  );
}
