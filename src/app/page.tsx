"use client";

import Image from "next/image";
import { motion, type Variants, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";
import DecodingWord from "@/components/DecodingWord";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PixelDivider from "@/components/PixelDivider";
import Dither from "@/components/Dither";

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
          waveColor={[165/100, 158/100, 141/100]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.5}
          colorNum={2}
          waveAmplitude={0.002}
          waveFrequency={2.2}
          waveSpeed={0.09}
        />
      </div>
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
        <PixelDivider color={"#1C1303"} pixelSize={20} durationSec={8} rise="-200%" streamsPerCol={6} />
      </div>
    </div>

    {/* Projects Section */}
    <section id="work" className="relative min-h-screen w-full py-20 sm:py-28">
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: "var(--dark)" }} />
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
        <div className="mb-10 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">Selected Work</h2>
          <p className="mt-2 text-foreground/80">Placeholder projects showcasing layout.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="bg-primary/95 hover:bg-primary transition-colors">
              <CardHeader>
                <CardTitle>Project {idx + 1}</CardTitle>
                <CardDescription>Short one-line description.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md border border-muted/30 bg-background/40">
                  <div className="flex h-full items-center justify-center text-muted">Preview</div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Button size="sm">View</Button>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
