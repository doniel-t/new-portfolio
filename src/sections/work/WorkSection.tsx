"use client";

import React, { useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import DecodingWord from "@/components/DecodingWord";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import Terminal from "./Terminal";
import ProjectModal from "./ProjectModal";
import { PROJECTS } from "./data";

function WorkSection() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isInViewOnce = useInView(containerRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const isMobile = useIsMobile();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openedProject, setOpenedProject] = useState<number | null>(null);
  const [isBooted, setIsBooted] = useState(false);

  const handleSelectProject = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleOpenProject = useCallback((index: number) => {
    setOpenedProject(index);
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooted(true);
  }, []);

  return (
    <section id="projects" className="relative bg-[#0d0b08]">
      {/* Animated noise texture background */}
      <div className="absolute inset-0 work-section-noise pointer-events-none z-0" />
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "0px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#282520"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
            direction="down"
          />
        </div>
      </div>
      

      <div ref={containerRef} className="relative pt-32 pb-20 z-[1]">
        {/* Section header */}
        <div className="pl-[5%] pr-[5%] lg:pl-[10%] mb-16">
          <motion.div
            initial="hidden"
            animate={isInViewOnce ? "show" : "hidden"}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: isMobile ? 0 : 0.15,
                  delayChildren: isMobile ? 0 : 0.05,
                },
              },
            }}
          >
            {/* Status bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: isMobile ? 0 : 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: isMobile ? 0.3 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="flex items-center gap-4 mb-3"
            >
              <span className="text-sm tracking-widest text-[#d4cdc4]/50 font-bold">
                [WORK_ARCHIVE]
              </span>
              <span className="hidden sm:inline text-sm tracking-widest text-[#7a9a5a]/80 font-mono">
                System Status: ONLINE
              </span>
            </motion.div>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: isMobile ? 0 : 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: isMobile ? 0.3 : 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-[#d4cdc4] drop-shadow-md mb-6"
            >
              {"Projects & Work".split(" ").map((word, i, arr) => (
                <span
                  key={`work-title-${i}`}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  <DecodingWord
                    word={word}
                    startDelayMs={isMobile ? 0 : i * 180}
                    active={isInViewOnce}
                  />
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
              className="text-lg sm:text-xl text-[#d4cdc4]/70 font-medium max-w-prose"
            >
              A collection of projects I&apos;ve built, from web applications to
              creative experiments. Each one taught me something new.
            </motion.p>
          </motion.div>
        </div>

        {/* Terminal */}
        <div className="px-[5%] lg:px-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInViewOnce ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Terminal
              projects={PROJECTS}
              selectedIndex={selectedIndex}
              onSelectProject={handleSelectProject}
              onOpenProject={handleOpenProject}
              isBooted={isBooted}
              onBootComplete={handleBootComplete}
              isMobile={isMobile}
            />
          </motion.div>
        </div>
      </div>

      {/* Project Modal */}
      {openedProject !== null && (
        <ProjectModal
          project={PROJECTS[openedProject]}
          projectIndex={openedProject}
          totalProjects={PROJECTS.length}
          isMobile={isMobile}
          onClose={() => setOpenedProject(null)}
        />
      )}
    </section>
  );
}

export default WorkSection;
