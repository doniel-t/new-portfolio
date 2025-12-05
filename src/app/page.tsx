"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";
import DecodingWord from "@/components/DecodingWord";
import PixelDivider from "@/components/PixelDivider";
import AboutChat from "@/components/AboutChat";
import BackgroundLineArt from "@/components/BackgroundLineArt";
import Dither from "@/components/Dither";
import DitherImage from "@/components/DitherImage";
import DotGrid from "@/components/DotGrid";
import TechStack from "@/components/TechStack";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Home() {
  const isMobile = useIsMobile();

  const headingText = "Modern web experiences with a refined, understated aesthetic.";
  const headingWords = headingText.split(" ");

  const gridContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.2,
        delayChildren: isMobile ? 0 : 0.1,
      },
    },
  };

  const leftSection: Variants = {
    hidden: { opacity: 0, y: isMobile ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: isMobile ? 0 : 0.2,
        delayChildren: isMobile ? 0 : 0.1,
      },
    },
  };

  const childItem: Variants = {
    hidden: { opacity: 0, y: isMobile ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const rightSection: Variants = {
    hidden: { opacity: 0, scale: isMobile ? 1 : 0.98, y: isMobile ? 0 : 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  // DecodingWord is imported as a reusable component.

  // Mouse-driven parallax for right visual block
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 120, damping: 16, mass: 0.3 } as const;
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springCfg);
  const shiftX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springCfg);
  const shiftY = useSpring(useTransform(mouseY, [-1, 1], [-4, 4]), springCfg);

  function handleParallaxMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    mouseX.set(px * 2 - 1); // -1..1
    mouseY.set(py * 2 - 1); // -1..1
  }

  function resetParallax() {
    mouseX.set(0);
    mouseY.set(0);
  }
  return (
    <>


      <main className="relative min-h-[100vh] sm:min-h-[100vh] flex items-center justify-center p-8 sm:p-16">
        {/* Dither effect background for hero section */}
        <div className="absolute inset-0 -z-10 opacity-25" aria-hidden>
          <Dither
            waveColor={[165 / 100, 158 / 100, 141 / 100]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.5}
            colorNum={2}
            waveAmplitude={0.002}
            waveFrequency={2.2}
            waveSpeed={0.09}
          />
        </div>
        <motion.div
          className="relative grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 items-center"
          variants={gridContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={leftSection}>
            <motion.p variants={childItem} className="text-sm tracking-widest text-muted font-bold mb-3">PORTFOLIO</motion.p>
            <motion.h1 variants={childItem} className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-foreground drop-shadow-md mb-4">
              <span className="inline-block">
                {headingWords.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block"
                    style={{ display: "inline-block" }}
                  >
                    <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 250} />
                    {i < headingWords.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </span>
            </motion.h1>
            <motion.p variants={childItem} className="text-lg sm:text-xl text-foreground/80 font-medium mb-8 max-w-prose">
              I design and build performant, accessible interfaces with Next.js and a
              thoughtful component system.
            </motion.p>
            <motion.div variants={childItem} className="flex flex-wrap gap-3">
              <motion.a
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 bg-foreground text-background hover:opacity-90 transition-colors"
                href="#work"
                whileHover={isMobile ? {} : { y: -2, scale: 1.02 }}
                whileTap={isMobile ? {} : { scale: 0.98 }}
              >
                View Work <ArrowRight size={18} />
              </motion.a>
              <motion.a
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 border border-muted/40 text-foreground hover:bg-accent/10 transition-colors"
                href="#contact"
                whileHover={isMobile ? {} : { y: -2, scale: 1.02 }}
                whileTap={isMobile ? {} : { scale: 0.98 }}
              >
                Contact
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            variants={rightSection}
            style={isMobile ? {} : { rotateX, rotateY, x: shiftX, y: shiftY, transformPerspective: 800 }}
            onMouseMove={handleParallaxMove}
            onMouseLeave={resetParallax}
          >
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-accent/20 blur-2xl" />
            <div className="absolute -inset-x-12 -bottom-10 -z-10 h-36 bg-green-blob rounded-full blur-3xl opacity-70" aria-hidden />
            <PixelTransition
              gridSize={isMobile ? 12 : 24}
              pixelColor="#1C1303"
              animationStepDuration={isMobile ? 0.5 : 0.75}
              startActive
              aspectRatio="100%"
              autoplayReveal
              autoplayDelayMs={isMobile ? 0 : 150}
              firstContent={
                <Image
                  src="/kino crop.png"
                  alt="Kino"
                  priority
                  className="w-full h-auto object-contain shadow-2xl"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              }
              secondContent={<div className="w-full h-full bg-[#1C1303]" />}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              animate={isMobile ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </main>
      {/* Pixelated divider overlay (no extra layout height) */}
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider color={"#130e05"} pixelSize={isMobile ? 12 : 24} durationSec={8} rise="-200%" streamsPerCol={4} />
        </div>
      </div>

      {/* Projects Section */}
      <section id="work" className="relative w-full py-20 sm:py-28">
        <div className="absolute inset-0 -z-10" style={{ backgroundColor: "var(--dark)" }} />
        {/* DotGrid background for About me section */}
        <div className="absolute inset-0 -z-10 opacity-60" aria-hidden>
          <DotGrid baseColor="#6c673b" activeColor="#A69F8D" dotSize={1.5} gap={32} proximity={75} className="w-full h-full" />
        </div>
        {/* Geometric line art background */}
        <BackgroundLineArt className="-z-0" />
        {/* Blueprint rim lines using mid accent color */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              // 12px inset
              "linear-gradient(to right, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 12px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) calc(100% - 12px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 0 12px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.18), rgba(166,159,141,0.18)) 0 calc(100% - 12px) / 100% 1px no-repeat, " +
              // 36px inset
              "linear-gradient(to right, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 36px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) calc(100% - 36px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 0 36px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.12), rgba(166,159,141,0.12)) 0 calc(100% - 36px) / 100% 1px no-repeat",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-8">
          {/** In-view gate for About section decode */}
          <InViewAboutBlock />

        </div>
      </section>

      <TechStack />

      {/* Inverted pixelated divider (falling down) */}
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ bottom: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider 
            color={"#130e05"} 
            pixelSize={isMobile ? 12 : 24} 
            durationSec={8} 
            rise="200%" 
            streamsPerCol={4}
            direction="down"
          />
        </div>
      </div>

      {/* Hobby Section */}
      <section className="relative w-full py-20 sm:py-28">
        {/* Dither effect background (same as hero) */}
        <div className="absolute inset-0 -z-10 opacity-25" aria-hidden>
          <Dither
            waveColor={[165 / 100, 158 / 100, 141 / 100]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.5}
            colorNum={2}
            waveAmplitude={0.002}
            waveFrequency={2.2}
            waveSpeed={0.09}
          />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-8">
          <InViewHobbyBlock />
        </div>
      </section>
    </>
  );
}

function InViewAboutBlock() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-10 sm:mb-12">
      <motion.div
        initial="hidden"
        animate={isInViewOnce ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: isMobile ? 0 : 0.15, delayChildren: isMobile ? 0 : 0.05 },
          },
        }}
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: isMobile ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } } }}
          className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-muted"
        >
          {/* Unscramble heading when in view */}
          {"About me".split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block" style={{ display: "inline-block" }}>
              <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 180} active={isInViewOnce} />{i < 1 ? "\u00A0" : ""}
            </span>
          ))}
        </motion.h2>
        <motion.p
          variants={{ hidden: { opacity: 0, y: isMobile ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1], delay: isMobile ? 0 : 0.1 } } }}
          className="mt-4 text-muted/80 text-lg leading-relaxed"
        >
          {/* Unscramble paragraph in chunks for readability */}
          {[
            "I",
            "am",
            "a",
            "software",
            "engineer",
            "with",
            "a",
            "passion",
            "for",
            "building",
            "products",
            "that",
            "help",
            "people",
            "live",
            "better",
            "lives.",
          ].map((word, i, arr) => (
            <span key={`about-word-${i}`} className="inline-block" style={{ display: "inline-block" }}>
              <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 5} active={isInViewOnce} />{i < arr.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </motion.p>
        <div className="mt-8">
          <AboutChat active={isInViewOnce} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: isMobile ? 1 : 0.95, filter: "grayscale(100%)" }}
        animate={isInViewOnce ? { opacity: 1, scale: 1, filter: "grayscale(0%)" } : { opacity: 0, scale: isMobile ? 1 : 0.95, filter: "grayscale(100%)" }}
        transition={{ duration: isMobile ? 0.5 : 1, ease: [0.16, 1, 0.3, 1], delay: isMobile ? 0 : 0.2 }}
        className="relative w-full aspect-[4/5] lg:aspect-square max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-muted/10 bg-black/40 shadow-2xl"
      >
        <div className="absolute inset-0 z-0">
          <DitherImage src="/asa noodles crop.png" active={isInViewOnce} className="w-full h-full" />
        </div>

        <div className="absolute inset-0 pointer-events-none z-10 ring-1 ring-inset ring-white/10 rounded-2xl" />

        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/40" />
        <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/40" />
        <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/40" />
        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/40" />
      </motion.div>
    </div>
  );
}

