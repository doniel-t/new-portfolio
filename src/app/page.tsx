"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";
import DecodingWord from "@/components/DecodingWord";
import PixelDivider from "@/components/PixelDivider";
import BackgroundLineArt from "@/components/BackgroundLineArt";
import Dither from "@/components/Dither";
import DotGrid from "@/components/DotGrid";

export default function Home() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headingText = "Modern web experiences with a refined, understated aesthetic.";
  const headingWords = headingText.split(" ");

  const gridContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const leftSection: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const childItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const rightSection: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
            enableMouseInteraction={false}
            mouseRadius={0.5}
            colorNum={2}
            waveAmplitude={0.002}
            waveFrequency={2.2}
            waveSpeed={0.09}
          />
        </div>
      {/* Pixelated backdrop filter at top - only visible when scrolled */}
      {/* <div 
        className="fixed top-0 left-0 right-0 h-32 z-50 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isScrolled ? 1 : 0,
          backdropFilter: 'blur(12px) contrast(1.15) saturate(0.9)',
          WebkitBackdropFilter: 'blur(12px) contrast(1.15) saturate(0.9)',
          maskImage: `
            repeating-linear-gradient(0deg, black, black 4px, transparent 4px, transparent 5px),
            repeating-linear-gradient(90deg, black, black 4px, transparent 4px, transparent 5px),
            linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(0deg, black, black 4px, transparent 4px, transparent 5px),
            repeating-linear-gradient(90deg, black, black 4px, transparent 4px, transparent 5px),
            linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      /> */}
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
                    <DecodingWord word={word} startDelayMs={i * 250} />
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
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Work <ArrowRight size={18} />
              </motion.a>
              <motion.a
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 border border-muted/40 text-foreground hover:bg-accent/10 transition-colors"
                href="#contact"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            variants={rightSection}
            style={{ rotateX, rotateY, x: shiftX, y: shiftY, transformPerspective: 800 }}
            onMouseMove={handleParallaxMove}
            onMouseLeave={resetParallax}
          >
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-accent/20 blur-2xl" />
            <div className="absolute -inset-x-12 -bottom-10 -z-10 h-36 bg-green-blob rounded-full blur-3xl opacity-70" aria-hidden />
            <PixelTransition
              gridSize={24}
              pixelColor="#1C1303"
              animationStepDuration={0.75}
              startActive
              aspectRatio="100%"
              autoplayReveal
              autoplayDelayMs={150}
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
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </main>
      {/* Pixelated divider overlay (no extra layout height) */}
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider color={"#130e05"} pixelSize={24} durationSec={8} rise="-200%" streamsPerCol={4} />
        </div>
      </div>

      {/* Projects Section */}
      <section id="work" className="relative min-h-screen w-full py-20 sm:py-28">
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
    </>
  );
}

function InViewAboutBlock() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={containerRef}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.15, delayChildren: 0.05 },
              },
            }}
            className="mb-10 sm:mb-12"
          >
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-muted"
            >
              {/* Unscramble heading when in view */}
              {"About me".split(" ").map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block" style={{ display: "inline-block" }}>
                  <DecodingWord word={word} startDelayMs={i * 180} active={isInViewOnce} />{i < 1 ? "\u00A0" : ""}
                </span>
              ))}
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 } } }}
              className="mt-2 text-muted/80"
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
                  <DecodingWord word={word} startDelayMs={i * 5} active={isInViewOnce} />{i < arr.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </motion.p>
    </motion.div>
  );
}
