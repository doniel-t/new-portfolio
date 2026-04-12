"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import DecodingWord from "@/components/DecodingWord";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import Terminal from "./BarebonesTerminal";
import ExpandedProjectModal from "./ExpandedProjectModal";
import { PROJECTS } from "./data";

const terminalEase = [0.16, 1, 0.3, 1] as const;

function WorkSection() {
  const introRef = React.useRef<HTMLDivElement | null>(null);
  const terminalRef = React.useRef<HTMLDivElement | null>(null);
  const introInView = useInView(introRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const terminalIsFocused = useInView(terminalRef, {
    amount: 0.5,
    margin: "0px",
  });
  const isMobile = useIsMobile();
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [isBooted, setIsBooted] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("terminal-booted") === "true";
    }
    return false;
  });

  const handleSelectProject = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleOpenProject = useCallback((index: number) => {
    setSelectedIndex(index);
    setExpandedProject(index);
  }, []);

  const handleCloseProject = useCallback(() => {
    setExpandedProject(null);
  }, []);

  const handleNavigateProject = useCallback((index: number) => {
    setSelectedIndex(index);
    setExpandedProject(index);
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooted(true);
    sessionStorage.setItem("terminal-booted", "true");
  }, []);

  useEffect(() => {
    if (terminalIsFocused) {
      setTerminalExpanded(true);
    }
  }, [terminalIsFocused]);

  const terminalSize = terminalExpanded
    ? {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      }
    : {
        width: isMobile ? "calc(100vw - 28px)" : "min(1120px, calc(100vw - 96px))",
        height: isMobile ? "min(620px, calc(100vh - 72px))" : "min(680px, calc(100vh - 104px))",
        borderRadius: 8,
      };

  return (
    <section
      id="projects"
      data-snap-section="projects"
      className="relative min-h-[185vh] bg-[#0d0b08]"
    >
      <div className="bg-[#3C3A35] h-4" />
      <div className="absolute inset-0 work-section-noise pointer-events-none z-0" />
      <div className="relative w-full h-0" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "0px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#3C3A35"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
            direction="down"
          />
        </div>
      </div>

      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(212,205,196,0.08),transparent_32%,rgba(122,154,90,0.08)_68%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[#d4cdc4]/20" />
        <div className="absolute inset-y-0 left-[12%] w-px bg-[#d4cdc4]/10" />
        <div className="absolute inset-y-0 right-[18%] w-px bg-[#d4cdc4]/10" />

        <motion.div
          ref={introRef}
          initial="hidden"
          animate={introInView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: isMobile ? 0 : 0.15,
                delayChildren: isMobile ? 0 : 0.05,
              },
            },
          }}
          className="pointer-events-none absolute left-[5%] top-20 z-[2] max-w-4xl lg:left-[10%]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: isMobile ? 0 : 12 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: isMobile ? 0.3 : 0.5, ease: terminalEase },
              },
            }}
            animate={{ opacity: terminalExpanded ? 0 : 1, y: terminalExpanded ? -18 : 0 }}
            className="flex items-center gap-4 mb-3"
          >
            <span className="text-sm tracking-widest text-[#d4cdc4]/50 font-bold">
              [WORK_ARCHIVE]
            </span>
            <span className="hidden sm:inline text-sm tracking-widest text-[#7a9a5a]/80 font-mono">
              terminal focus lock armed
            </span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: isMobile ? 0 : 12 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: isMobile ? 0.3 : 0.6, ease: terminalEase },
              },
            }}
            animate={{ opacity: terminalExpanded ? 0 : 1, y: terminalExpanded ? -24 : 0 }}
            transition={{ duration: 0.45, ease: terminalEase }}
            className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-[#d4cdc4] drop-shadow-md mb-6"
          >
            {"Projects & Work".split(" ").map((word, i, arr) => (
              <span key={`work-title-${i}`} className="inline-block">
                <DecodingWord
                  word={word}
                  startDelayMs={isMobile ? 0 : i * 180}
                  active={introInView}
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
                  ease: terminalEase,
                  delay: isMobile ? 0 : 0.1,
                },
              },
            }}
            animate={{ opacity: terminalExpanded ? 0 : 1, y: terminalExpanded ? -18 : 0 }}
            transition={{ duration: 0.45, ease: terminalEase }}
            className="text-lg sm:text-xl text-[#d4cdc4]/70 font-medium max-w-prose"
          >
            A project console for the build notes, live links, and archive entries.
          </motion.p>
        </motion.div>

        <motion.div
          ref={terminalRef}
          initial={false}
          animate={terminalSize}
          transition={{ duration: terminalExpanded ? 0.82 : 0.55, ease: terminalEase }}
          className="absolute left-1/2 top-1/2 z-[3] overflow-hidden border border-[#d4cdc4]/20 bg-[#0d0b08] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{ x: "-50%", y: "-50%" }}
        >
          <Terminal
            projects={PROJECTS}
            selectedIndex={selectedIndex}
            onSelectProject={handleSelectProject}
            onOpenProject={handleOpenProject}
            isBooted={isBooted}
            onBootComplete={handleBootComplete}
            isMobile={isMobile}
            isExpanded={terminalExpanded}
          />
        </motion.div>

        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: terminalExpanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: terminalEase }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-[4] -translate-x-1/2 font-mono text-[10px] tracking-[0.22em] text-[#d4cdc4]/35"
        >
          SCROLL BUFFER / PROJECT CONSOLE
        </motion.div>
      </div>

      {expandedProject !== null && (
        <ExpandedProjectModal
          projects={PROJECTS}
          projectIndex={expandedProject}
          isMobile={isMobile}
          onClose={handleCloseProject}
          onNavigate={handleNavigateProject}
        />
      )}
    </section>
  );
}

export default WorkSection;