type HobbyCard = {
  title: string;
  items: string[];
  image: string;
  description: string;
  stats: { label: string; value: string }[];
  quote?: string;
};

const HOBBIES: HobbyCard[] = [
  { 
    title: "Anime & Manga", 
    items: ["Chainsaw Man", "Evangelion", "Steins;Gate"], 
    image: "/anime-bg3.png",
    description: "From psychological thrillers to mind-bending sci-fi, I'm drawn to stories that challenge perception and explore the human condition. There's something about Japanese animation that captures emotion in ways live-action rarely does.",
    stats: [
      { label: "Watching Since", value: "2012" },
      { label: "Favorite Genre", value: "Seinen" },
      { label: "Anilist Score Avg", value: "7.94" },
    ],
    quote: "\"I need to think of a good quote here.\"",
  },
  { 
    title: "Video Games", 
    items: ["Elden Ring", "Dark Souls 3", "League of Legends", "Valorant", "NieR: Automata"], 
    image: "/elden-ring-cover-art.webp",
    description: "I gravitate towards games with deep lore, punishing difficulty, and meaningful choices. FromSoftware titles taught me patience; competitive games taught me that tilting is never the answer (still learning).",
    stats: [
      { label: "Hours in Souls", value: "1,200+" },
      { label: "LoL Rank Peak", value: "Diamond" },
      { label: "Deaths to Malenia", value: "147" },
    ],
    quote: "\"A corpse should be left well alone.\"",
  },
  { 
    title: "Cycling", 
    items: ["Urban exploration", "Night rides", "Long distance"], 
    image: "/bike-bento-bg.png",
    description: "Nothing clears the mind like a midnight ride through empty streets. It's where most of my best ideas emerge—somewhere between the rhythm of pedaling and the blur of city lights.",
    stats: [
      { label: "Weekly Avg", value: "~80km" },
      { label: "Longest Ride", value: "142km" },
      { label: "Favorite Time", value: "2-4 AM" },
    ],
  },
  { 
    title: "Digital Art", 
    items: ["Character design", "Environment art", "Fan art"], 
    image: "/art-bg4.png",
    description: "A creative outlet that balances my technical work. I enjoy the meditative process of rendering—translating ideas from imagination to screen, one brush stroke at a time.",
    stats: [
      { label: "Tool of Choice", value: "Infinite Painter" },
      { label: "Tablet", value: "Android" },
      { label: "Style", value: "Anime Painting" },
    ],
  },
  { 
    title: "Dungeons & Dragons", 
    items: ["Roleplay", "Character building"], 
    image: "/dnd-bg.png",
    description: "There's nothing quite like collaborative storytelling around a table. As a forever DM, I craft worlds, weave narratives, and watch players make choices I never anticipated. It's improv theater meets tactical combat meets collective imagination.",
    stats: [
      { label: "Years Playing", value: "5+" },
      { label: "Preferred Role", value: "DM" },
      { label: "Favorite Class", value: "Wizard" },
    ],
    quote: "\"Roll for initiative.\"",
  },
];

