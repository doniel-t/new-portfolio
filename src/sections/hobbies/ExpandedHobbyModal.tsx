"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import PixelDivider from "@/components/PixelDivider";
import type { HobbyCard } from "./types";

function LoadingSpinner() {
  return (
    <div className="relative w-10 h-10">
      <div
        className="absolute inset-0 border-2 border-muted/30 border-t-muted/80 rounded-full animate-spin"
        style={{ animationDuration: '0.8s' }}
      />
      <div
        className="absolute inset-1 border-2 border-muted/20 border-b-muted/60 rounded-full animate-spin"
        style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
      />
    </div>
  );
}

type ExpandedHobbyModalProps = {
  card: HobbyCard;
  cardIndex: number;
  totalCards: number;
  isMobile: boolean;
  onClose: () => void;
};

function ExpandedHobbyModal({ card, cardIndex, totalCards, isMobile, onClose }: ExpandedHobbyModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const isReady = imageLoaded && minTimeElapsed;

  // Minimum loading time of 0.5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Close on escape key and prevent scroll
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Solid black base - prevents white flicker */}
      <div className="fixed inset-0 z-50 bg-[#0d0b08] animate-[fadeIn_0.2s_ease-out]" />

      {/* Loading spinner - fades out when ready */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <LoadingSpinner />
      </div>

      {/* Backdrop with blurred card image - fades in on top of black base */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Blurred background image - small size since heavily blurred */}
        <Image
          src={card.image}
          alt=""
          fill
          className="object-cover scale-110 blur-3xl"
          sizes="384px"
          quality={25}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0d0b08]/70" />
      </div>

      {/* Expanded Content */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0d0b08] pointer-events-auto"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center  bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              priority
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/80 to-[#0d0b08]/50" />
            <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 z-20" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/40 z-20" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40 z-20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 z-20" />

          {/* Pixel animation at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 z-10 overflow-hidden pointer-events-none opacity-40">
            <PixelDivider
              color="#444"
              pixelSize={isMobile ? 12 : 48}
              durationSec={7}
              rise="-160%"
              streamsPerCol={3}
              direction="up"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            {/* Index tag */}
            <div className="font-mono text-sm tracking-widest text-white/50 uppercase mb-4">
              [{String(cardIndex + 1).padStart(2, "0")}] / {totalCards.toString().padStart(2, "0")}
            </div>

            <h2 className="font-display text-5xl sm:text-6xl lg:text-8xl tracking-tight text-white mb-6 drop-shadow-lg">
              {card.title}
            </h2>

            {/* Items list */}
            <div className="flex flex-wrap gap-3 mb-10">
              {card.items.map((item) => (
                <span
                  key={item}
                  className="inline-block text-sm font-mono text-white/90 bg-white/5 backdrop-blur-xl px-4 py-2 rounded border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Description */}
              <div>
                <p className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-8">
                  {card.description}
                </p>

                {/* Quote (if exists) */}
                {card.quote && (
                  <blockquote className="text-white/50 italic font-mono text-lg border-l-2 border-white/30 pl-6">
                    {card.quote}
                  </blockquote>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-6">
                <div className="font-mono text-xs tracking-widest text-white/40 uppercase">
                  Stats & Info
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center py-4 border-b border-white/10">
                      <span className="font-mono text-sm tracking-widest text-white/50 uppercase">
                        {stat.label}
                      </span>
                      <span className="font-display text-2xl lg:text-3xl text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="mt-12 flex items-center gap-4">
              <div className="w-12 h-px bg-white/30" />
              <div className="w-3 h-3 rotate-45 border border-white/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpandedHobbyModal;
