"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PixelDivider from "@/components/PixelDivider";
import HorizontalPixelDivider from "@/components/HorizontalPixelDivider";
import PixelDissolveOverlay from "@/components/PixelDissolveOverlay";
import { HOBBIES } from "@/data/hobbies/cards";
import { HOBBIES_CONTENT } from "@/data/hobbies/content";
import type { HobbyCard as HobbyCardType } from "@/data/hobbies/types";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useIsMobile } from "@/hooks/useIsMobile";
import ExpandedHobbyModal from "./ExpandedHobbyModal";
import "./hobbies-editorial.css";

const Aurora = dynamic(() => import("@/components/Aurora"), {
  ssr: false,
  loading: () => null,
});

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HOBBIES_CONTENT_SHELL =
  "hobbies-shell";

function ScrollSpy({
  activeIndex,
  isVisible,
  onNavigate,
}: {
  activeIndex: number;
  isVisible: boolean;
  onNavigate: (targetId: string) => void;
}) {
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
            <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-foreground/28 to-transparent" />
            <div className="flex flex-col gap-3.5">
              {HOBBIES.map((hobby, index) => {
                const isActive = activeIndex === index;
                const spyLabel = hobby.shortTitle ?? hobby.title;

                return (
                  <a
                    key={hobby.title}
                    href={`#hobby-${index}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(`hobby-${index}`);
                    }}
                    className="group relative flex items-center"
                    aria-label={`Go to ${spyLabel}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 transition-all duration-250 ${
                        isActive
                          ? "bg-foreground border border-foreground"
                          : "bg-transparent border border-foreground/40 group-hover:border-foreground/65"
                      }`}
                    />

                    {isActive && (
                      <motion.span
                        layoutId="hobby-scroll-active-dot"
                        className="absolute left-0 h-2.5 w-2.5 bg-foreground/45"
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
  onNavigate,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  hobbyRefs: HobbyRefs;
  isMobile: boolean;
  onNavigate: (targetId: string) => void;
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

  return (
    <ScrollSpy
      activeIndex={activeIndex}
      isVisible={isScrollSpyVisible && !isMobile}
      onNavigate={onNavigate}
    />
  );
});

function HobbiesHeader({ onNavigate }: { onNavigate: (targetId: string) => void }) {
  return (
    <header className="hobbies-header">
      <div className="hobbies-heading-row">
        <h2 id="hobbies-title">Hobbies <span>& Interests</span></h2>
        <p>{HOBBIES_CONTENT.intro}</p>
      </div>
      <nav className="hobbies-index" aria-label="Explore my interests">
        {HOBBIES.map((hobby, index) => (
          <a key={hobby.title} href={`#hobby-${index}`} onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate(`hobby-${index}`);
          }}>
            {hobby.shortTitle ?? hobby.title}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </header>
  );
}

const HobbyLane = React.memo(function HobbyLane({
  card, cardIndex, onExpand, registerRef,
}: {
  card: HobbyCardType;
  cardIndex: number;
  onExpand: () => void;
  registerRef: (index: number, element: HTMLDivElement | null) => void;
}) {
  const reducedMotion = useReducedMotion();
  const setRef = React.useCallback((element: HTMLDivElement | null) => {
    registerRef(cardIndex, element);
  }, [cardIndex, registerRef]);

  return (
    <motion.article id={`hobby-${cardIndex}`} data-hobby-index={cardIndex} ref={setRef}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "-8% 0px -16% 0px" }}
      variants={{
        hidden: {
          opacity: reducedMotion ? 1 : 0.15,
          filter: reducedMotion ? "blur(0px)" : "blur(12px)",
          y: reducedMotion ? 0 : 20,
        },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: reducedMotion ? 0 : 0.85, ease: EASE_OUT },
        },
      }}
      className={`hobby-story ${cardIndex % 2 ? "hobby-story--reverse" : ""}`}
      aria-labelledby={`hobby-title-${cardIndex}`}>
      {!reducedMotion ? <>
        <div className="hobby-pixels hobby-pixels--top" aria-hidden="true">
          <HorizontalPixelDivider color={cardIndex % 2 ? "#6c673b" : "#0d0b08"}
            pixelSize={24} durationSec={6.8} travel="220%" streamsPerRow={1}
            direction={cardIndex % 2 ? "left" : "right"} fadeTo={cardIndex % 2 ? "left" : "right"} />
        </div>
        <div className="hobby-pixels hobby-pixels--bottom" aria-hidden="true">
          <HorizontalPixelDivider color={cardIndex % 2 ? "#0d0b08" : "#6c673b"}
            pixelSize={24} durationSec={7.1} travel="220%" streamsPerRow={1}
            direction={cardIndex % 2 ? "right" : "left"} fadeTo={cardIndex % 2 ? "right" : "left"} />
        </div>
      </> : null}
      <figure className="hobby-print">
        <div className="hobby-print-backing" aria-hidden="true" />
        <button type="button" onClick={onExpand} className="hobby-print-image"
          aria-label={`View ${card.title} details`} aria-haspopup="dialog">
          <Image src={card.image} alt={card.title} fill
            className="object-cover" sizes="(max-width: 767px) 90vw, 48vw" loading="lazy" />
          <span className="hobby-print-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
        </button>
        {card.quote ? <figcaption className="hobby-print-caption">{card.quote}</figcaption> : null}
      </figure>

      <div className="hobby-story-copy">
        <h3 id={`hobby-title-${cardIndex}`}>{card.title}</h3>
        <p className="hobby-description">{card.description}</p>
        <dl className="hobby-facts">
          {card.stats.map((stat) => (
            <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
          ))}
        </dl>
        <ul className="hobby-favorites" aria-label={`${card.title} favorites`}>
          {card.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <button type="button" onClick={onExpand} className="hobby-read-more" aria-haspopup="dialog"
          aria-label={`More about ${card.title}`}>
          More about this<ArrowUpRight size={19} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
});

