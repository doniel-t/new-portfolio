"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

        {/* Overlay details */}
        <div className="absolute inset-0 pointer-events-none z-10 ring-1 ring-inset ring-white/10 rounded-2xl" />

        {/* Corner brackets decoration */}
        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/40" />
        <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/40" />
        <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/40" />
        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/40" />
      </motion.div>
    </div>
  );
}
