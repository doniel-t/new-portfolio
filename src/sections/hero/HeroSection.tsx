"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";
import DecodingWord from "@/components/DecodingWord";
import Dither from "@/components/Dither";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallax } from "./useParallax";
import { getHeroVariants } from "./variants";

const HEADING_TEXT = "Modern web experiences with a refined, understated aesthetic.";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const headingWords = HEADING_TEXT.split(" ");
  const { gridContainer, leftSection, childItem, rightSection } = getHeroVariants(isMobile);
  const { rotateX, rotateY, shiftX, shiftY, handleParallaxMove, resetParallax } = useParallax(isMobile);

  return (
    <main className="relative min-h-[100vh] sm:min-h-[100vh] flex items-center justify-center p-8 sm:p-16">
      {/* Dither effect background for hero section */}
      <div className="absolute inset-0 -z-10 opacity-25" aria-hidden>
        <Dither
          waveColor={[165 / 100, 158 / 100, 141 / 100]}
          disableAnimation={false}
          enableMouseInteraction={!isMobile}
          mouseRadius={0.5}
          colorNum={2}
          waveAmplitude={0.002}
          waveFrequency={2.2}
          waveSpeed={0.09}
          enableOnMobile={true}
        />
      </div>

      <motion.div
        className="relative grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 items-center"
        variants={gridContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={leftSection}>
          <motion.p variants={childItem} className="text-sm tracking-widest text-muted font-bold mb-3">
            PORTFOLIO
          </motion.p>
          <motion.h1
            variants={childItem}
            className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-foreground drop-shadow-md mb-4"
          >
            <span className="inline-block">
              {headingWords.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block" style={{ display: "inline-block" }}>
                  <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 250} />
                  {i < headingWords.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          </motion.h1>
          <motion.p variants={childItem} className="text-lg sm:text-xl text-foreground/80 font-medium mb-8 max-w-prose">
            I design and build performant, accessible interfaces with Next.js and a thoughtful component system.
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
          <div
            className="absolute -inset-x-12 -bottom-10 -z-10 h-36 bg-green-blob rounded-full blur-3xl opacity-70"
            aria-hidden
          />
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
  );
}
