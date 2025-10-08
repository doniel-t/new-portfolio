"use client";

import { motion } from "framer-motion";
import React from "react";

type BackgroundLineArtProps = {
  className?: string;
};

const loopLinear = (duration: number) => ({
  duration,
  ease: [0.37, 0, 0.63, 1] as const,
  repeat: Infinity,
  repeatType: "reverse" as const,
});

export default function BackgroundLineArt({ className }: BackgroundLineArtProps) {
  return (
    <div className={"pointer-events-none absolute inset-0 z-0 " + (className ?? "")}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full text-muted opacity-40"
      >
        {/* Huge circle on the right side (centered off-canvas to the right). Single moving arc segment */}
        <motion.circle
          cx="120"
          cy="38"
          r="62"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 1, pathSpacing: 0.5, pathOffset: 0 }}
          animate={{ pathLength: 1, pathSpacing: 0.5, pathOffset: 1 }}
          transition={loopLinear(16)}
        />

        {/* Diagonal lines across the canvas */}
        <motion.path
          d="M -10 82 L 110 22"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.4}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.85, pathSpacing: 0.15, pathOffset: 0 }}
          animate={{ pathLength: 0.85, pathSpacing: 0.15, pathOffset: 1 }}
          transition={loopLinear(10)}
        />

        <motion.path
          d="M -6 94 L 106 54"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.35}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.7, pathSpacing: 0.3, pathOffset: 0 }}
          animate={{ pathLength: 0.7, pathSpacing: 0.3, pathOffset: 1 }}
          transition={loopLinear(11.5)}
        />

        {/* Fine straight guides */}
        <motion.line
          x1="6"
          y1="18"
          x2="96"
          y2="18"
          stroke="currentColor"
          strokeWidth={0.3}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.6, pathSpacing: 0.4, pathOffset: 0 }}
          animate={{ pathLength: 0.6, pathSpacing: 0.4, pathOffset: 1 }}
          transition={loopLinear(8.5)}
        />


        <motion.line
          x1="8"
          y1="12"
          x2="8"
          y2="92"
          stroke="currentColor"
          strokeWidth={0.3}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.5, pathSpacing: 0.5, pathOffset: 0 }}
          animate={{ pathLength: 0.5, pathSpacing: 0.5, pathOffset: 1 }}
          transition={loopLinear(7.8)}
        />

        {/* Subtle angled accent near bottom-right */}
        <motion.path
          d="M 60 86 L 108 66"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.35}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.65, pathSpacing: 0.35, pathOffset: 0 }}
          animate={{ pathLength: 0.65, pathSpacing: 0.35, pathOffset: 1 }}
          transition={loopLinear(8.2)}
        />
      </svg>
    </div>
  );
}


