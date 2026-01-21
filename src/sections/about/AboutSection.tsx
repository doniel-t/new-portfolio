"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import DitherImage from "@/components/DitherImage";
import DotGrid from "@/components/DotGrid";
import BackgroundLineArt from "@/components/BackgroundLineArt";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getAboutVariants } from "./variants";
import LocalTimeClient from "./LocalTime";


const STACK_ITEMS = ["Next.js", "TypeScript", "Tailwind", "Go"];

const VIBE_EMOJIS = [
  "=w=",
  "o_o",
  "(●ω●)",
  "⊙﹏⊙∥",
  "( •̀ ω •́ )✧",
  "¯\\_(ツ)_/¯",
  "(⌐■_■)",
  "￣へ￣"
];

function useTypewriter(texts: string[], typeSpeed = 80, pauseDuration = 1500) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(true);

  React.useEffect(() => {
    const currentText = texts[currentIndex];

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause then clear
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      // Clear and move to next
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isTyping, currentIndex, texts, typeSpeed, pauseDuration]);

  return { displayedText, isTyping };
}

function InViewAboutBlock() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();
  const { bentoItemVariants, containerVariants } = getAboutVariants(isMobile);

  const { displayedText, isTyping } = useTypewriter(VIBE_EMOJIS, 100, 2000);

  return (
    <div ref={containerRef} className="mb-12 sm:mb-16">
      <motion.div
        initial="hidden"
        animate={isInViewOnce ? "show" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 lg:gap-8 auto-rows-[minmax(160px,auto)]"
      >
        {/* Main Image - Large cell spanning 2 cols and 2 rows */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-muted/10 bg-black/40 shadow-2xl min-h-[300px] md:min-h-[400px]"
        >
          <div className="absolute inset-0 z-0">
            <DitherImage src="/me crop.webp" active={isInViewOnce} className="w-full h-full absolute inset-0" skipAnimation={isMobile} />
          </div>
          <div className="absolute inset-0 pointer-events-none z-10 ring-1 ring-inset ring-white/10 rounded-2xl" />
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/40" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/40" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/40" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/40" />
        </motion.div>

        {/* Title Cell */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-2xl overflow-hidden border border-muted/10 bg-black/20 p-6 flex flex-col justify-center"
        >
          <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-muted/30" />
          <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-muted/30" />
          <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-muted/30" />
          <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-muted/30" />

          <p className="text-xs tracking-widest text-muted/60 font-mono uppercase mb-2">[01] Introduction</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-muted">
            <span className="inline-block" style={{ display: "inline-block" }}>
              Hi, im Daniel Theil
            </span>
          </h2>
        </motion.div>

        {/* Vibe Card */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-foreground/40">
            <span className={`w-2 h-2 ${isTyping ? 'bg-foreground/70 animate-pulse' : 'bg-foreground/30'}`} />
            <span>{isTyping ? 'TYPING' : 'IDLE'}</span>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80">
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">VIBE</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x02]</span>
            </div>

            <div className="min-h-[48px] flex items-center justify-center">
              <span className="font-mono text-2xl sm:text-3xl md:text-4xl text-foreground font-bold tracking-wide whitespace-nowrap">
                {displayedText}
                <span className="inline-block w-[3px] h-[1.1em] bg-foreground/80 ml-1 animate-pulse align-middle" />
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">MOOD_CYCLE: {VIBE_EMOJIS.length} STATES</span>
              <div className="flex gap-[2px]">
                {VIBE_EMOJIS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-[4px] h-[4px] ${displayedText === VIBE_EMOJIS[i] || (displayedText.length > 0 && VIBE_EMOJIS[i].startsWith(displayedText)) ? 'bg-foreground/80' : 'bg-foreground/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] group"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right data readout */}
          <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-foreground/40">
            <div className="flex gap-[2px]">
              <span className="w-[3px] h-[8px] bg-foreground/60" />
              <span className="w-[3px] h-[6px] bg-foreground/40 mt-[2px]" />
              <span className="w-[3px] h-[10px] bg-foreground/70" />
              <span className="w-[3px] h-[5px] bg-foreground/30 mt-[3px]" />
            </div>
            <span>87%</span>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80">
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">PROFILE</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x01]</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground font-medium tracking-wide mb-3">
              I&apos;m a fullstack engineer creating software for the love of the game. <br></br> <span className="font-normal">I&apos;ve been coding for 5 years as hobby and 2 years professionally.</span>
            </p>

            {/* Progress bar UI element */}
            <div className="mb-3">
              
            </div>

            {/* Bottom hex decoration */}
            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">0xDEV_PROFILE_v2.4</span>
              <span className="font-mono text-[8px] text-foreground/20">■■□</span>
            </div>
          </div>
        </motion.div>

        {/* Stack Card */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="w-[4px] h-[4px] bg-foreground/70" />
            <span className="w-[4px] h-[4px] bg-foreground/70" />
            <span className="w-[4px] h-[4px] bg-foreground/70" />
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80">
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">CORE STACK</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x02]</span>
            </div>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {STACK_ITEMS.map((t, i) => (
                <span
                  key={t}
                  className="inline-flex items-center border-2 border-foreground/80 bg-foreground/5 px-3 py-1.5 font-mono text-[11px] tracking-wider text-foreground font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <span className="text-[8px] mr-1.5 opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">TECH_STACK_ARRAY[{STACK_ITEMS.length}]</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-[6px] h-[2px] bg-foreground/40" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work Experience Card - 2 rows tall */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 md:row-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right timestamp */}
          <div className="absolute top-2 right-2 font-mono text-[8px] text-foreground/30 tracking-wider">
            2025.01.21
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80 h-full flex flex-col">
            <div className="mb-5 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">EXPERIENCE</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x03]</span>
            </div>
            <div className="space-y-6 flex-1">
              <div className="relative pl-4 border-l-[3px] border-foreground/90">
                <div className="absolute left-[-6px] top-0 w-[9px] h-[9px] bg-foreground border-2 border-muted animate-pulse" />
                <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[12px] text-foreground font-bold tracking-wide">Fullstack Engineer</span>
                  <span className="inline-flex items-center border-2 border-foreground bg-foreground/90 text-muted px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="font-mono text-[11px] text-foreground/70 mb-1">Komma-D  <span className="text-foreground/70 text-[11px]">(1.5 years)</span></p>
                <p className="font-mono text-[10px] text-foreground/60 tracking-wide mt-2 mb-1">
                  <span className="text-foreground/40 mr-1">→</span>
                  {["Multi-tenant NextJS", "DevOps", "LLM-Chatbots"].join(" / ")}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="font-mono text-[9px] text-foreground/50 tracking-wider">STATUS: ONGOING</p>
                  <div className="flex-1 h-[4px] bg-foreground/20 relative max-w-[100px] overflow-hidden">
                    <div
                      className="absolute inset-y-0 w-1/2 bg-foreground/70"
                      style={{ animation: 'loading 1.5s ease-in-out infinite' }}
                    />
                  </div>
                </div>
              </div>
              <div className="relative pl-4 border-l-[3px] border-foreground/50">
                <div className="absolute left-[-6px] top-0 w-[9px] h-[9px] bg-foreground/60 border-2 border-muted" />
                <p className="font-mono text-[12px] text-foreground font-bold tracking-wide mb-1.5">Intern Software Engineer <span className="text-foreground/70 text-[11px]">(0.5 years)</span></p>
                <p className="font-mono text-[11px] text-foreground/70 mb-1">ASAP <span className="text-foreground/70 text-[11px]">(0.5 years)</span></p>
                <p className="font-mono text-[10px] text-foreground/60 tracking-wide mt-2 mb-1">
                  <span className="text-foreground/40 mr-1">→</span>
                  {["Image Detection", "Kotlin App"].join(" / ")}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="font-mono text-[8px] text-foreground/40 tracking-wider">STATUS: COMPLETED</p>
                  <span className="font-mono text-[8px] text-foreground/30">✓</span>
                </div>
              </div>
              <div className="relative pl-4 border-l-[3px] border-foreground/50">
                <div className="absolute left-[-6px] top-0 w-[9px] h-[9px] bg-foreground/60 border-2 border-muted" />
                <p className="font-mono text-[12px] text-foreground font-bold tracking-wide mb-1.5">Working Student Software Engineer <span className="text-foreground/70 text-[11px]">(0.5 years)</span></p>
                <p className="font-mono text-[11px] text-foreground/70 mb-1">eSolutions <span className="text-foreground/70 text-[11px]">(0.5 years)</span></p>
                <p className="font-mono text-[10px] text-foreground/60 tracking-wide mt-2 mb-1">
                  <span className="text-foreground/40 mr-1">→</span>
                  {["Internal Tooling", "Go", "Angular"].join(" / ")}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="font-mono text-[8px] text-foreground/40 tracking-wider">STATUS: COMPLETED</p>
                  <span className="font-mono text-[8px] text-foreground/30">✓</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">EXPERIENCE_LOG_COUNT: 03</span>
              <span className="font-mono text-[8px] text-foreground/20">▓▓░</span>
            </div>
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right geo icon */}
          <div className="absolute top-2 right-2 flex flex-col gap-[2px]">
            <div className="flex gap-[2px]">
              <span className="w-[3px] h-[3px] border border-foreground/40" />
              <span className="w-[3px] h-[3px] bg-foreground/60" />
            </div>
            <div className="flex gap-[2px]">
              <span className="w-[3px] h-[3px] bg-foreground/60" />
              <span className="w-[3px] h-[3px] border border-foreground/40" />
            </div>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80">
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">LOCATION</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x04]</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[8px] text-foreground/50 tracking-wider">REGION:</span>
                <p className="font-mono text-[13px] text-foreground font-bold tracking-wide">Bavaria, Germany</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[8px] text-foreground/50 tracking-wider">LOCAL TIME:</span>
                <LocalTimeClient />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">COORD_SYS: EU_CENTRAL</span>
              <div className="flex gap-[1px]">
                <span className="w-[2px] h-[8px] bg-foreground/30" />
                <span className="w-[2px] h-[6px] bg-foreground/20 mt-[2px]" />
                <span className="w-[2px] h-[10px] bg-foreground/40" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          variants={bentoItemVariants}
          className="relative col-span-1 md:col-span-2 rounded-none overflow-hidden border-2 border-foreground/90 bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Glitch corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-[3px] border-t-[3px] border-foreground" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-[3px] border-t-[3px] border-foreground" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[3px] border-b-[3px] border-foreground" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[3px] border-b-[3px] border-foreground" />

          {/* Top right data grid */}
          <div className="absolute top-2 right-2 grid grid-cols-3 gap-[2px]">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-[3px] h-[3px] bg-foreground/40" />
            ))}
          </div>

          <div className="relative p-6 bg-gradient-to-br from-muted via-muted to-muted/80">
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/90 flex items-center gap-2 font-bold">
              <span className="inline-block h-[8px] w-[8px] bg-foreground animate-pulse" />
              <span className="border border-foreground/40 px-2 py-0.5 bg-foreground/5">STATS</span>
              <span className="ml-auto font-mono text-[9px] opacity-40">[0x05]</span>
            </div>
            <div className="grid grid-cols-2 gap-5 text-foreground">
              <div className="border-l-2 border-foreground/60 pl-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-[9px] text-foreground/50 uppercase tracking-[0.15em]">Age</p>
                  <span className="font-mono text-[7px] text-foreground/30">●</span>
                </div>
                <p className="font-mono text-[15px] font-bold">25</p>
              </div>
              <div className="border-l-2 border-foreground/60 pl-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-[9px] text-foreground/50 uppercase tracking-[0.15em]">Gender</p>
                  <span className="font-mono text-[7px] text-foreground/30">●</span>
                </div>
                <p className="font-mono text-[15px] font-bold">Male</p>
              </div>
              <div className="border-l-2 border-foreground/60 pl-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-[9px] text-foreground/50 uppercase tracking-[0.15em]">Status</p>
                  <span className="font-mono text-[7px] text-foreground/30">●</span>
                </div>
                <p className="font-mono text-[15px] font-bold flex items-center gap-2">
                  <span className="dot-led" /> Open
                </p>
              </div>
              <div className="border-l-2 border-foreground/60 pl-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-[9px] text-foreground/50 uppercase tracking-[0.15em]">Languages</p>
                  <span className="font-mono text-[7px] text-foreground/30">●</span>
                </div>
                <p className="font-mono text-[15px] font-bold">EN / DE</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-foreground/20 flex items-center justify-between">
              <span className="font-mono text-[8px] text-foreground/30 tracking-wider">DATA_FIELDS: 04 | INTEGRITY: 100%</span>
              <div className="flex items-center gap-1">
                <span className="w-[6px] h-[6px] border border-foreground/30" />
                <span className="w-[6px] h-[6px] bg-foreground/60" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Pixelated divider overlay (no extra layout height) */}
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#0d0b08"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
          />
        </div>
      </div>

      <section id="work" className="relative w-full py-20 sm:py-28">
        <div className="absolute inset-0 -z-10" style={{ backgroundColor: "var(--dark)" }} />
        {/* DotGrid background */}
        <div className="absolute inset-0 -z-10 opacity-60" aria-hidden>
          <DotGrid
            baseColor="#6c673b"
            dotSize={1.5}
            gap={24}
            className="w-full h-full"
          />
        </div>
        {/* Geometric line art background */}
        <BackgroundLineArt className="-z-0" />
        {/* Blueprint rim lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 12px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) calc(100% - 12px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 0 12px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 0 calc(100% - 12px) / 100% 1px no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 36px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) calc(100% - 36px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 0 36px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 0 calc(100% - 36px) / 100% 1px no-repeat",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-8">
          <InViewAboutBlock />
        </div>
      </section>
    </>
  );
}
