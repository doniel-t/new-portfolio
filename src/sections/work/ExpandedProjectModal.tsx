"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Dither from "@/components/Dither";
import { LoadTransitionOverlay } from "@/components/InitialLoadTransition";
import type { Project } from "./types";

type ExpandedProjectModalProps = {
  projects: Project[];
  projectIndex: number;
  isMobile: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function ExpandedProjectModal({ projects, projectIndex, isMobile, onClose, onNavigate }: ExpandedProjectModalProps) {
  const project = projects[projectIndex];
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [projectIndex]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.addEventListener("keydown", handleEscape);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  if (!project) {
    return null;
  }

  const paragraphs = project.blogContent.split("\n\n");

  return (
    <>
      <div data-lenis-prevent className="fixed inset-0 z-[100] bg-[#0d0b08] animate-[fadeIn_0.2s_ease-out]" />
      <LoadTransitionOverlay blockPointerEvents />

      <div
        ref={scrollContainerRef}
        data-lenis-prevent
        className="fixed inset-0 z-[110] overflow-y-auto overscroll-contain"
      >
        <div className="min-h-screen bg-[#0d0b08] text-[#d4cdc4] relative">
          {!isMobile && (
            <div
              className="fixed inset-0 z-0 opacity-5"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 15%, black 40%, transparent 70%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 15%, black 40%, transparent 70%)",
              }}
            >
              <Dither
                waveColor={[165 / 100, 158 / 100, 141 / 100]}
                disableAnimation={false}
                enableMouseInteraction={false}
                colorNum={2}
                waveAmplitude={0.002}
                waveFrequency={1.5}
                waveSpeed={0.05}
              />
            </div>
          )}

          <div className="fixed inset-0 scanlines opacity-10 pointer-events-none z-10" />

          <div className="relative z-20">
            <header className="sticky top-0 z-30 bg-[#0d0b08]/80 backdrop-blur-md border-b border-[#d4cdc4]/10">
              <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-[#d4cdc4]/60 hover:text-[#d4cdc4] transition-colors font-mono text-xs tracking-widest"
                >
                  <ArrowLeft size={16} />
                  RETURN TO ARCHIVE
                </button>
                <div className="font-mono text-[10px] tracking-widest text-[#d4cdc4]/40">
                  [{String(projectIndex + 1).padStart(2, "0")}] / {projects.length.toString().padStart(2, "0")}
                </div>
              </div>
            </header>

            <div className="relative">
              <div className="relative h-60 sm:h-92">
                {project.image === "/placeholder-project.jpg" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0d0b08]">
                    <span className="font-mono text-6xl sm:text-8xl tracking-[0.3em] text-[#d4cdc4]/10 font-bold select-none">
                      [REDACTED]
                    </span>
                  </div>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover sepia opacity-60"
                    sizes="100vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[5px] overflow-hidden">
                  <div
                    className="w-[200%] h-full animate-[march_300s_linear_infinite]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #716D67 0px, #716D67 24px, transparent 24px, transparent 36px)",
                    }}
                  />
                </div>
              </div>

              <div className="max-w-4xl mx-auto px-6 mt-16 relative">
                <div className="font-mono text-[10px] tracking-widest text-[#d4cdc4]/40 mb-2 flex items-center gap-2">
                  <span>◇</span>
                  <span>PROJECT LOG</span>
                  <span className="flex-1 border-b border-dashed border-[#d4cdc4]/10" />
                  <span>DEPLOYED: {project.year}</span>
                </div>

                <h1 className="font-display text-5xl sm:text-7xl tracking-tight text-[#d4cdc4] mb-6 drop-shadow-lg">
                  {project.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 bg-[#d4cdc4]/10 text-[#d4cdc4]/70 tracking-wider border border-[#d4cdc4]/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-12">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/20 border border-[#d4cdc4]/20 text-[#d4cdc4]/80 font-mono text-xs tracking-widest transition-colors"
                    >
                      <Github size={16} />
                      SOURCE
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4cdc4]/10 hover:bg-[#d4cdc4]/20 border border-[#d4cdc4]/20 text-[#d4cdc4]/80 font-mono text-xs tracking-widest transition-colors"
                    >
                      <ExternalLink size={16} />
                      LIVE
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-24">
              <div className="border-t border-[#d4cdc4]/10 pt-10">
                <div className="font-mono text-[10px] tracking-widest text-[#d4cdc4]/40 mb-8 flex items-center gap-2">
                  <span>◇</span>
                  <span>DETAILED LOG</span>
                  <span className="flex-1 border-b border-dashed border-[#d4cdc4]/10" />
                </div>

                <div className="space-y-6">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg text-[#d4cdc4]/75 leading-relaxed font-sans">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-16 flex items-center gap-4">
                <div className="w-12 h-px bg-[#d4cdc4]/30" />
                <div className="w-3 h-3 rotate-45 border border-[#d4cdc4]/30" />
                <div className="flex-1 h-px bg-gradient-to-r from-[#d4cdc4]/20 to-transparent" />
              </div>

              <div className="mt-8 flex justify-between items-center">
                {projectIndex > 0 ? (
                  <button
                    onClick={() => onNavigate(projectIndex - 1)}
                    className="font-mono text-xs tracking-widest text-[#d4cdc4]/50 hover:text-[#d4cdc4] transition-colors"
                  >
                    ◁ {projects[projectIndex - 1].title}
                  </button>
                ) : (
                  <div />
                )}
                {projectIndex < projects.length - 1 ? (
                  <button
                    onClick={() => onNavigate(projectIndex + 1)}
                    className="font-mono text-xs tracking-widest text-[#d4cdc4]/50 hover:text-[#d4cdc4] transition-colors"
                  >
                    {projects[projectIndex + 1].title} ▷
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpandedProjectModal;
