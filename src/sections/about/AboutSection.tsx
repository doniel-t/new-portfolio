"use client";

import React from "react";
import BackgroundLineArt from "@/components/BackgroundLineArt";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import LocalTimeClient from "./LocalTime";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { IconType } from "react-icons";
import { FaBriefcase, FaChartBar, FaCode, FaMapMarkerAlt, FaRegAddressCard, FaSignal, FaUser } from "react-icons/fa";
import { SiGo, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";


const STACK_ITEMS: { label: string; icon: IconType }[] = [
  { label: "Next.js", icon: SiNextdotjs },
  { label: "TypeScript", icon: SiTypescript },
  { label: "Tailwind", icon: SiTailwindcss },
  { label: "Go", icon: SiGo },
];

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

const EXPERIENCE_ITEMS = [
  {
    role: "Fullstack Engineer",
    company: "Komma-D",
    duration: "1.5 years",
    status: "ONGOING",
    badge: "ACTIVE",
    focus: ["Multi-tenant NextJS", "DevOps", "LLM-Chatbots"],
  },
  {
    role: "Intern Software Engineer",
    company: "ASAP",
    duration: "0.5 years",
    status: "COMPLETED",
    badge: "LOGGED",
    focus: ["Image Detection", "Kotlin App"],
  },
  {
    role: "Working Student Software Engineer",
    company: "eSolutions",
    duration: "0.5 years",
    status: "COMPLETED",
    badge: "LOGGED",
    focus: ["Internal Tooling", "Go", "Angular"],
  },
] as const;

const STATS_ITEMS = [
  ["Age", "25"],
  ["Gender", "Male"],
  ["Status", "Open"],
  ["Languages", "🇬🇧\u00A0/\u00A0🇩🇪"],
] as const;

const SCANLINE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,205,196,0.04) 2px, rgba(212,205,196,0.04) 4px)",
};

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

