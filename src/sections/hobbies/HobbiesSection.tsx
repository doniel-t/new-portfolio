"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DecodingWord from "@/components/DecodingWord";
import Aurora from "@/components/Aurora";
import HorizontalPixelDivider from "@/components/HorizontalPixelDivider";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import ExpandedHobbyModal from "./ExpandedHobbyModal";
import { HOBBIES } from "./data";
import type { HobbyCard as HobbyCardType } from "./types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function ScrollSpy({ activeIndex, isVisible }: { activeIndex: number; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="hidden lg:flex fixed left-[2.1%] top-1/2 -translate-y-1/2 z-40"
        >
          <div className="relative pl-5">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/28 to-transparent" />
            <div className="flex flex-col gap-3.5">
              {HOBBIES.map((hobby, index) => {
                const isActive = activeIndex === index;
                const spyLabel = hobby.title === "Dungeons & Dragons" ? "DnD" : hobby.title;

                return (
                  <a
                    key={hobby.title}
                    href={`#hobby-${index}`}
                    onClick={(e) => handleSmoothScroll(e, `hobby-${index}`)}
                    className="group relative flex items-center"
                    aria-label={`Go to ${spyLabel}`}
                  >
                    <span
                      className={`h-[10px] w-[10px] transition-all duration-250 ${
                        isActive
                          ? "bg-foreground border border-foreground"
                          : "bg-transparent border border-foreground/40 group-hover:border-foreground/65"
                      }`}
                    />

                    {isActive && (
                      <motion.span
                        layoutId="hobby-scroll-active-dot"
                        className="absolute left-0 h-[10px] w-[10px] bg-foreground/45"
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                      />
                    )}

                    <span className="absolute left-full ml-2.5 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/55">
                      {spyLabel}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type HobbyRefs = React.MutableRefObject<(HTMLDivElement | null)[]>;

const HobbiesScrollSpyLayer = React.memo(function HobbiesScrollSpyLayer({
  sectionRef,
  hobbyRefs,
  isMobile,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  hobbyRefs: HobbyRefs;
  isMobile: boolean;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isScrollSpyVisible, setIsScrollSpyVisible] = React.useState(false);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisibility = entry.isIntersecting;
        setIsScrollSpyVisible((current) => (current === nextVisibility ? current : nextVisibility));
      },
      { threshold: 0.05, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let nextIndex = -1;
        let maxRatio = -1;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const indexAttr = (entry.target as HTMLElement).dataset.hobbyIndex;
          const parsedIndex = indexAttr ? Number.parseInt(indexAttr, 10) : Number.NaN;
          if (Number.isNaN(parsedIndex) || parsedIndex < 0) continue;

          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            nextIndex = parsedIndex;
          }
        }

        if (nextIndex >= 0) {
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
        }
      },
      { threshold: 0.2, rootMargin: "-12% 0px -25% 0px" },
    );

    const elements = hobbyRefs.current.filter((element): element is HTMLDivElement => element !== null);
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [hobbyRefs]);

  return <ScrollSpy activeIndex={activeIndex} isVisible={isScrollSpyVisible && !isMobile} />;
});

