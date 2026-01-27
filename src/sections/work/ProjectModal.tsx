"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Github, ExternalLink } from "lucide-react";
import PixelDivider from "@/components/PixelDivider";
import Dither from "@/components/Dither";
import type { Project } from "./types";

function LoadingSpinner() {
  return (
    <div className="relative w-10 h-10">
      <div
        className="absolute inset-0 border-2 border-muted/30 border-t-muted/80 rounded-full animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
      <div
        className="absolute inset-1 border-2 border-muted/20 border-b-muted/60 rounded-full animate-spin"
        style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
      />
    </div>
  );
}

type ProjectModalProps = {
  project: Project;
  projectIndex: number;
  totalProjects: number;
  isMobile: boolean;
  onClose: () => void;
};

function ProjectModal({
  project,
  projectIndex,
  totalProjects,
  isMobile,
  onClose,
}: ProjectModalProps) {
  const isPlaceholder = project.image === "/placeholder-project.jpg";
  const [imageLoaded, setImageLoaded] = useState(isPlaceholder);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const isReady = imageLoaded && minTimeElapsed;

  // Minimum loading time of 0.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Close on escape key and prevent scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [onClose]);

  return (
    <>
      {/* Solid black base - prevents white flicker */}
      <div className="fixed inset-0 z-50 bg-[#0d0b08] animate-[fadeIn_0.2s_ease-out]" />

      {/* Loading spinner - fades out when ready */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <LoadingSpinner />
      </div>

      {/* Backdrop with blurred project image */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {project.image !== "/placeholder-project.jpg" && (
          <Image
            src={project.image}
            alt=""
            fill
            className="object-cover scale-110 blur-3xl sepia"
            sizes="384px"
            quality={25}
          />
        )}
        <div className="absolute inset-0 bg-[#0d0b08]/70" />
        {!isMobile && (
          <div className="absolute inset-0 opacity-0 pointer-events-none animate-[fadeInDither_0.5s_ease-out_0.3s_forwards]">
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
      </div>

      {/* Modal Content */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0d0b08] pointer-events-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {project.image === "/placeholder-project.jpg" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d0b08]">
                <span className="font-mono text-6xl sm:text-8xl lg:text-9xl tracking-[0.3em] text-white/10 font-bold select-none">
                  [REDACTED]
                </span>
              </div>
            ) : (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover sepia"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                priority
                onLoad={() => setImageLoaded(true)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/80 to-[#0d0b08]/50" />
            <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 z-20" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/40 z-20" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40 z-20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 z-20" />

          {/* Pixel animation at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 z-10 overflow-hidden pointer-events-none opacity-40">
            <PixelDivider
              color="#444"
              pixelSize={isMobile ? 12 : 48}
              durationSec={7}
              rise="-160%"
              streamsPerCol={3}
              direction="up"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            {/* Index tag */}
            <div className="font-mono text-sm tracking-widest text-white/50 uppercase mb-4">
              [{String(projectIndex + 1).padStart(2, "0")}] /{" "}
              {totalProjects.toString().padStart(2, "0")}
            </div>

            <h2 className="font-display text-5xl sm:text-6xl lg:text-8xl tracking-tight text-white mb-4 drop-shadow-lg">
              {project.title}
            </h2>

            {/* Year */}
            <div className="font-mono text-sm text-white/50 mb-6">
              DEPLOYED: {project.year}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-3 mb-10">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-block text-sm font-mono text-white/90 bg-white/5 backdrop-blur-xl px-4 py-2 rounded border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Description */}
              <div>
                <div className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
                  Overview
                </div>
                <p className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-8">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 font-mono text-sm transition-colors"
                    >
                      <Github size={18} />
                      VIEW SOURCE
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 font-mono text-sm transition-colors"
                    >
                      <ExternalLink size={18} />
                      LIVE DEMO
                    </a>
                  )}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <div className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
                  Technical Challenges
                </div>
                <p className="text-lg text-white/70 leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="mt-12 flex items-center gap-4">
              <div className="w-12 h-px bg-white/30" />
              <div className="w-3 h-3 rotate-45 border border-white/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;