function FrameTicks({ className = "border-[#d4cdc4]/50" }: { className?: string }) {
  return (
    <>
      <span className={`absolute left-0 top-0 hidden h-5 w-5 border-l border-t sm:block ${className}`} />
      <span className={`absolute right-0 top-0 hidden h-5 w-5 border-r border-t sm:block ${className}`} />
      <span className={`absolute bottom-0 left-0 hidden h-5 w-5 border-b border-l sm:block ${className}`} />
      <span className={`absolute bottom-0 right-0 hidden h-5 w-5 border-b border-r sm:block ${className}`} />
    </>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: IconType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[12px] uppercase text-[#d4cdc4]/40 font-semibold">
      <Icon className="h-3.5 w-3.5 text-[#7a9a5a]" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

function ScrollFadeBlock({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity }}>
      {children}
    </motion.div>
  );
}

function PortraitStamp() {
  return (
    <figure className="relative w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[300px]">
      <div className="relative aspect-[3/4] overflow-hidden border border-[#d4cdc4]/25">
        <Image
          alt="Daniel Theil pixel portrait"
          src="/me crop pixel.png"
          fill
          priority={false}
          sizes="(min-width: 1024px) 300px, 260px"
          className="object-cover object-center grayscale-[30%] saturate-[0.78] contrast-[1.08] brightness-[0.94]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,8,0)_35%,rgba(13,11,8,0.68)_100%)]" />
        <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={SCANLINE_STYLE} />
        <FrameTicks />
      </div>
      <ScrollFadeBlock className="mt-3 flex items-center justify-between gap-3 pb-3 font-mono text-[10px] uppercase text-[#d4cdc4]/60 sm:border-b sm:border-[#d4cdc4]/20">
        <span>PORTRAIT_FEED</span>
        <span>2025.01.21</span>
      </ScrollFadeBlock>
    </figure>
  );
}

function StickyIntroLabel() {
  return (
    <ScrollFadeBlock className="pb-5 font-mono text-[11px] uppercase text-[#7a9a5a] sm:border-b sm:border-[#d4cdc4]/50">
      <p className="flex items-center gap-2 text-[12px] font-bold">
        <FaRegAddressCard className="h-3.5 w-3.5" aria-hidden />
        <span>[01] Introduction</span>
      </p>
      <p className="mt-2 text-[#d4cdc4]/40 font-semibold">profile_index / about</p>
    </ScrollFadeBlock>
  );
}

function VibeSignal() {
  const { displayedText, isTyping } = useTypewriter(VIBE_EMOJIS, 100, 2000);

  return (
    <ScrollFadeBlock className="py-4 lg:mt-8">
      <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase text-[#d4cdc4]/40">
        <span className="inline-flex items-center gap-2 font-bold text-[12px]">
          <FaSignal className={`h-3 w-3 ${isTyping ? "animate-pulse text-[#7a9a5a]" : "text-[#d4cdc4]/25"}`} aria-hidden />
          VIBE SIGNAL
        </span>
        <span>{VIBE_EMOJIS.length} states</span>
      </div>
      <div className="font-mono text-3xl font-semibold leading-none text-[#d4cdc4] sm:text-4xl">
        {displayedText}
        <span className="ml-1 inline-block h-[1em] w-[3px] translate-y-1 bg-[#7a9a5a] align-baseline" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] text-[#d4cdc4]/30">
        {VIBE_EMOJIS.map((emoji) => (
          <span key={emoji} className={displayedText === emoji ? "text-[#7a9a5a]" : undefined}>
            {emoji}
          </span>
        ))}
      </div>
    </ScrollFadeBlock>
  );
}

function AboutStatement() {
  return (
    <ScrollFadeBlock className="grid gap-5 px-0 py-8 sm:border-b sm:border-[#d4cdc4]/20 sm:px-5 md:grid-cols-[150px_minmax(0,1fr)] lg:px-8">
      <SectionLabel icon={FaUser}>Profile</SectionLabel>
      <p className="max-w-3xl text-lg leading-8 text-[#d4cdc4]/80 sm:text-xl">
        I&apos;m a fullstack engineer creating software for the love of the game.
        <br />
        <span className="text-[#d4cdc4]/60">
          I&apos;ve been coding for 5 years as hobby and 2 years professionally.
        </span>
      </p>
    </ScrollFadeBlock>
  );
}

function StackLine() {
  return (
    <ScrollFadeBlock className="grid gap-5 px-0 py-6 sm:border-b sm:border-[#d4cdc4]/20 sm:px-5 md:grid-cols-[150px_minmax(0,1fr)] lg:px-8">
      <SectionLabel icon={FaCode}>Core stack</SectionLabel>
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        {STACK_ITEMS.map((item, index) => {
          const StackIcon = item.icon;

          return (
            <span key={item.label} className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase text-[#d4cdc4]">
              <span className="mr-2 text-[#7a9a5a]">{String(index + 1).padStart(2, "0")}</span>
              <StackIcon className="h-4 w-4 text-[#d4cdc4]" aria-hidden />
              {item.label}
            </span>
          );
        })}
      </div>
    </ScrollFadeBlock>
  );
}

function InlineStats() {
  return (
    <ScrollFadeBlock className="grid gap-5 py-5 sm:border-b sm:border-[#d4cdc4]/20 sm:py-0 lg:grid-cols-[150px_minmax(0,1fr)] lg:px-8">
      <SectionLabel icon={FaChartBar}>Stats</SectionLabel>
      <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-y-0">
        {STATS_ITEMS.map(([label, value]) => (
          <div key={label} className="px-0 sm:px-5 sm:py-5 sm:last:border-r-0">
            <p className="mb-2 font-mono text-[10px] uppercase text-[#d4cdc4]/40">{label}</p>
            {label === "Languages" ? (
              <p className="font-mono text-base font-semibold text-[#d4cdc4]">
                <span className="inline whitespace-nowrap text-xl leading-none">{value}</span>
              </p>
            ) : (
              <p className="flex items-center gap-2 font-mono text-base font-semibold text-[#d4cdc4]">
                {label === "Status" && <span className="h-2 w-2 rounded-full bg-[#7a9a5a]" />}
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollFadeBlock>
  );
}

function ExperienceLedger() {
  return (
    <div className="grid gap-5 px-0 py-8 sm:border-b sm:border-[#d4cdc4]/20 sm:px-5 md:grid-cols-[150px_minmax(0,1fr)] lg:px-8">
      <ScrollFadeBlock>
        <SectionLabel icon={FaBriefcase}>Experience</SectionLabel>
      </ScrollFadeBlock>
      <div className="relative pl-7">
        <span className="absolute bottom-5 left-[4px] top-1 w-px bg-[#d4cdc4]/20" aria-hidden />
        {EXPERIENCE_ITEMS.map((item, index) => (
          <ScrollFadeBlock
            key={`${item.company}-${item.role}`}
            className="relative grid gap-3 py-5 first:pt-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_auto]"
          >
            <span
              className={`absolute left-[-27px] top-[1.45rem] h-[9px] w-[9px] border border-[#0d0b08] ${
                index === 0 ? "bg-[#7a9a5a]" : "bg-[#d4cdc4]/45"
              }`}
              aria-hidden
            />
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-sm font-semibold text-[#d4cdc4]">{item.role}</h3>
                <span className={index === 0 ? "font-mono text-[10px] uppercase text-[#7a9a5a]" : "font-mono text-[10px] uppercase text-[#d4cdc4]/40"}>
                  {item.badge}
                </span>
              </div>
              <p className="font-mono text-xs text-[#d4cdc4]/60">
                {item.company} <span className="text-[#d4cdc4]/40">({item.duration})</span>
              </p>
            </div>
            <p className="font-mono text-[11px] leading-5 text-[#d4cdc4]/60">
              {item.focus.join(" / ")}
            </p>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase text-[#d4cdc4]/40 md:justify-end">
              <span>{item.status}</span>
              {index === 0 ? (
                <span className="relative h-1 w-20 overflow-hidden bg-[#d4cdc4]/10">
                  <span
                    className="absolute inset-y-0 w-1/2 bg-[#7a9a5a]/75"
                    style={{ animation: "loading 1.5s ease-in-out infinite" }}
                  />
                </span>
              ) : (
                <span className="h-1 w-6 bg-[#7a9a5a]/60" />
              )}
            </div>
          </ScrollFadeBlock>
        ))}
      </div>
    </div>
  );
}

function LocationLine() {
  return (
    <ScrollFadeBlock className="grid gap-5 px-0 py-6 sm:px-5 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] lg:px-8">
      <SectionLabel icon={FaMapMarkerAlt}>Location</SectionLabel>
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase text-[#d4cdc4]/40">Region</p>
        <p className="font-mono text-sm font-semibold text-[#d4cdc4]">Bavaria, Germany</p>
      </div>
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase text-[#d4cdc4]/40">Local time</p>
        <LocalTimeClient className="font-mono text-sm font-semibold text-[#d4cdc4]" />
      </div>
    </ScrollFadeBlock>
  );
}

function ModernAboutLayout() {
  return (
    <div className="relative">
      <div className="grid gap-10 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <aside className="grid gap-5 sm:grid-cols-[minmax(180px,260px)_minmax(0,1fr)] sm:items-end lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="sm:col-span-2 lg:mb-6">
            <StickyIntroLabel />
          </div>
          <div className="lg:mb-8">
            <PortraitStamp />
          </div>
          <VibeSignal />
        </aside>

        <div className="relative lg:pl-10">
          <ScrollFadeBlock className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[#d4cdc4]/50 lg:block" />
          <div>
            <ScrollFadeBlock className="py-8 sm:border-b sm:border-[#d4cdc4]/20 lg:px-8">
              <h2
                id="about-heading"
                className="font-display text-5xl leading-[0.98] text-[#d4cdc4] sm:text-7xl md:text-8xl"
              >
                Hi, im <span className="whitespace-nowrap">Daniel Theil</span>
              </h2>
            </ScrollFadeBlock>

            <AboutStatement />
            <StackLine />
            <InlineStats />
            <ExperienceLedger />
            <LocationLine />
          </div>
        </div>
      </div>
    </div>
  );
}

function InViewAboutBlock() {
  return <ModernAboutLayout />;
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

      <section
        id="work"
        data-snap-section="work"
        aria-labelledby="about-heading"
        className="relative w-full overflow-hidden py-24 sm:py-32"
      >
        <div className="absolute inset-0 -z-10 bg-[#0d0b08]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(212,205,196,0.08),transparent_28%,rgba(122,154,90,0.08)_72%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-56 bg-[linear-gradient(180deg,#0d0b08_0%,rgba(13,11,8,0.94)_26%,rgba(13,11,8,0)_100%)]" aria-hidden />
        <div className="absolute inset-0 -z-10 opacity-45" style={SCANLINE_STYLE} />
        <BackgroundLineArt className="opacity-55" />

        {/* Blueprint rim lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 12px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) calc(100% - 12px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 12px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 calc(100% - 12px) / 100% 1px no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 36px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) calc(100% - 36px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 36px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 calc(100% - 36px) / 100% 1px no-repeat",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8">
          <InViewAboutBlock />
        </div>

        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-[linear-gradient(180deg,rgba(13,11,8,0)_0%,#0d0b08_100%)]" aria-hidden />
      </section>
    </>
  );
}
