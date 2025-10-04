"use client";

import Image from "next/image";
import { motion, type Variants, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";

export default function Home() {
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

  const headingContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const headingWord: Variants = {
    hidden: { y: 24, opacity: 0, filter: "blur(8px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

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
    <main className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center p-8 sm:p-16">
      <motion.div
        className="relative grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 items-center"
        variants={gridContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={leftSection}>
          <motion.p variants={childItem} className="text-sm tracking-widest text-muted mb-3">PORTFOLIO</motion.p>
          <motion.h1 variants={childItem} className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-foreground drop-shadow-md mb-4">
            <motion.span variants={headingContainer} className="inline-block">
              {headingWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={headingWord}
                  className="inline-block will-change-transform"
                  style={{ display: "inline-block" }}
                >
                  {word}
                  {i < headingWords.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </motion.span>
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
  );
}
