"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import PixelDivider from "@/components/PixelDivider";
import type { HobbyCard } from "./types";

type HobbyCardProps = {
  card: HobbyCard;
  cardIndex: number;
  isMobile: boolean;
  onExpand: () => void;
};

function HobbyCardComponent({ card, cardIndex, isMobile, onExpand }: HobbyCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  // Use useInView to reveal background as user scrolls into view on mobile
  const isCardInView = useInView(cardRef, { once: true, margin: "-20% 0px -20% 0px" });

  // Preload the full-size image for the expanded modal when card comes into view
  React.useEffect(() => {
    if (isCardInView && card.image) {
      const img = new window.Image();
      img.src = card.image;
    }
  }, [isCardInView, card.image]);

  return (
    <motion.div
      ref={cardRef}
      layoutId={`hobby-card-${cardIndex}`}
      onClick={onExpand}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_10px_rgba(0,0,0,0.1)] cursor-pointer h-[400px] lg:h-[480px]"
      whileHover={isMobile ? {} : { scale: 1.02 }}
      whileTap={isMobile ? {} : { scale: 0.98 }}
    >
      {/* Background Image - 100% visible on mobile when in view, hidden by default on desktop with hover reveal */}
      <motion.div
        className={`absolute inset-0 z-0 ${!isMobile ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-500' : ''}`}
        initial={isMobile ? { opacity: 0 } : false}
        animate={isMobile ? { opacity: isCardInView ? 1 : 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 560px"
            loading="lazy"
          />
          {/* Dark gradient overlay - darker on hover for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/70 to-[#0d0b08]/40 group-hover:from-[#0d0b08] group-hover:via-[#0d0b08]/80 group-hover:to-[#0d0b08]/50 transition-all duration-500" />
          {/* Scanline overlay */}
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        </div>
      </motion.div>

      {/* Corner brackets */}
      <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 z-20 transition-colors duration-300 ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/30 group-hover:border-white/60'}`} />
      <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 z-20 transition-colors duration-300 ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/30 group-hover:border-white/60'}`} />
      <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 z-20 transition-colors duration-300 ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/30 group-hover:border-white/60'}`} />
      <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 z-20 transition-colors duration-300 ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/30 group-hover:border-white/60'}`} />

      {/* Dark bar at bottom - only on desktop */}
      {!isMobile && <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0d0b08] z-[15]" />}

      {/* Pixel divider animation at bottom - only on desktop */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-96 z-10 overflow-hidden pointer-events-none">
          <PixelDivider
            color="#0d0b08"
            pixelSize={48}
            durationSec={10}
            rise="-250%"
            streamsPerCol={4}
            direction="up"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-20 h-full flex flex-col p-8">
        {/* Top row: Index left, Click hint right */}
        <div className="flex items-center justify-between">
          <div className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${isMobile && isCardInView ? 'text-white/50' : 'text-foreground/40 group-hover:text-white/50'}`}>
            [{String(cardIndex + 1).padStart(2, "0")}]
          </div>
          <div className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${isMobile && isCardInView ? 'text-white/40' : 'text-foreground/30 group-hover:text-white/40'}`}>
            Click to expand
          </div>
        </div>

        {/* Title + Items - slightly below center */}
        <div className="flex-1 flex flex-col justify-center pt-12">
          <h3 className={`font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight transition-colors duration-300 mb-4 ${isMobile && isCardInView ? 'text-white' : 'text-foreground group-hover:text-white'}`}>
            {card.title}
          </h3>

          {/* Items - NieR Automata UI style */}
          <div className="flex flex-wrap gap-2">
            {card.items.map((item, itemIndex) => (
              <span
                key={item}
                className={`relative inline-flex items-center text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 border transition-all duration-300 ${
                  isMobile && isCardInView
                    ? 'text-white/80 bg-white/[0.08] border-white/30'
                    : 'text-foreground/60 group-hover:text-white/80 bg-foreground/[0.03] group-hover:bg-white/[0.08] border-foreground/20 group-hover:border-white/30'
                }`}
              >
                {/* Corner accents */}
                <span className={`absolute top-0 left-0 w-1 h-1 border-t border-l ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/40 group-hover:border-white/60'}`} />
                <span className={`absolute top-0 right-0 w-1 h-1 border-t border-r ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/40 group-hover:border-white/60'}`} />
                <span className={`absolute bottom-0 left-0 w-1 h-1 border-b border-l ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/40 group-hover:border-white/60'}`} />
                <span className={`absolute bottom-0 right-0 w-1 h-1 border-b border-r ${isMobile && isCardInView ? 'border-white/60' : 'border-foreground/40 group-hover:border-white/60'}`} />

                {/* Index prefix */}
                <span className={`mr-1.5 ${isMobile && isCardInView ? 'text-white/40' : 'text-foreground/30 group-hover:text-white/40'}`}>{String(itemIndex + 1).padStart(2, "0")}</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent transition-colors duration-300 z-20 ${isMobile && isCardInView ? 'via-white/30' : 'via-foreground/20 group-hover:via-white/30'}`} />
    </motion.div>
  );
}

export default HobbyCardComponent;
