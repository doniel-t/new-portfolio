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
  isInViewOnce: boolean;
  onExpand: () => void;
};

function HobbyCardRow({ card, cardIndex, isMobile, isInViewOnce, onExpand }: HobbyCardRowProps) {
  const isEven = cardIndex % 2 === 0;

  return (
    <motion.div
      key={card.title}
      variants={{
        hidden: { opacity: 0, y: isMobile ? 0 : 30 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: isMobile ? 0.3 : 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: isMobile ? 0 : cardIndex * 0.15,
          },
        },
      }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isEven ? "" : "lg:direction-rtl"}`}
      style={!isEven ? { direction: "rtl" } : undefined}
    >
      {/* Card */}
      <div className="group relative" style={{ direction: "ltr" }}>
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
      </div>

      {/* Text Content Side */}
      <div className="flex flex-col justify-center space-y-6" style={{ direction: "ltr" }}>
        {/* Description */}
        <p className="text-lg lg:text-xl text-foreground/70 leading-relaxed">
          {card.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-foreground/10">
          {card.stats.map((stat, statIndex) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="font-bold font-mono text-xs tracking-widest text-muted uppercase mb-1">
                {stat.label}
              </div>
              <div className="font-display text-xl lg:text-2xl text-foreground">
                <DecodingWord
                  word={stat.value}
                  startDelayMs={isMobile ? 0 : (cardIndex * 150) + (statIndex * 80) + 500}
                  active={isInViewOnce}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quote (if exists) */}
        {card.quote && (
          <blockquote className="text-foreground/50 italic font-mono text-sm border-l-2 border-muted/30 pl-4">
            {card.quote}
          </blockquote>
        )}

        {/* Decorative element */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-px bg-muted/40" />
          <div className="w-2 h-2 rotate-45 border border-muted/40" />
          <div className="flex-1 h-px bg-gradient-to-r from-muted/20 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export default HobbyCardRow;
