"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import DecodingWord from "@/components/DecodingWord";
import { useIsMobile } from "@/hooks/useIsMobile";
import HobbyCardRow from "./HobbyCardRow";
import ExpandedHobbyModal from "./ExpandedHobbyModal";
import { HOBBIES } from "./data";

function HobbiesSection() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);

  return (
    <div ref={containerRef}>
      {/* Images are preloaded per-card when they enter viewport via HobbyCard */}

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
          {HOBBIES.map((card, cardIndex) => (
            <HobbyCardRow
              key={card.title}
              card={card}
              cardIndex={cardIndex}
              isMobile={isMobile}
              isInViewOnce={isInViewOnce}
              onExpand={() => setExpandedCard(cardIndex)}
            />
          ))}
        </div>
      </motion.div>

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
    </div>
  );
}

export default HobbiesSection;
