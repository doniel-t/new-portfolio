"use client";

import { useState, useEffect, useCallback } from 'react';

export type GPUSupport = 'full' | 'limited' | 'none';

interface GPUInfo {
  support: GPUSupport;
  vendor: string;
  renderer: string;
}

let cachedGPUInfo: GPUInfo | null = null;

async function detectGPU(): Promise<GPUInfo> {
  if (cachedGPUInfo) {
    return cachedGPUInfo;
  }

  if (typeof window === 'undefined') {
    cachedGPUInfo = { support: 'none', vendor: '', renderer: '' };
    return cachedGPUInfo;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      cachedGPUInfo = { support: 'none', vendor: '', renderer: '' };
      return cachedGPUInfo;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

      const isIntelIntegrated = /Intel/i.test(renderer) && !/NVIDIA|AMD|Radeon/i.test(renderer);
      const isLowEnd = /Swift|S3|Trident|GeForce\s?[89]|Radeon\s?[HD]\d{3}/i.test(renderer);
      const isSoftwareRenderer = /Software|llvmpipe|swiftshader/i.test(renderer);

      if (isSoftwareRenderer) {
        cachedGPUInfo = { support: 'none', vendor, renderer };
      } else if (isIntelIntegrated || isLowEnd) {
        cachedGPUInfo = { support: 'limited', vendor, renderer };
      } else {
        cachedGPUInfo = { support: 'full', vendor, renderer };
      }

      return cachedGPUInfo;
    }

    cachedGPUInfo = { support: 'limited', vendor: 'Unknown', renderer: 'Unknown' };
    return cachedGPUInfo;
  } catch {
    cachedGPUInfo = { support: 'none', vendor: '', renderer: '' };
    return cachedGPUInfo;
  }
}

export function useGPUDetection(): GPUSupport {
  const [gpuSupport, setGPUSupport] = useState<GPUSupport>('full');

  useEffect(() => {
    let mounted = true;

    detectGPU().then((info) => {
      if (mounted) {
        setGPUSupport(info.support);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return gpuSupport;
}

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}

export function useAnimationControls(gpuSupport: GPUSupport, options?: {
  preferReducedMotion?: boolean;
  forceEnabled?: boolean;
}) {
  const isPageVisible = usePageVisibility();
  const prefersReducedMotion = options?.preferReducedMotion ?? false;

  const shouldRun = useCallback(() => {
    if (options?.forceEnabled) return true;
    if (!isPageVisible) return false;
    if (prefersReducedMotion) return false;
    if (gpuSupport === 'none') return false;
    return true;
  }, [gpuSupport, isPageVisible, prefersReducedMotion, options?.forceEnabled]);

  return { shouldRun, gpuSupport, isPageVisible, prefersReducedMotion };
}

export const gpuUtils = {
  isGPUSupported: (): boolean => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  },
  
  getGPUInfo: detectGPU,
};
