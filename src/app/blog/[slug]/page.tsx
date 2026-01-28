"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Dither from "@/components/Dither";
import { PROJECTS } from "@/sections/work/data";
import { useIsMobile } from "@/hooks/useIsMobile";

function navigateWithTransition(router: ReturnType<typeof useRouter>, url: string) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      router.push(url);
    });
  } else {
    router.push(url);
  }
}

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const slug = params.slug as string;

  const project = PROJECTS.find((p) => p.slug === slug);
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d0b08] flex items-center justify-center">
        <div className="text-center font-mono text-[#d4cdc4]">
          <div className="text-4xl mb-4">◇</div>
          <div className="text-sm tracking-widest mb-2">[DATA NOT FOUND]</div>
          <button
            onClick={() => navigateWithTransition(router, "/#projects")}
            className="text-xs tracking-widest text-[#d4cdc4]/60 hover:text-[#d4cdc4] transition-colors"
          >
            ◆ RETURN TO ARCHIVE
          </button>
        </div>
      </div>
    );
  }

  const paragraphs = project.blogContent.split("\n\n");

  return (
    <div className="min-h-screen bg-[#0d0b08] text-[#d4cdc4] relative">
      {/* Dither wave background with CSS mask for smooth fade */}
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

      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines opacity-10 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0d0b08]/80 backdrop-blur-md border-b border-[#d4cdc4]/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigateWithTransition(router, "/#projects")}
              className="flex items-center gap-2 text-[#d4cdc4]/60 hover:text-[#d4cdc4] transition-colors font-mono text-xs tracking-widest"
            >
              <ArrowLeft size={16} />
              RETURN TO ARCHIVE
            </button>
            <div className="font-mono text-[10px] tracking-widest text-[#d4cdc4]/40">
              [{String(projectIndex + 1).padStart(2, "0")}] / {PROJECTS.length.toString().padStart(2, "0")}
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="relative">
          <div className="relative h-60 sm:h-92" style={{ viewTransitionName: "blog-hero" }}>
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
            {/* Animated dashed line at bottom of hero */}
            <div className="absolute bottom-0 left-0 right-0 h-[5px] overflow-hidden">
              <div className="w-[200%] h-full animate-[march_300s_linear_infinite]"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, #716D67 0px, #716D67 24px, transparent 24px, transparent 36px)",
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

            <h1 className="font-display text-5xl sm:text-7xl tracking-tight text-[#d4cdc4] mb-6 drop-shadow-lg" style={{ viewTransitionName: "blog-title" }}>
              {project.title}
            </h1>

            {/* Tech stack */}
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

            {/* Links */}
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

        {/* Blog content */}
        <div className="max-w-4xl mx-auto px-6 pb-24" style={{ viewTransitionName: "blog-content" }}>
          <div className="border-t border-[#d4cdc4]/10 pt-10">
            <div className="font-mono text-[10px] tracking-widest text-[#d4cdc4]/40 mb-8 flex items-center gap-2">
              <span>◇</span>
              <span>DETAILED LOG</span>
              <span className="flex-1 border-b border-dashed border-[#d4cdc4]/10" />
            </div>

            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg text-[#d4cdc4]/75 leading-relaxed font-sans"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="mt-16 flex items-center gap-4">
            <div className="w-12 h-px bg-[#d4cdc4]/30" />
            <div className="w-3 h-3 rotate-45 border border-[#d4cdc4]/30" />
            <div className="flex-1 h-px bg-gradient-to-r from-[#d4cdc4]/20 to-transparent" />
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            {projectIndex > 0 ? (
              <button
                onClick={() => navigateWithTransition(router, `/blog/${PROJECTS[projectIndex - 1].slug}`)}
                className="font-mono text-xs tracking-widest text-[#d4cdc4]/50 hover:text-[#d4cdc4] transition-colors"
              >
                ◁ {PROJECTS[projectIndex - 1].title}
              </button>
            ) : (
              <div />
            )}
            {projectIndex < PROJECTS.length - 1 ? (
              <button
                onClick={() => navigateWithTransition(router, `/blog/${PROJECTS[projectIndex + 1].slug}`)}
                className="font-mono text-xs tracking-widest text-[#d4cdc4]/50 hover:text-[#d4cdc4] transition-colors"
              >
                {PROJECTS[projectIndex + 1].title} ▷
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
