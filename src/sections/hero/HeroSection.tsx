"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HERO_CONTENT } from "@/data/hero/content";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import HeroCollage from "./HeroCollage";
import { heroReveal } from "./heroMotion";
import "./hero-collage.css";

const Dither = dynamic(() => import("@/components/Dither"), {
  ssr: false,
  loading: () => null,
});

const HEADING_WORDS = HERO_CONTENT.heading.split(" ");

function HeadingWords({ start, end, reducedMotion }: { start: number; end: number; reducedMotion: boolean | null }) {
  return HEADING_WORDS.slice(start, end).map((word, i) => (
    <React.Fragment key={`${word}-${i}`}>
      <motion.span className={`hero-word hero-word-${start + i}`} {...heroReveal(3 + start + i, reducedMotion)}>{word}</motion.span>
      {i < end - start - 1 ? " " : ""}
    </React.Fragment>
  ));
}

export default function HeroSection() {
  const scrollToSection = useSectionScroll();
  const prefersReducedMotion = useReducedMotion();
  const handleSectionLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Preserve native modified-click behavior.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection(href);
  };

  return (
    <main id="home" data-snap-section="home" className="hero-section hero-collage">
      <div className="hero-dither" aria-hidden="true">
        <Dither
          waveColor={[2, 2, 2]}
          disableAnimation={prefersReducedMotion ?? true}
          enableMouseInteraction={false}
          colorNum={0.01}
          pixelSize={3}
          waveAmplitude={0.5}
          waveFrequency={2}
          waveSpeed={0.05}
          enableOnMobile
        />
      </div>
      <div className="hero-shell">
        <header className="hero-masthead">
          <motion.a {...heroReveal(1, prefersReducedMotion)} className="hero-identity hero-action" href="#home" onClick={(event) => handleSectionLinkClick(event, "#home")}>
            Daniel Theil<span>Fullstack Engineer</span>
          </motion.a>
          <motion.a {...heroReveal(2, prefersReducedMotion)} className="hero-contact hero-action" href="#contact" onClick={(event) => handleSectionLinkClick(event, "#contact")}>
            Let’s talk <ArrowUpRight size={18} aria-hidden="true" />
          </motion.a>
        </header>

        <div className="hero-composition">
        <div data-hero-copy className="hero-copy">
          <h1 className="hero-heading" aria-label={HERO_CONTENT.heading}>
            <span aria-hidden="true">
              <span className="hero-heading-lead"><HeadingWords start={0} end={3} reducedMotion={prefersReducedMotion} /></span>
              {" "}
              <motion.span className="hero-heading-detail" {...heroReveal(6, prefersReducedMotion)}>{HEADING_WORDS.slice(3).join(" ")}</motion.span>
            </span>
          </h1>
          <div className="hero-support">
            <motion.p className="hero-intro" {...heroReveal(7, prefersReducedMotion)}>{HERO_CONTENT.intro}</motion.p>
            <div className="hero-links">
              <motion.a {...heroReveal(8, prefersReducedMotion)} className="hero-action hero-work-link" href="#about-projects" onClick={(event) => handleSectionLinkClick(event, "#about-projects")}>
                View Work <ArrowUpRight size={21} aria-hidden="true" />
              </motion.a>
              <motion.a {...heroReveal(9, prefersReducedMotion)} className="hero-action hero-secondary-link" href="#contact" onClick={(event) => handleSectionLinkClick(event, "#contact")}>
                Contact <ArrowRight size={18} aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </div>
        <HeroCollage />
        </div>


      </div>
    </main>
  );
}


