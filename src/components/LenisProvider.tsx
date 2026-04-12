"use client";

import Snap from "lenis/snap";
import { ReactLenis, useLenis } from "lenis/react";
import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const SNAP_SECTION_ORDER = [
  "home",
  "work",
  "installed_chips",
  "projects",
  "hobbies",
  "contact",
] as const;

const snapEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function LenisSnapController() {
  const lenis = useLenis();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!lenis || isMobile) {
      return;
    }

    const sections = SNAP_SECTION_ORDER.map((sectionId) =>
      document.querySelector<HTMLElement>(`[data-snap-section="${sectionId}"]`)
    ).filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const snap = new Snap(lenis, {
      type: "proximity",
      duration: 0.8,
      easing: snapEasing,
      distanceThreshold: "18%",
      debounce: 120,
    });

    const removeSections = snap.addElements(sections, { align: "start" });

    return () => {
      removeSections();
      snap.destroy();
    };
  }, [isMobile, lenis]);

  return null;
}

export default function LenisProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();

  const options = React.useMemo(
    () => ({
      autoRaf: true,
      anchors: false,
      smoothWheel: true,
      syncTouch: isMobile,
      syncTouchLerp: isMobile ? 0.085 : 0.075,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      overscroll: true,
    }),
    [isMobile]
  );

  return (
    <ReactLenis root options={options}>
      {children}
      <LenisSnapController />
    </ReactLenis>
  );
}
