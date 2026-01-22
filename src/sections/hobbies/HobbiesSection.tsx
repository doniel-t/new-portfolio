"use client";

import React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import DecodingWord from "@/components/DecodingWord";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import HobbyCardRow from "./HobbyCardRow";
import ExpandedHobbyModal from "./ExpandedHobbyModal";
import { HOBBIES } from "./data";

// Smooth scroll handler
function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Scroll Spy component - NieR Automata style (fixed position, centered vertically)
function ScrollSpy({ activeIndex, isVisible }: { activeIndex: number; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col items-center gap-3 fixed left-[2.5%] top-1/2 -translate-y-1/2 z-40"
        >
          {/* Top decorative line */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-foreground/30" />
          
          {/* Indicator items */}
          <div className="flex flex-col gap-3">
            {HOBBIES.map((hobby, index) => (
              <a
                key={hobby.title}
                href={`#hobby-${index}`}
                onClick={(e) => handleSmoothScroll(e, `hobby-${index}`)}
                className="group relative flex items-center"
              >
                {/* Number on the left */}
                <span
                  className={`font-mono text-[10px] tracking-wider mr-2 transition-all duration-300 ${
                    activeIndex === index
                      ? "text-foreground/80"
                      : "text-foreground/30 group-hover:text-foreground/50"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                
                {/* Main square */}
                <div
                  className={`relative w-3 h-3 transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-foreground/90 border-2 border-foreground"
                      : "bg-transparent border border-foreground/30 hover:border-foreground/50"
                  }`}
                >
                  {/* Inner pulse for active */}
                  {activeIndex === index && (
                    <div className="absolute inset-0 bg-foreground/50 animate-ping" />
                  )}
                </div>
                
                {/* Label on hover - to the right */}
                <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  <span className="font-mono text-[10px] text-foreground/60 tracking-wider uppercase">
                    {hobby.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <div className="w-px h-8 bg-gradient-to-t from-transparent to-foreground/30" />
          
          {/* NieR-style bracket decoration */}
          <div className="mt-4 flex flex-col items-center">
            <div className="w-3 h-3 border-l border-t border-foreground/20" />
            <div className="w-px h-4 bg-foreground/10" />
            <div className="w-3 h-3 border-l border-b border-foreground/20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HobbiesSection() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isScrollSpyVisible, setIsScrollSpyVisible] = React.useState(false);
  
  // Track which hobby card is in view for the scroll spy
  const hobbyRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Track if the hobbies section covers at least 50% of the viewport
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how much of the viewport is covered by the section
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const viewportCoverage = visibleHeight / viewportHeight;

      // Show scroll spy when section covers at least 50% of viewport
      setIsScrollSpyVisible(viewportCoverage >= 0.7);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which hobby card is in view for the active indicator
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    hobbyRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          },
          { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section id="hobbies" ref={sectionRef} className="relative">
      {/* Fixed Scroll Spy - shows when section is in view */}
      <ScrollSpy activeIndex={activeIndex} isVisible={isScrollSpyVisible && !isMobile} />

      {/* Downward-facing PixelDivider at the start */}
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "0px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#0d0b08"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
            direction="down"
          />
        </div>
      </div>

      <div ref={containerRef} className="relative pt-32 pb-20">
        {/* Section header with left padding - more right on desktop */}
        <div className="pl-[5%] pr-[5%] lg:pl-[10%] mb-16">
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
              className="text-sm tracking-widest text-muted font-bold mb-3"
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
              className="text-lg sm:text-xl text-foreground/80 font-medium max-w-prose"
            >
              When I&apos;m not coding, you&apos;ll find me immersed in stories, exploring virtual worlds, or out on my bike.
            </motion.p>
          </motion.div>
        </div>

        {/* Hobby Cards - aligned with title */}
        <div className="pl-[5%] pr-[5%] lg:pl-[10%]">
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
            {/* Hobby Cards - Alternating Layout */}
            <div className="space-y-16 lg:space-y-24">
              {HOBBIES.map((card, cardIndex) => (
                <div
                  key={card.title}
                  id={`hobby-${cardIndex}`}
                  ref={(el) => { hobbyRefs.current[cardIndex] = el; }}
                >
                  <HobbyCardRow
                      card={card}
                      cardIndex={cardIndex}
                      isMobile={isMobile}
                      onExpand={() => setExpandedCard(cardIndex)}
                    />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Expanded Card Modal */}
      {expandedCard !== null && (
        <ExpandedHobbyModal
          card={HOBBIES[expandedCard]}
          cardIndex={expandedCard}
          totalCards={HOBBIES.length}
          isMobile={isMobile}
          onClose={() => setExpandedCard(null)}
        />
      )}
    </section>
  );
}

export default HobbiesSection;
