"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Dither from "@/components/Dither";
import PixelDivider from "@/components/PixelDivider";
import type { HobbyCard } from "./types";

type ExpandedHobbyModalProps = {
  card: HobbyCard;
  cardIndex: number;
  totalCards: number;
  isMobile: boolean;
  onClose: () => void;
};

function ExpandedHobbyModal({ card, cardIndex, totalCards, isMobile, onClose }: ExpandedHobbyModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <>
      {/* Background layer */}
      <div
        onClick={onClose}
        data-lenis-prevent
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <Image
          src={card.image}
          alt=""
          fill
          className="object-cover scale-110 blur-3xl"
          sizes="384px"
          quality={25}
        />
        <div className="absolute inset-0 bg-[#0d0b08]/70" />
        {!isMobile && (
          <div className="absolute inset-0 opacity-[0.16] pointer-events-none">
            <Dither
              waveColor={[165 / 100, 158 / 100, 141 / 100]}
              disableAnimation={false}
              enableMouseInteraction={false}
              colorNum={2}
              waveAmplitude={0.002}
              waveFrequency={1.5}
              waveSpeed={0.05}
            />
          </div>
        )}
      </div>

      {/* Content panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <div
          data-lenis-prevent
          className="relative w-full max-w-5xl h-[78vh] sm:h-[82vh] overflow-hidden border border-white/20 bg-[#0d0b08]/95 text-[#d4cdc4] pointer-events-auto"
        >
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[2px] bg-[#d4cdc4]/80 z-20"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/18 text-[#d4cdc4] transition-colors border border-[#d4cdc4]/30"
          >
            <X size={18} />
          </button>

          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover opacity-[0.14]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b08]/55 via-[#0d0b08]/82 to-[#0d0b08]/96" />
            <div className="absolute inset-0 scanlines opacity-15" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="relative h-[130px] sm:h-[170px] lg:h-[195px] w-full overflow-hidden border-b border-[#d4cdc4]/20 bg-black">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 920px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08]/90 via-[#0d0b08]/45 to-[#0d0b08]/15" />
              <div className="absolute inset-0 scanlines opacity-20" />
            </div>

            <div
              data-lenis-prevent
              className="relative flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 pt-6 pb-20"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#d4cdc4]/55 uppercase">
                  [NODE_{String(cardIndex + 1).padStart(2, "0")}] / {String(totalCards).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#d4cdc4]/35 to-transparent" />
                <span className="hidden sm:inline font-mono text-[10px] tracking-[0.18em] uppercase text-[#7a9a5a]/70">
                  Expanded Feed
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight text-[#d4cdc4] mb-4">
                {card.title}
              </h2>

              <p className="text-base sm:text-lg text-[#d4cdc4]/78 leading-relaxed max-w-3xl">
                {card.description}
              </p>

              <div className="mt-5 border-l border-[#d4cdc4]/35 pl-4 max-w-3xl">
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#d4cdc4]/48 mb-2">
                  Expanded Notes
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#d4cdc4]/72">
                  {card.expandedText}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                {card.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center border border-white/80 bg-white/95 px-2.5 py-[3px] font-mono font-semibold text-[9px] tracking-[0.1em] uppercase text-[#0d0b08]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 max-w-2xl">
                <p className="font-mono font-semibold text-[10px] tracking-[0.18em] uppercase text-[#d4cdc4]/50 mb-3">
                  Stats + Signals
                </p>
                <div className="space-y-3">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className="flex items-end gap-3 sm:gap-4">
                      <span className="min-w-[120px] sm:min-w-[150px] font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase text-[#d4cdc4]/58">
                        {stat.label}
                      </span>
                      <span className="h-px w-24 sm:w-32 bg-[#d4cdc4]/22 mb-[6px]" />
                      <span className="font-display text-lg sm:text-xl text-[#d4cdc4] leading-none">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {card.quote ? (
                <blockquote className="mt-8 border-l border-[#d4cdc4]/45 pl-4 font-mono text-sm sm:text-base italic text-[#d4cdc4]/65">
                  {card.quote}
                </blockquote>
              ) : null}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 z-10 overflow-hidden pointer-events-none opacity-45">
            <PixelDivider
              color="#d4cdc4"
              pixelSize={isMobile ? 10 : 16}
              durationSec={7.2}
              rise="-170%"
              streamsPerCol={2}
              direction="up"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpandedHobbyModal;
