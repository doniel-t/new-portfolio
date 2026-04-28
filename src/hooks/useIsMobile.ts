import { useState, useEffect } from 'react';

function checkMobile() {
  if (typeof window === 'undefined') return false;
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(checkMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

