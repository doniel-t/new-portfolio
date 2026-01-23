"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import DecodingWord from "@/components/DecodingWord";
import HobbyCard from "./HobbyCard";
import type { HobbyCard as HobbyCardType } from "./types";

type HobbyCardRowProps = {
  card: HobbyCardType;
  cardIndex: number;
  isMobile: boolean;
  onExpand: () => void;
};

function HobbyCardRow({ card, cardIndex, isMobile, onExpand }: HobbyCardRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const isRowInView = useInView(rowRef, { once: true, margin: "-15% 0px -15% 0px" });
  
  // Alternating layout: even = IMAGE on left, TEXT on right
  // odd = TEXT on left, IMAGE on right
  const isImageFirst = cardIndex % 2 === 0;

  // Text content component
  const TextContent = (
    <motion.div
      className="relative px-6 lg:px-12 py-4"
      initial={{ opacity: 0, x: isImageFirst ? 30 : -30 }}
      animate={isRowInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isImageFirst ? 30 : -30 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* Minimal NieR-style container */}
      <div className="relative">
        {/* Corner brackets - subtle */}
        <div className="absolute -top-4 -left-4 w-3 h-3 border-t border-l border-foreground/20" />
        <div className="absolute -top-4 -right-4 w-3 h-3 border-t border-r border-foreground/20" />
        <div className="absolute -bottom-4 -left-4 w-3 h-3 border-b border-l border-foreground/20" />
        <div className="absolute -bottom-4 -right-4 w-3 h-3 border-b border-r border-foreground/20" />

        {/* Content */}
        <div className="space-y-5">
          {/* Header line with index */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-foreground/50" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-foreground/30 animate-ping" />
            </div>
            <span className="font-mono text-[10px] text-foreground/40 tracking-[0.2em]">
              [{String(cardIndex + 1).padStart(2, "0")}]
            </span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          {/* Title */}
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
            {card.title}
          </h3>

          {/* Description */}
          <p className="text-base text-foreground/60 leading-relaxed">
            {card.description}
          </p>

          {/* Stats - inline compact style */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
            {card.stats.map((stat, statIndex) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="font-mono text-[9px] tracking-[0.1em] text-foreground/40 uppercase">
                  {stat.label}
                </span>
                <span className="font-display text-lg text-foreground">
                  <DecodingWord
                    word={stat.value}
                    startDelayMs={isMobile ? 0 : (cardIndex * 150) + (statIndex * 80) + 500}
                    active={isRowInView}
                  />
                </span>
              </div>
            ))}
          </div>

          {/* Quote (if exists) */}
          {card.quote && (
            <div className="flex items-stretch gap-3 pt-1">
              <div className="w-1 bg-foreground/80 shrink-0" />
              <blockquote className="text-foreground/50 italic font-mono text-sm leading-relaxed py-1">
                {card.quote}
              </blockquote>
            </div>
          )}

          {/* Minimal footer */}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-1.5 h-1.5 border border-foreground/20" />
            <div className="w-6 h-px bg-foreground/15" />
            <span className="font-mono text-[8px] text-foreground/20 tracking-widest">
              END_{String(cardIndex + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Card content component
  const CardContent = (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, x: isImageFirst ? -30 : 30 }}
      animate={isRowInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isImageFirst ? -30 : 30 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image-sensitive shadow - scaled, blurred duplicate */}
      <div className="absolute inset-x-4 inset-y-1 z-0 opacity-0 group-hover:opacity-25 group-hover:saturate-200 transition-opacity duration-500 scale-x-[1.15] scale-y-[1.10] pointer-events-none blur-md">
        <div className="relative w-full h-full">
          <Image
            src={card.image}
            alt=""
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 560px"
            loading="lazy"
          />
        </div>
      </div>

      <HobbyCard
        card={card}
        cardIndex={cardIndex}
        isMobile={isMobile}
        onExpand={onExpand}
      />
    </motion.div>
  );

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center"
    >
      {/* Render in order based on alternating pattern */}
      {isImageFirst ? (
        <>
          {CardContent}
          {TextContent}
        </>
      ) : (
        <>
          {TextContent}
          {CardContent}
        </>
      )}
    </div>
  );
}

export default HobbyCardRow;
