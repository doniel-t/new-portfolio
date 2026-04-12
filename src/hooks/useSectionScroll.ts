"use client";

import { useLenis } from "lenis/react";
import React from "react";

type ScrollAlign = "start" | "center" | "end";

type SectionScrollOptions = {
  align?: ScrollAlign;
  duration?: number;
  force?: boolean;
  immediate?: boolean;
  lock?: boolean;
  offset?: number;
  onComplete?: () => void;
};

type ScrollTarget = HTMLElement | string;

const DEFAULT_SCROLL_DURATION = 1;

function resolveTarget(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target !== "string") {
    return target;
  }

  if (target === "top" || target === "#") {
    return 0;
  }

  if (target.startsWith("#")) {
    return document.querySelector<HTMLElement>(target);
  }

  return document.getElementById(target) ?? document.querySelector<HTMLElement>(target);
}

function getAlignedTargetPosition(
  target: HTMLElement,
  align: ScrollAlign,
  offset: number,
  currentScroll: number
) {
  const rect = target.getBoundingClientRect();
  const baseTop = currentScroll + rect.top;

  if (align === "center") {
    return baseTop - (window.innerHeight - rect.height) / 2 + offset;
  }

  if (align === "end") {
    return baseTop - (window.innerHeight - rect.height) + offset;
  }

  return baseTop + offset;
}

export function useSectionScroll() {
  const lenis = useLenis();

  return React.useCallback(
    (target: ScrollTarget, options: SectionScrollOptions = {}) => {
      if (typeof window === "undefined") {
        return;
      }

      const resolvedTarget = resolveTarget(target);

      if (resolvedTarget === null) {
        return;
      }

      const {
        align = "start",
        duration = DEFAULT_SCROLL_DURATION,
        force = false,
        immediate = false,
        lock = false,
        offset = 0,
        onComplete,
      } = options;

      const currentScroll =
        typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;

      if (lenis) {
        const lenisTarget =
          typeof resolvedTarget === "number"
            ? resolvedTarget + offset
            : getAlignedTargetPosition(resolvedTarget, align, offset, currentScroll);

        lenis.scrollTo(lenisTarget, {
          duration,
          force,
          immediate,
          lock,
          onComplete,
        });
        return;
      }

      if (typeof resolvedTarget === "number") {
        window.scrollTo({
          top: resolvedTarget + offset,
          behavior: "smooth",
        });
        return;
      }

      resolvedTarget.scrollIntoView({
        behavior: "smooth",
        block: align,
      });
    },
    [lenis]
  );
}