const HobbiesHeader = React.memo(function HobbiesHeader({
  isInViewOnce,
  isMobile,
}: {
  isInViewOnce: boolean;
  isMobile: boolean;
}) {
  return (
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
      <motion.div
        variants={{
          hidden: { opacity: 0, y: isMobile ? 0 : 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: isMobile ? 0.3 : 0.5, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        className="flex flex-wrap items-center gap-3 mb-3"
      >
        <span className="font-mono text-sm tracking-widest text-foreground/55">[LIFE_LOGS]</span>

      </motion.div>

      <motion.h2
        variants={{
          hidden: { opacity: 0, y: isMobile ? 0 : 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-foreground drop-shadow-md mb-6"
      >
        {"Hobbies & Interests".split(" ").map((word, i, arr) => (
          <span key={`hobby-title-${i}`} className="inline-block">
            <DecodingWord word={word} startDelayMs={isMobile ? 0 : i * 180} active={isInViewOnce} />
            {i < arr.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </motion.h2>

      <motion.p
        variants={{
          hidden: { opacity: 0, y: isMobile ? 0 : 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: isMobile ? 0.3 : 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: isMobile ? 0 : 0.1,
            },
          },
        }}
        className="text-lg sm:text-xl text-foreground/70 font-medium max-w-prose"
      >
        Outside work, this is the part of the UI where my brain actually reloads.
      </motion.p>
    </motion.div>
  );
});

const HobbyLane = React.memo(function HobbyLane({
  card,
  cardIndex,
  totalCards,
  isMobile,
  onExpand,
  registerRef,
}: {
  card: HobbyCardType;
  cardIndex: number;
  totalCards: number;
  isMobile: boolean;
  onExpand: () => void;
  registerRef: (index: number, element: HTMLDivElement | null) => void;
}) {
  const laneRef = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(laneRef, { once: true, margin: "0px 0px -20% 0px" });
  const imageRight = !isMobile && cardIndex % 2 !== 0;
  const [isImageHovered, setIsImageHovered] = React.useState(false);

  const laneVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, y: isMobile ? 20 : 36 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: isMobile ? 0.32 : 0.5,
          ease: EASE_OUT,
          when: "beforeChildren",
          staggerChildren: isMobile ? 0.04 : 0.07,
          delayChildren: 0,
        },
      },
    }),
    [isMobile],
  );

  const imageVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, x: imageRight ? 26 : -26 },
      show: {
        opacity: 1,
        x: 0,
        transition: { duration: isMobile ? 0.28 : 0.4, ease: EASE_OUT },
      },
    }),
    [imageRight, isMobile],
  );

  const titleVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: isMobile ? 0.24 : 0.34, ease: EASE_OUT },
      },
    }),
    [isMobile],
  );

  const infoVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: isMobile ? 0.24 : 0.34, ease: EASE_OUT },
      },
    }),
    [isMobile],
  );

  const statsVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: isMobile ? 0.24 : 0.34, ease: EASE_OUT },
      },
    }),
    [isMobile],
  );

  const quoteVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: isMobile ? 0.22 : 0.32, ease: EASE_OUT },
      },
    }),
    [isMobile],
  );

  const setRefs = React.useCallback(
    (element: HTMLDivElement | null) => {
      laneRef.current = element;
      registerRef(cardIndex, element);
    },
    [cardIndex, registerRef],
  );

  const titleWords = React.useMemo(() => card.title.split(" "), [card.title]);

  const imageClipPath = React.useMemo(() => {
    if (isMobile) return undefined;
    return imageRight
      ? "polygon(8% 0, 100% 0, 100% 100%, 0 100%)"
      : "polygon(0 0, 92% 0, 100% 100%, 0 100%)";
  }, [imageRight, isMobile]);

  return (
    <motion.article
      id={`hobby-${cardIndex}`}
      data-hobby-index={cardIndex}
      ref={setRefs}
      variants={laneVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="relative py-10 sm:py-14"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-10 opacity-70">
        <HorizontalPixelDivider
          color={imageRight ? "#6c673b" : "#0d0b08"}
          pixelSize={isMobile ? 20 : 30}
          durationSec={6.8}
          travel="220%"
          streamsPerRow={1}
          direction={imageRight ? "left" : "right"}
          fadeTo={imageRight ? "left" : "right"}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-10 opacity-60">
        <HorizontalPixelDivider
          color={imageRight ? "#0d0b08" : "#6c673b"}
          pixelSize={isMobile ? 20 : 30}
          durationSec={7.1}
          travel="220%"
          streamsPerRow={1}
          direction={imageRight ? "right" : "left"}
          fadeTo={imageRight ? "right" : "left"}
        />
      </div>

      <div
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 font-display leading-none text-[5.5rem] sm:text-[8rem] lg:text-[10rem] text-foreground/[0.06] ${
          imageRight ? "left-3 sm:left-8" : "right-3 sm:right-8"
        }`}
      >
        {String(cardIndex + 1).padStart(2, "0")}
      </div>

      <div className="relative px-5 sm:px-8 lg:px-10">
        <div className="mb-6 sm:mb-8 flex items-center gap-3">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] text-foreground/50">
            [NODE_{String(cardIndex + 1).padStart(2, "0")}] / {String(totalCards).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-foreground/35 to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.18em] uppercase text-[#7a9a5a]/75">
            ACTIVE FEED
          </span>
        </div>

        <div className={`grid items-start gap-7 lg:gap-12 ${imageRight ? "lg:grid-cols-[0.92fr_1.08fr]" : "lg:grid-cols-[1.08fr_0.92fr]"}`}>
          <motion.div variants={imageVariants} className={`relative ${imageRight ? "order-2" : "order-1"}`}>
            <motion.button
              type="button"
              onClick={onExpand}
              onHoverStart={() => setIsImageHovered(true)}
              onHoverEnd={() => setIsImageHovered(false)}
              whileHover={isMobile ? {} : { scale: 1.01 }}
              whileTap={isMobile ? {} : { scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group/image relative block w-full h-[250px] sm:h-[330px] lg:h-[410px] overflow-hidden cursor-pointer"
              style={isMobile ? undefined : { clipPath: imageClipPath }}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover scale-[1.04] transition-transform duration-150 ease-out group-hover/image:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08]/95 via-[#0d0b08]/45 to-[#0d0b08]/10" />
              <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 opacity-80">
                <HorizontalPixelDivider
                  color="#f6f4ef"
                  pixelSize={isMobile ? 18 : 24}
                  durationSec={6.2}
                  travel="180%"
                  streamsPerRow={1}
                  direction={imageRight ? "left" : "right"}
                  fadeTo={imageRight ? "left" : "right"}
                />
              </div>

              <div className="absolute left-0 right-0 bottom-0 px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase text-white/75">
                    Expand Feed
                  </span>
                  <span className="h-px flex-1 bg-white/35" />
                </div>
              </div>
            </motion.button>

            <motion.div
              aria-hidden
              initial={false}
              animate={
                isImageHovered && !isMobile
                  ? { scaleX: 1, opacity: 0.95 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className={`mt-2 h-[2px] bg-foreground/60 ${imageRight ? "origin-right" : "origin-left"}`}
            />

            <p className="mt-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em] text-foreground/55">
              {card.items.join(" // ")}
            </p>
          </motion.div>

          <div className={`relative ${imageRight ? "order-1" : "order-2"}`}>
            <motion.h3 variants={titleVariants} className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.96] tracking-tight text-foreground mb-6">
              {titleWords.map((word, index) => (
                <span key={`${card.title}-${word}-${index}`} className="inline-block mr-3">
                  <DecodingWord
                    word={word}
                    startDelayMs={isMobile ? 0 : cardIndex * 140 + index * 120}
                    active={isInView}
                  />
                </span>
              ))}
            </motion.h3>

            <motion.div variants={infoVariants} className="mb-7 max-w-xl">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/75">
                {card.description}
              </p>
            </motion.div>

            <motion.div variants={statsVariants} className="space-y-4 mb-8">
              {card.stats.map((stat, statIndex) => (
                <div key={stat.label} className="flex items-end gap-3 sm:gap-4">
                  <span className="min-w-[118px] sm:min-w-[144px] font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-foreground/55">
                    {stat.label}
                  </span>
                  <span className="h-px flex-1 bg-foreground/20 mb-[7px]" />
                  <span className="font-display text-xl sm:text-2xl text-foreground leading-none">
                    <DecodingWord
                      word={stat.value}
                      startDelayMs={isMobile ? 0 : cardIndex * 160 + statIndex * 90 + 240}
                      active={isInView}
                    />
                  </span>
                </div>
              ))}
            </motion.div>

            {card.quote ? (
              <motion.blockquote
                variants={quoteVariants}
                className="mb-8 border-l border-foreground/45 pl-4 font-mono text-sm sm:text-base italic text-foreground/58"
              >
                {card.quote}
              </motion.blockquote>
            ) : null}

            <motion.button
              variants={quoteVariants}
              type="button"
              onClick={onExpand}
              whileHover={isMobile ? {} : { x: 4, scale: 1.01 }}
              whileTap={isMobile ? {} : { scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-5 py-3 border border-muted/40 text-foreground hover:bg-[#0d0b08] hover:text-white transition-colors duration-300 cursor-pointer"
            >
              View Expanded
              <span className="inline-flex overflow-hidden max-w-0 opacity-0 transition-all duration-300 ease-out group-hover:max-w-[20px] group-hover:opacity-100">
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

const HobbiesRunway = React.memo(function HobbiesRunway({
  isInViewOnce,
  isMobile,
  hobbyRefs,
  onExpandCard,
}: {
  isInViewOnce: boolean;
  isMobile: boolean;
  hobbyRefs: HobbyRefs;
  onExpandCard: (index: number) => void;
}) {
  const setHobbyRef = React.useCallback(
    (index: number, element: HTMLDivElement | null) => {
      hobbyRefs.current[index] = element;
    },
    [hobbyRefs],
  );

  const expandHandlers = React.useMemo(
    () => HOBBIES.map((_, index) => () => onExpandCard(index)),
    [onExpandCard],
  );

  return (
    <motion.div
      initial="hidden"
      animate={isInViewOnce ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: isMobile ? 0 : 0.12, delayChildren: isMobile ? 0 : 0.04 },
        },
      }}
      className="relative"
    >
      {HOBBIES.map((card, cardIndex) => (
        <HobbyLane
          key={card.title}
          card={card}
          cardIndex={cardIndex}
          totalCards={HOBBIES.length}
          isMobile={isMobile}
          onExpand={expandHandlers[cardIndex]}
          registerRef={setHobbyRef}
        />
      ))}
    </motion.div>
  );
});

function HobbiesSection() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "0px 0px -20% 0px" });
  const isMobile = useIsMobile();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const hobbyRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const handleExpandCard = React.useCallback((index: number) => {
    setExpandedCard(index);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setExpandedCard(null);
  }, []);

  return (
    <section id="hobbies" ref={sectionRef} className="relative bg-[#f6f4ef]">
      <div
        className="absolute inset-x-0 top-0 h-[100vh] z-[1] pointer-events-none overflow-hidden opacity-60"
      >
        <Aurora colorStops={['#f7dd88', '#7147fc', '#ff0d96']} amplitude={isMobile ? 0.3 : 0.8} speed={0.4} blend={0.7} grainAmount={0.09}/>
      </div>
      <div className="absolute inset-0 work-section-noise pointer-events-none z-0 opacity-30" />

      <HobbiesScrollSpyLayer sectionRef={sectionRef} hobbyRefs={hobbyRefs} isMobile={isMobile} />

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

      <div ref={containerRef} className="relative z-[1] pt-32 pb-20">
        <div className="pl-[5%] pr-[5%] lg:pl-[10%] mb-16">
          <HobbiesHeader isInViewOnce={isInViewOnce} isMobile={isMobile} />
        </div>

        <div className="pl-[5%] pr-[5%] lg:pl-[10%]">
          <HobbiesRunway
            isInViewOnce={isInViewOnce}
            isMobile={isMobile}
            hobbyRefs={hobbyRefs}
            onExpandCard={handleExpandCard}
          />
        </div>
      </div>

      {expandedCard !== null && (
        <ExpandedHobbyModal
          card={HOBBIES[expandedCard]}
          cardIndex={expandedCard}
          totalCards={HOBBIES.length}
          isMobile={isMobile}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

export default HobbiesSection;
