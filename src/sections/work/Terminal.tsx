"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "./types";

// ASCII spinner frames - NieR style
const SPINNER_FRAMES = ["◇", "◈", "◆", "◈"];

type BootLine = {
  text: string;
  duration: number; // ms to show this step
  isComplete?: boolean;
};

const BOOT_SEQUENCE: BootLine[] = [
  { text: "ESTABLISHING UPLINK TO STORAGE", duration: 800 },
  { text: "LOADING PROJECT ARCHIVE", duration: 600 },
  { text: "VERIFYING BLACK BOX INTEGRITY", duration: 700 },
  { text: "SYNCHRONIZING COMBAT DATA", duration: 500 },
  { text: "SYSTEM READY", duration: 400, isComplete: true },
];

type TerminalProps = {
  projects: Project[];
  selectedIndex: number;
  onSelectProject: (index: number) => void;
  onOpenProject: (index: number) => void;
  isBooted: boolean;
  onBootComplete: () => void;
  isMobile: boolean;
};

function Terminal({
  projects,
  selectedIndex,
  onSelectProject,
  onOpenProject,
  isBooted,
  onBootComplete,
  isMobile,
}: TerminalProps) {
  const [bootStep, setBootStep] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showGlitchOverlay, setShowGlitchOverlay] = useState(false);
  const bootStartedRef = useRef(false);
  
  // Track when terminal is in view
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, margin: "-100px" });

  // Random glitch overlay effect
  useEffect(() => {
    if (isMobile) return;
    
    const triggerGlitchOverlay = () => {
      if (Math.random() > 0.7) {
        setShowGlitchOverlay(true);
        setTimeout(() => setShowGlitchOverlay(false), 100 + Math.random() * 150);
      }
    };

    const interval = setInterval(triggerGlitchOverlay, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const selectedProject = projects[selectedIndex] || null;

  // Spinner animation
  useEffect(() => {
    if (isBooted || isMobile || bootStep >= BOOT_SEQUENCE.length || !isInView) return;

    const interval = setInterval(() => {
      setSpinnerFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, 80);

    return () => clearInterval(interval);
  }, [isBooted, isMobile, bootStep, isInView]);

  // Boot sequence animation - only starts when in view
  useEffect(() => {
    if (!isInView) return;

    if (isBooted) {
      setBootStep(BOOT_SEQUENCE.length);
      setCompletedSteps(BOOT_SEQUENCE.map((_, i) => i));
      setShowProjects(true);
      return;
    }

    if (isMobile) {
      // Skip boot animation on mobile
      setBootStep(BOOT_SEQUENCE.length);
      setCompletedSteps(BOOT_SEQUENCE.map((_, i) => i));
      setShowProjects(true);
      onBootComplete();
      return;
    }

    // Prevent double-starting
    if (bootStartedRef.current && bootStep === 0) return;
    bootStartedRef.current = true;

    if (bootStep < BOOT_SEQUENCE.length) {
      const currentLine = BOOT_SEQUENCE[bootStep];
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, bootStep]);
        setBootStep((prev) => prev + 1);
      }, currentLine.duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowProjects(true);
        onBootComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [bootStep, isBooted, isMobile, onBootComplete, isInView]);

  // Keyboard navigation
  useEffect(() => {
    if (!showProjects || isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onSelectProject(Math.max(0, selectedIndex - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          onSelectProject(Math.min(projects.length - 1, selectedIndex + 1));
          break;
        case "Enter":
          e.preventDefault();
          triggerGlitch(selectedIndex);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProjects, selectedIndex, projects.length, onSelectProject, isMobile]);

  const triggerGlitch = useCallback(
    (index: number) => {
      setGlitchIndex(index);
      setTimeout(() => {
        setGlitchIndex(null);
        onOpenProject(index);
      }, 150);
    },
    [onOpenProject]
  );

  const handleProjectClick = (index: number) => {
    onSelectProject(index);
    triggerGlitch(index);
  };

  return (
    <div
      ref={terminalRef}
      className="relative w-full min-h-[500px] lg:min-h-[600px] bg-[#0d0b08] overflow-hidden"
    >
      {/* Chromatic aberration layers */}
      <div className="absolute inset-0 cctv-chromatic-r pointer-events-none z-[25]" />
      <div className="absolute inset-0 cctv-chromatic-c pointer-events-none z-[25]" />
      
      {/* CCTV Noise overlay */}
      <div className="absolute inset-0 cctv-noise-dark pointer-events-none z-20" />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 terminal-scanline-dark pointer-events-none z-20" />
      
      {/* CCTV Interlace effect */}
      <div className="absolute inset-0 cctv-interlace-dark pointer-events-none z-20" />

      {/* Random glitch overlay */}
      {showGlitchOverlay && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div 
            className="absolute w-full h-[3px] bg-[#d4cdc4]/10"
            style={{ top: `${Math.random() * 100}%` }}
          />
          <div 
            className="absolute w-full h-[2px] bg-[#d4cdc4]/20"
            style={{ top: `${Math.random() * 100}%` }}
          />
        </div>
      )}

      {/* NieR-style corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#d4cdc4]/20 z-10" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#d4cdc4]/20 z-10" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#d4cdc4]/20 z-10" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#d4cdc4]/20 z-10" />

      {/* Terminal header bar */}
      <div className="relative z-0 bg-[#1a1714] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#2a2520] border border-[#3a3530] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#d4cdc4]/60" />
          </div>
          <span className="font-mono text-xs tracking-widest text-[#d4cdc4]/80 uppercase">
            DoNeL Terminal // Project Archive
          </span>
        </div>
        <div className="font-mono text-xs text-[#d4cdc4]/50 flex items-center gap-2">
          <span className="hidden sm:inline text-[#d4cdc4]/30">◆</span>
          <span>v2.14B</span>
          <span className="text-[#d4cdc4]/30">|</span>
          <span>{projects.length} RECORDS</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-0 flex flex-col lg:flex-row h-[calc(100%-40px)]">
        {/* Left panel: Terminal/Project list */}
        <div className="flex-1 lg:flex-none lg:w-[55%] p-4 sm:p-6 font-mono text-sm lg:border-r border-[#d4cdc4]/10 overflow-y-auto">
          {/* Boot sequence */}
          {!isMobile && (
            <div className="space-y-1.5 mb-6">
              {/* NieR-style header */}
              <div className="text-[10px] text-[#d4cdc4]/40 tracking-widest mb-3 flex items-center gap-2">
                <span>◇</span>
                <span>SYSTEM INITIALIZATION</span>
                <span className="flex-1 border-b border-dashed border-[#d4cdc4]/10" />
              </div>
              
              {BOOT_SEQUENCE.map((line, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = bootStep === index && !isCompleted;
                const isVisible = index <= bootStep;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3 text-[#d4cdc4]/60 font-mono text-xs"
                  >
                    {/* NieR-style status indicator */}
                    <span className="w-5 text-center">
                      {line.isComplete ? (
                        isCompleted ? (
                          <span className="text-[#7a9a5a]">◆</span>
                        ) : (
                          <span className="text-[#a09a6b]">{SPINNER_FRAMES[spinnerFrame]}</span>
                        )
                      ) : isCompleted ? (
                        <span className="text-[#7a9a5a]">◆</span>
                      ) : isCurrent ? (
                        <span className="text-[#a09a6b]">{SPINNER_FRAMES[spinnerFrame]}</span>
                      ) : (
                        <span className="text-[#d4cdc4]/30">◇</span>
                      )}
                    </span>

                    {/* Status text */}
                    <span
                      className={`tracking-wider ${
                        line.isComplete && isCompleted
                          ? "text-[#7a9a5a] font-bold"
                          : isCompleted
                          ? "text-[#d4cdc4]/60"
                          : isCurrent
                          ? "text-[#d4cdc4]/70"
                          : "text-[#d4cdc4]/30"
                      }`}
                    >
                      {line.text}
                      {isCurrent && !line.isComplete && (
                        <span className="text-[#d4cdc4]/40 animate-pulse">_</span>
                      )}
                    </span>

                    {/* Completion indicator */}
                    {isCompleted && !line.isComplete && (
                      <span className="text-[#7a9a5a] text-[10px] tracking-widest">[OK]</span>
                    )}
                  </motion.div>
                );
              })}

              {/* Separator line after boot - NieR style */}
              {bootStep >= BOOT_SEQUENCE.length && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="my-4 origin-left flex items-center gap-2"
                >
                  <span className="text-[#d4cdc4]/30 text-[10px]">◇</span>
                  <div className="flex-1 border-t border-[#d4cdc4]/10" />
                  <span className="text-[#d4cdc4]/30 text-[10px]">◇</span>
                </motion.div>
              )}
            </div>
          )}

          {/* Header after boot */}
          {showProjects && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* NieR-style section header */}
              <div className="text-[10px] text-[#d4cdc4]/40 tracking-widest mb-1 flex items-center gap-2">
                <span>◇</span>
                <span>PROJECT ARCHIVE</span>
              </div>
              <div className="text-[#d4cdc4]/60 text-xs mb-1 tracking-wide">
                {">"} DoNEL Work Archive v2.14B
              </div>
              <div className="text-[#d4cdc4]/40 text-xs mb-4 tracking-wide">
                {">"} {isMobile ? "Tap to access project data." : "Navigate with ↑↓ keys. Press ENTER to access."}
              </div>

              {/* Project list */}
              <div className="space-y-0.5">
                {projects.map((project, index) => {
                  const isSelected = selectedIndex === index;
                  const isGlitching = glitchIndex === index;
                  const techPreview = project.techStack.slice(0, 2).join(" · ");

                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => handleProjectClick(index)}
                      onMouseEnter={() => !isMobile && onSelectProject(index)}
                      className={`w-full text-left px-3 py-2 transition-all duration-100 flex items-center gap-2 group border-l-2 ${
                        isSelected
                          ? "bg-[#d4cdc4]/10 text-[#d4cdc4] border-l-[#d4cdc4]/50"
                          : "text-[#d4cdc4]/60 hover:bg-[#d4cdc4]/5 hover:text-[#d4cdc4]/80 border-l-transparent hover:border-l-[#d4cdc4]/20"
                      } ${isGlitching ? "terminal-glitch" : ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      aria-selected={isSelected}
                      role="option"
                    >
                      {/* NieR-style index */}
                      <span className={`text-[10px] tracking-wider ${isSelected ? "text-[#d4cdc4]/70" : "text-[#d4cdc4]/40"}`}>
                        {isSelected ? "◆" : "◇"} {String(index + 1).padStart(2, "0")}
                      </span>
                      
                      {/* Project title */}
                      <span className="flex-1 truncate text-xs tracking-wide">{project.title}</span>
                      
                      {/* Dotted separator */}
                      <span className={`hidden sm:inline text-[10px] ${isSelected ? "text-[#d4cdc4]/40" : "text-[#d4cdc4]/20"}`}>
                        {"·".repeat(Math.max(0, Math.min(12, 18 - project.title.length)))}
                      </span>
                      
                      {/* Tech preview */}
                      <span className={`text-[10px] tracking-wider ${isSelected ? "text-[#d4cdc4]/50" : "text-[#d4cdc4]/30"}`}>
                        [{techPreview}]
                      </span>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <span className="text-[#d4cdc4]/50 ml-1 text-xs">
                          {"◁"}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* NieR-style cursor/prompt */}
              <div className="mt-6 flex items-center gap-2 text-[#d4cdc4]/50 text-xs">
                <span className="text-[#d4cdc4]/30">◇</span>
                <span className="tracking-wider">AWAITING INPUT</span>
                <span className="inline-block w-2 h-3 bg-[#d4cdc4]/40 animate-pulse" />
              </div>
              
              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#d4cdc4]/10 flex items-center justify-between text-[10px] text-[#d4cdc4]/40 tracking-widest">
                <span>RECORDS: {projects.length}</span>
                <span>STATUS: NOMINAL</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right panel: Preview (desktop only) */}
        {!isMobile && showProjects && (
          <div className="hidden lg:flex lg:flex-1 flex-col bg-[#0d0b08] relative">
            {/* NieR-style panel header */}
            <div className="px-4 py-2 border-b border-[#d4cdc4]/10 flex items-center justify-between">
              <span className="text-[10px] text-[#d4cdc4]/40 tracking-widest flex items-center gap-2">
                <span>◇</span>
                <span>DATA PREVIEW</span>
              </span>
              <span className="text-[10px] text-[#d4cdc4]/40 tracking-widest">
                {selectedProject ? `ID: ${String(selectedIndex + 1).padStart(3, "0")}` : "---"}
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col"
                >
                  {/* Preview image with CCTV overlay */}
                  <div className="relative h-40 overflow-hidden border-b border-[#d4cdc4]/10">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover opacity-80"
                      sizes="45vw"
                    />
                    {/* Image overlay effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-transparent to-transparent" />
                    <div className="absolute inset-0 cctv-interlace-dark opacity-50" />
                    
                    {/* Year badge - NieR style */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[#0d0b08]/80 border border-[#d4cdc4]/20 font-mono text-[10px] text-[#d4cdc4]/80 tracking-widest flex items-center gap-1">
                      <span className="text-[#d4cdc4]/50">◆</span>
                      <span>{selectedProject.year}</span>
                    </div>
                    
                    {/* Corner brackets on image */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d4cdc4]/20" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d4cdc4]/20" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d4cdc4]/20" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d4cdc4]/20" />
                  </div>

                  {/* Preview content */}
                  <div className="flex-1 p-4 flex flex-col">
                    {/* Title with NieR styling */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#d4cdc4]/50 text-sm">◆</span>
                      <h3 className="font-display text-xl text-[#d4cdc4] tracking-wide">
                        {selectedProject.title}
                      </h3>
                    </div>

                    {/* Tech stack - NieR style tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[#d4cdc4]/10 text-[#d4cdc4]/70 tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Description preview */}
                    <div className="mb-4 flex-1">
                      <div className="text-[10px] text-[#d4cdc4]/40 tracking-widest mb-1">◇ DESCRIPTION</div>
                      <p className="text-xs text-[#d4cdc4]/60 line-clamp-3 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Actions - NieR style buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenProject(selectedIndex)}
                        className="flex-1 px-4 py-2 bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/20 text-[#d4cdc4] font-mono text-[10px] tracking-widest transition-colors flex items-center justify-center gap-2 group"
                      >
                        <span className="text-[#d4cdc4]/50 group-hover:text-[#d4cdc4]/70">◆</span>
                        <span>ACCESS DATA</span>
                      </button>

                      {selectedProject.repoUrl && (
                        <a
                          href={selectedProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/20 text-[#d4cdc4]/70 transition-colors"
                          aria-label="View repository"
                        >
                          <Github size={16} />
                        </a>
                      )}

                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/20 text-[#d4cdc4]/70 transition-colors"
                          aria-label="View live site"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center text-[#d4cdc4]/40 font-mono">
                    <div className="text-2xl mb-2">◇</div>
                    <div className="text-[10px] tracking-widest mb-1">[NO DATA SELECTED]</div>
                    <div className="text-[10px] tracking-wider text-[#d4cdc4]/30">Navigate to access project files</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>


    </div>
  );
}

export default Terminal;
