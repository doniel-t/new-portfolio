"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Dither from "@/components/Dither";
import type { Project } from "./types";

function LoadingSpinner() {
  return (
    <div className="relative w-10 h-10">
      <div
        className="absolute inset-0 border-2 border-[#d4cdc4]/25 border-t-[#d4cdc4]/80 rounded-full animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
      <div
        className="absolute inset-1 border-2 border-[#d4cdc4]/20 border-b-[#d4cdc4]/60 rounded-full animate-spin"
        style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
      />
    </div>
  );
}

type ExpandedProjectModalProps = {
  projects: Project[];
  projectIndex: number;
  isMobile: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function ExpandedProjectModal({ projects, projectIndex, isMobile, onClose, onNavigate }: ExpandedProjectModalProps) {
  const project = projects[projectIndex];
  const [imageLoaded, setImageLoaded] = React.useState(project.image === "/placeholder-project.jpg");
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const isReady = imageLoaded && minTimeElapsed;

  React.useEffect(() => {
    setImageLoaded(project.image === "/placeholder-project.jpg");
  }, [project.image]);

  React.useEffect(() => {
    setMinTimeElapsed(false);
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    return () => clearTimeout(timer);
  }, [projectIndex]);

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

    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!project) {
    return null;
  }

  const paragraphs = project.blogContent.split("\n\n");

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#0d0b08] animate-[fadeIn_0.2s_ease-out]" />

      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${
          isReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <LoadingSpinner />
      </div>

      <div
        ref={scrollContainerRef}
        className={`fixed inset-0 z-[55] overflow-y-auto transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
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
                    onLoad={() => setImageLoaded(true)}
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
