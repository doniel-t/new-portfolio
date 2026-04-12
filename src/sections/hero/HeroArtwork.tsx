"use client";

import Image from "next/image";
import PixelTransition from "@/components/PixelTransition";

type HeroArtworkProps = {
  isMobile: boolean;
};

export default function HeroArtwork({ isMobile }: HeroArtworkProps) {
  return (
    <div className="relative mx-auto w-full max-w-[40rem]">
      <div
        aria-hidden
        className="absolute -left-3 top-[12%] bottom-[16%] w-px bg-[#A69F8D]/16"
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 h-14 w-14 border-r border-t border-[#A69F8D]/18"
      />
      <div
        aria-hidden
        className="absolute -right-5 bottom-10 h-24 w-24 border border-[#A69F8D]/10"
      />
      <div
        aria-hidden
        className="absolute -left-7 bottom-14 h-10 w-10 border border-[#A69F8D]/8"
      />
      <div
        aria-hidden
        className="absolute inset-x-8 top-10 bottom-8 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_50%_35%,rgba(166,159,141,0.18),transparent_62%)] blur-3xl"
      />

      <div className="relative">
        <PixelTransition
          className="opacity-[0.94] shadow-[0_18px_52px_rgba(13,11,8,0.14)]"
          gridSize={isMobile ? 13 : 24}
          pixelColor="#1C1303"
          animationStepDuration={isMobile ? 0.5 : 0.72}
          startActive
          aspectRatio={isMobile ? "126%" : "118%"}
          autoplayReveal
          autoplayDelayMs={isMobile ? 0 : 150}
          firstContent={
            <div className="relative h-full w-full overflow-hidden bg-[#e7dfcf]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.08)_38%,rgba(13,11,8,0.08)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-[14%] w-px bg-[#1C1303]/6"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-[18%] h-px bg-[#1C1303]/7"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-[22%] h-px bg-[#1C1303]/6"
              />

              <Image
                src="/kino crop.png"
                alt="Kino"
                fill
                priority
                sizes="(min-width: 1024px) 40rem, 92vw"
                className="object-cover object-[72%_48%] mix-blend-multiply opacity-[0.9] contrast-[0.98] saturate-[0.4] brightness-[0.98] scale-[1.02]"
              />

              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(231,223,207,0.08)_0%,rgba(231,223,207,0.02)_52%,rgba(13,11,8,0.12)_100%)]"
              />
              <div aria-hidden className="absolute inset-0 dither-mask opacity-[0.18]" />
              <div aria-hidden className="absolute inset-0 scanlines opacity-[0.05]" />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(231,223,207,0)_0%,rgba(231,223,207,0.08)_38%,rgba(13,11,8,0.22)_100%)]"
              />
            </div>
          }
          secondContent={
            <div className="h-full w-full bg-[#1C1303]">
              <div aria-hidden className="h-full w-full tile-grid opacity-38" />
            </div>
          }
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-center justify-between"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#A69F8D]/72">
            Modern Motion
          </span>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-[#A69F8D]/24" />
            <span className="h-2 w-2 bg-[#A69F8D]/76" />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-6"
        >
          <div className="border-t border-[#A69F8D]/18 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#A69F8D]/66">
              Kino
            </p>
          </div>

          <div className="hidden items-end gap-3 sm:flex">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#A69F8D]/56">
              Selection
            </span>
            <span className="h-8 w-px bg-[#A69F8D]/16" />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-20 hidden lg:flex"
        >
          <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.28em] text-[#A69F8D]/46 [writing-mode:vertical-rl]">
            Quiet detail
          </span>
        </div>
      </div>
    </div>
  );
}
