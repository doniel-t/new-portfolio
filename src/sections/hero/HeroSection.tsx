"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DecodingWord from "@/components/DecodingWord";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallax } from "./useParallax";
import { getHeroVariants } from "./variants";
import HeroArtwork from "./HeroArtwork";

const Dither = dynamic(() => import("@/components/Dither"), {
  ssr: false,
  loading: () => null,
});

const HEADING_TEXT = "Modern web experiences with a refined, understated aesthetic.";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const scrollToSection = useSectionScroll();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const scrollScale = isMobile ? 0.9 : 1.2;
  const headingWords = HEADING_TEXT.split(" ");
  const { gridContainer, leftSection, childItem, rightSection } = getHeroVariants(isMobile);
  const { scrollProgress } = useParallax(isMobile, sectionRef);

  // One translate for the whole left content group, one for the image.
  // Previously each text block had its own staggered parallax — collapsed
  // here to two transforms total to keep the per-frame work cheap.
  const leftContentX = useTransform(scrollProgress, [0, 1], [0, -17 * scrollScale]);
  const leftContentY = useTransform(scrollProgress, [0, 1], [0, -24 * scrollScale]);
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
        
          <motion.div variants={leftSection} style={{ x: leftContentX, y: leftContentY }}>
            <motion.div variants={childItem}>
              <p className="text-sm tracking-widest text-muted font-bold mb-3">
                PORTFOLIO
              </p>
            </motion.div>
            <motion.div variants={childItem}>
              <h1
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
              </h1>
            </motion.div>
            <motion.div variants={childItem}>
              <p
                className="text-lg sm:text-xl text-foreground/80 font-medium mb-8 max-w-prose"
              >
                I design and build performant, accessible interfaces with Next.js and a thoughtful component system.
              </p>
            </motion.div>
            <motion.div variants={childItem}>
              <div className="flex flex-wrap gap-3">
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
              </div>
            </motion.div>
          </motion.div>



          <motion.div
            variants={rightSection}
            style={{ x: imageScrollX, y: imageScrollY }}
          >
            <div className="relative">
              <HeroArtwork isMobile={isMobile} />
            </div>
          </motion.div>
        
      </motion.div>
    </main>
  );
}
