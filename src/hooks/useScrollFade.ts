"use client";

import { useEffect, useRef } from "react";

// Shared scroll-driven fade for elements that should fade in as they enter the
// viewport and fade out as they leave. Replaces the per-element useScroll +
// useTransform pattern (each instance set up its own scroll subscription and
// triggered React reconciliation on every frame). All registered elements
// share a single rAF-throttled scroll listener and opacity is written
// directly to the DOM — no React renders.

type Subscriber = {
  el: HTMLElement;
};

const subscribers = new Set<Subscriber>();
let rafId = 0;
let listenersAttached = false;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeOpacity(rect: DOMRect, vh: number): number {
  // Mirror the previous useScroll([0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]) curve.
  // Progress is 0 when the element's top is at the bottom of the viewport
  // and 1 when its bottom has scrolled past the top.
  const span = rect.height + vh;
  if (span <= 0) return 1;
  const progress = clamp((vh - rect.top) / span, 0, 1);
  if (progress < 0.2) return 0.2 + (progress / 0.2) * 0.8;
  if (progress < 0.8) return 1;
  return 1 - ((progress - 0.8) / 0.2) * 0.8;
}

function tick() {
  rafId = 0;
  if (subscribers.size === 0) return;
  const vh = window.innerHeight;
  for (const sub of subscribers) {
    const rect = sub.el.getBoundingClientRect();
    sub.el.style.opacity = String(computeOpacity(rect, vh));
  }
}

function schedule() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(tick);
}

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function detachListenersIfIdle() {
  if (subscribers.size > 0) return;
  if (!listenersAttached) return;
  listenersAttached = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    attachListeners();
    const sub: Subscriber = { el };
    subscribers.add(sub);
    schedule();

    return () => {
      subscribers.delete(sub);
      detachListenersIfIdle();
    };
  }, []);

  return ref;
}