function InViewHobbyBlock() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const [shouldPreload, setShouldPreload] = React.useState(false);

  // Defer image preloading until after first render
  React.useEffect(() => {
    const timer = setTimeout(() => setShouldPreload(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedCard(null);
    };
    if (expandedCard !== null) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [expandedCard]);

  return (
    <div ref={containerRef}>
      {/* Preload all hobby images in background after first render */}
      {shouldPreload && (
        <div className="fixed -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
          {HOBBIES.map((hobby) => (
            <Image
              key={`preload-${hobby.title}`}
              src={hobby.image}
              alt=""
              width={1}
              height={1}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              loading="eager"
            />
          ))}
        </div>
      )}

      <motion.div
        initial="hidden"
        animate={isInViewOnce ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: isMobile ? 0 : 0.15, delayChildren: isMobile ? 0 : 0.05 },
          },
        }}
      >
        <motion.p
          variants={{ hidden: { opacity: 0, y: isMobile ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.5, ease: [0.16, 1, 0.3, 1] } } }}
          className="text-sm tracking-widest text-muted font-bold mb-3 mt-24"
        >
          BEYOND THE CODE
        </motion.p>
        <motion.h2
          variants={{ hidden: { opacity: 0, y: isMobile ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } } }}
          className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-foreground drop-shadow-md mb-6"
        >
          {"Hobbies & Interests".split(" ").map((word, i, arr) => (
            <span key={`hobby-title-${i}`} className="inline-block" style={{ display: "inline-block" }}>
              <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 180} active={isInViewOnce} />{i < arr.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </motion.h2>
        <motion.p
          variants={{ hidden: { opacity: 0, y: isMobile ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1], delay: isMobile ? 0 : 0.1 } } }}
          className="text-lg sm:text-xl text-foreground/80 font-medium mb-12 max-w-prose"
        >
          When I&apos;m not coding, you&apos;ll find me immersed in stories, exploring virtual worlds, or out on my bike.
        </motion.p>

        {/* Hobby Cards - Alternating Left/Right Layout */}
        <div className="space-y-20 lg:space-y-32">
          {HOBBIES.map((card, cardIndex) => {
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
                  
                  <motion.div 
                    layoutId={`hobby-card-${cardIndex}`}
                    onClick={() => setExpandedCard(cardIndex)}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_10px_rgba(0,0,0,0.1)] cursor-pointer h-[400px] lg:h-[480px]" 
                    whileHover={isMobile ? {} : { scale: 1.02 }}
                    whileTap={isMobile ? {} : { scale: 0.98 }}
                  >
                    {/* Background Image - hidden by default, shown on hover */}
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 560px"
                      loading="lazy"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#130e05] via-[#130e05]/60 to-[#130e05]/30" />
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-foreground/30 z-20 transition-colors duration-300 group-hover:border-white/60" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-foreground/30 z-20 transition-colors duration-300 group-hover:border-white/60" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-foreground/30 z-20 transition-colors duration-300 group-hover:border-white/60" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-foreground/30 z-20 transition-colors duration-300 group-hover:border-white/60" />

                  {/* Dark bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#130e05] z-[15]" />

                  {/* Pixel divider animation at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-96 z-10 overflow-hidden pointer-events-none">
                    <PixelDivider 
                      color="#130e05" 
                      pixelSize={isMobile ? 10 : 48} 
                      durationSec={10} 
                      rise="-250%" 
                      streamsPerCol={4}
                      direction="up"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-20 h-full flex flex-col p-8">
                    {/* Top row: Index left, Click hint right */}
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs tracking-widest text-foreground/40 group-hover:text-white/50 uppercase transition-colors duration-300">
                        [{String(cardIndex + 1).padStart(2, "0")}]
                      </div>
                      <div className="font-mono text-[10px] tracking-widest text-foreground/30 group-hover:text-white/40 uppercase transition-colors duration-300">
                        Click to expand
                      </div>
                    </div>

                    {/* Title + Items - slightly below center */}
                    <div className="flex-1 flex flex-col justify-center pt-12">
                      <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground group-hover:text-white transition-colors duration-300 mb-4">
                        {card.title}
                      </h3>
                      
                      {/* Items - NieR Automata UI style */}
                      <div className="flex flex-wrap gap-2">
                        {card.items.map((item, itemIndex) => (
                          <span
                            key={item}
                            className="relative inline-flex items-center text-[9px] font-mono uppercase tracking-widest text-foreground/60 group-hover:text-white/80 bg-foreground/[0.03] group-hover:bg-white/[0.08] px-2.5 py-1 border border-foreground/20 group-hover:border-white/30 transition-all duration-300"
                          >
                            {/* Corner accents */}
                            <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-foreground/40 group-hover:border-white/60" />
                            <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-foreground/40 group-hover:border-white/60" />
                            <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-foreground/40 group-hover:border-white/60" />
                            <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-foreground/40 group-hover:border-white/60" />
                            
                            {/* Index prefix */}
                            <span className="text-foreground/30 group-hover:text-white/40 mr-1.5">{String(itemIndex + 1).padStart(2, "0")}</span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                    {/* Bottom decorative line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 group-hover:via-white/30 to-transparent transition-colors duration-300 z-20" />
                  </motion.div>
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
          })}
        </div>
      </motion.div>

      {/* Expanded Card Modal */}
      {expandedCard !== null && (
        <>
          {/* Backdrop with blurred card image */}
          <div
            onClick={() => setExpandedCard(null)}
            className="fixed inset-0 z-50 overflow-hidden animate-[fadeIn_0.3s_ease-out]"
          >
            {/* Blurred background image - small size since heavily blurred */}
            <Image
              src={HOBBIES[expandedCard].image}
              alt=""
              fill
              className="object-cover scale-110 blur-3xl"
              sizes="384px"
              quality={25}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#130e05]/70" />
            {/* Dither wave overlay */}
            <div className="absolute inset-0 opacity-0 pointer-events-none animate-[fadeInDither_0.5s_ease-out_0.3s_forwards]">
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
          </div>

          {/* Expanded Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
            <div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#130e05] pointer-events-auto animate-[fadeIn_0.3s_ease-out]"
            >
                {/* Close button */}
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={HOBBIES[expandedCard].image}
                    alt={HOBBIES[expandedCard].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130e05] via-[#130e05]/80 to-[#130e05]/50" />
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
                    [{String(expandedCard + 1).padStart(2, "0")}] / {HOBBIES.length.toString().padStart(2, "0")}
                  </div>

                  <h2 className="font-display text-5xl sm:text-6xl lg:text-8xl tracking-tight text-white mb-6 drop-shadow-lg">
                    {HOBBIES[expandedCard].title}
                  </h2>

                  {/* Items list */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    {HOBBIES[expandedCard].items.map((item) => (
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
                        {HOBBIES[expandedCard].description}
                      </p>

                      {/* Quote (if exists) */}
                      {HOBBIES[expandedCard].quote && (
                        <blockquote className="text-white/50 italic font-mono text-lg border-l-2 border-white/30 pl-6">
                          {HOBBIES[expandedCard].quote}
                        </blockquote>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                      <div className="font-mono text-xs tracking-widest text-white/40 uppercase">
                        Stats & Info
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {HOBBIES[expandedCard].stats.map((stat) => (
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
        )}
      
    </div>
  );
}
