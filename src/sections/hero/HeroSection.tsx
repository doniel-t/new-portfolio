"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DecodingWord from "@/components/DecodingWord";
import Dither from "@/components/Dither";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallax } from "./useParallax";
import { getHeroVariants } from "./variants";
import HeroArtwork from "./HeroArtwork";

const HEADING_TEXT = "Modern web experiences with a refined, understated aesthetic.";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const scrollToSection = useSectionScroll();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const scrollScale = isMobile ? 0.9 : 1.2;
  const headingWords = HEADING_TEXT.split(" ");
  const { gridContainer, leftSection, childItem, rightSection } = getHeroVariants(isMobile);
  const { scrollProgress } = useParallax(isMobile, sectionRef);

  const portfolioX = useTransform(scrollProgress, [0, 1], [0, -24 * scrollScale]);
  const portfolioY = useTransform(scrollProgress, [0, 1], [0, -34 * scrollScale]);
  const headingX = useTransform(scrollProgress, [0, 1], [0, -19 * scrollScale]);
  const headingY = useTransform(scrollProgress, [0, 1], [0, -27 * scrollScale]);
  const bodyX = useTransform(scrollProgress, [0, 1], [0, -13 * scrollScale]);
  const bodyY = useTransform(scrollProgress, [0, 1], [0, -18 * scrollScale]);
  const buttonsX = useTransform(scrollProgress, [0, 1], [0, -11 * scrollScale]);
  const buttonsY = useTransform(scrollProgress, [0, 1], [0, -15 * scrollScale]);
  const imageScrollX = useTransform(scrollProgress, [0, 1], [0, 21 * scrollScale]);
  const imageScrollY = useTransform(scrollProgress, [0, 1], [0, -24 * scrollScale]);

  const handleSectionLinkClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      scrollToSection(href);
    },
    [scrollToSection]
  );

  return (
    <main
      id="home"
      data-snap-section="home"
      ref={sectionRef}
      className="relative min-h-[100vh] sm:min-h-[100vh] flex items-center justify-center p-8 sm:p-16"
    >
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
            <motion.div variants={childItem}>
              <motion.p style={{ x: portfolioX, y: portfolioY }} className="text-sm tracking-widest text-muted font-bold mb-3">
                PORTFOLIO
              </motion.p>
            </motion.div>
            <motion.div variants={childItem}>
              <motion.h1
                style={{ x: headingX, y: headingY }}
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
            </motion.div>
            <motion.div variants={childItem}>
              <motion.p
                style={{ x: bodyX, y: bodyY }}
                className="text-lg sm:text-xl text-foreground/80 font-medium mb-8 max-w-prose"
              >
                I design and build performant, accessible interfaces with Next.js and a thoughtful component system.
              </motion.p>
            </motion.div>
            <motion.div variants={childItem}>
              <motion.div style={{ x: buttonsX, y: buttonsY }} className="flex flex-wrap gap-3">
                <motion.a
                  className="group inline-flex items-center gap-2 rounded-md px-5 py-3 bg-[#0d0b08] text-background hover:opacity-90 transition-colors z-99"
                  href="#projects"
                  onClick={(event) => handleSectionLinkClick(event, "#projects")}
                  whileHover={isMobile ? {} : { x: 4, scale: 1.01 }}
                  whileTap={isMobile ? {} : { scale: 0.98 }}
                >
                  View Work
                  <span
                    className="
                      inline-flex
                      overflow-hidden
                      max-w-0
                      opacity-0
                      transition-all
                      duration-300
                      ease-out
                      group-hover:max-w-[20px]
                      group-hover:opacity-100
                    "
                  >
                    <ArrowRight size={18} />
                  </span>
                </motion.a>
                <motion.a
                  className="group inline-flex items-center gap-2 rounded-md px-5 py-3 border border-muted/40 text-foreground hover:bg-[#0d0b08] hover:text-white transition-colors duration-300 z-99"
                  href="#contact"
                  onClick={(event) => handleSectionLinkClick(event, "#contact")}
                  whileHover={isMobile ? {} : { x: 4, scale: 1.01 }}
                  whileTap={isMobile ? {} : { scale: 0.98 }}
                >
                  Contact

                  <span
                    className="
                      inline-flex
                      overflow-hidden
                      max-w-0
                      opacity-0
                      transition-all
                      duration-300
                      ease-out
                      group-hover:max-w-[20px]
                      group-hover:opacity-100
                    "
                  >
                    <ArrowRight size={18} />
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        

        
          <motion.div
            variants={rightSection}
          >
            <motion.div
              className="relative"
              style={{ x: imageScrollX, y: imageScrollY }}
            >
              <HeroArtwork isMobile={isMobile} />
            </motion.div>
          </motion.div>
        
      </motion.div>
    </main>
  );
}