const HobbiesRunway = React.memo(function HobbiesRunway({ hobbyRefs, onExpandCard }: {
  hobbyRefs: HobbyRefs;
  onExpandCard: (index: number) => void;
}) {
  const setHobbyRef = React.useCallback((index: number, element: HTMLDivElement | null) => {
    hobbyRefs.current[index] = element;
  }, [hobbyRefs]);
  const expandHandlers = React.useMemo(
    () => HOBBIES.map((_, index) => () => onExpandCard(index)), [onExpandCard],
  );
  return (
    <div className="hobbies-stories">
      {HOBBIES.map((card, cardIndex) => (
        <HobbyLane key={card.title} card={card} cardIndex={cardIndex}
          onExpand={expandHandlers[cardIndex]} registerRef={setHobbyRef} />
      ))}
    </div>
  );
});

function HobbiesSection() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  const scrollToSection = useSectionScroll();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const [dissolveActive, setDissolveActive] = React.useState(false);
  const [shouldRenderAurora, setShouldRenderAurora] = React.useState(false);
  const pendingCardRef = React.useRef<number | null>(null);
  const isClosingRef = React.useRef(false);
  const hobbyRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const auroraRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const syncAuroraVisibility = () => setShouldRenderAurora(desktopQuery.matches);

    syncAuroraVisibility();
    desktopQuery.addEventListener("change", syncAuroraVisibility);

    return () => desktopQuery.removeEventListener("change", syncAuroraVisibility);
  }, []);

  React.useEffect(() => {
    if (!shouldRenderAurora) return;

    const section = sectionRef.current;
    const aurora = auroraRef.current;
    if (!section || !aurora) return;

    let rafId = 0;

    const computeOpacity = () => {
      rafId = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.min(Math.max(rect.top / vh, 0), 1);
      const opacity = 0.6 - t * 0.35;
      aurora.style.opacity = String(opacity);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(computeOpacity);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    computeOpacity();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [shouldRenderAurora]);

  const handleExpandCard = React.useCallback((index: number) => {
    pendingCardRef.current = index;
    isClosingRef.current = false;
    setDissolveActive(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    isClosingRef.current = true;
    setDissolveActive(true);
  }, []);

  const handleDissolveCovered = React.useCallback(() => {
    if (isClosingRef.current) {
      setExpandedCard(null);
    } else {
      setExpandedCard(pendingCardRef.current);
    }
  }, []);

  const handleDissolveDone = React.useCallback(() => {
    setDissolveActive(false);
  }, []);

  const handleHobbyNavigate = React.useCallback(
    (targetId: string) => {
      scrollToSection(`#${targetId}`, {
        align: "center",
        duration: 0.9,
      });
    },
    [scrollToSection]
  );

  return (
    <section
      id="hobbies"
      data-snap-section="hobbies"
      aria-labelledby="hobbies-title"
      ref={sectionRef}
      className="hobbies-section relative bg-white md:bg-[#f6f4ef]"
    >
      {shouldRenderAurora ? (
        <div
          ref={auroraRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-1 hidden h-screen overflow-hidden md:block"
        >
          <Aurora
            colorStops={['#f7dd88', '#7147fc', '#ff0d96']}
            amplitude={0.8}
            speed={0.4}
            blend={0.7}
            grainAmount={0.09}
          />
        </div>
      ) : null}
      <div className="hobbies-background-grain" aria-hidden="true" />

      <HobbiesScrollSpyLayer
        sectionRef={sectionRef}
        hobbyRefs={hobbyRefs}
        isMobile={isMobile}
        onNavigate={handleHobbyNavigate}
      />

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

      <div className="hobbies-body relative z-1">
        <div className={HOBBIES_CONTENT_SHELL}>
          <HobbiesHeader onNavigate={handleHobbyNavigate} />
        </div>

        <div className={HOBBIES_CONTENT_SHELL}>
          <HobbiesRunway
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
          onClose={handleCloseModal}
        />
      )}

      <PixelDissolveOverlay
        active={dissolveActive}
        onCovered={handleDissolveCovered}
        onDone={handleDissolveDone}
        holdMs={700}
        revealMs={1000}
      />
    </section>
  );
}

export default HobbiesSection;
