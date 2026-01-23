"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "./types";

type ProjectPreviewProps = {
  project: Project | null;
  onOpenProject: () => void;
};

function ProjectPreview({ project, onOpenProject }: ProjectPreviewProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-[#0d0b08]/80 border border-foreground/20 overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <AnimatePresence mode="wait">
        {project ? (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-0 h-full flex flex-col"
          >
            {/* Image container */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/50 to-transparent" />

              {/* Year badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#0d0b08]/80 border border-foreground/20 font-mono text-xs text-foreground/60">
                {project.year}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
              {/* Title */}
              <h3 className="font-display text-2xl text-foreground mb-2 tracking-wide">
                {project.title}
              </h3>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2 py-0.5 bg-foreground/5 border border-foreground/10 text-foreground/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Description preview */}
              <p className="text-sm text-foreground/60 line-clamp-3 mb-4 flex-1">
                {project.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenProject}
                  className="flex-1 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 text-foreground/80 font-mono text-sm transition-colors"
                >
                  [OPEN FILE]
                </button>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/20 text-foreground/60 hover:text-foreground/80 transition-colors"
                    aria-label="View repository"
                  >
                    <Github size={18} />
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/20 text-foreground/60 hover:text-foreground/80 transition-colors"
                    aria-label="View live site"
                  >
                    <ExternalLink size={18} />
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
            <div className="text-center text-foreground/30 font-mono text-sm">
              <div className="mb-2">[NO PROJECT SELECTED]</div>
              <div className="text-xs">Use arrow keys or mouse to navigate</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-foreground/30" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-foreground/30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-foreground/30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-foreground/30" />
    </div>
  );
}

export default ProjectPreview;
