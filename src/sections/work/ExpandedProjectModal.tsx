"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import Dither from "@/components/Dither";
import { LoadTransitionOverlay } from "@/components/InitialLoadTransition";
import type { Project } from "@/data/work/types";
import "./project-detail.css";

type ExpandedProjectModalProps = {
  projects: Project[];
  projectIndex: number;
  isMobile: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function displayTitle(title: string) {
  return title.replace(/^PROJECT_/, "").replace(/_/g, " ").toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ExpandedProjectModal({ projects, projectIndex, isMobile, onClose, onNavigate }: ExpandedProjectModalProps) {
  const project = projects[projectIndex];
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const titleRef = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.addEventListener("keydown", handleEscape);
    document.documentElement.style.overflow = "hidden";
    Object.assign(document.body.style, { overflow: "hidden", position: "fixed", top: `-${scrollY}px`, width: "100%" });
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = previousHtmlOverflow;
      Object.assign(document.body.style, previousBodyStyle);
      window.scrollTo(0, scrollY);
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  React.useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
    titleRef.current?.focus({ preventScroll: true });
  }, [projectIndex]);

  if (!project) return null;

  const paragraphs = project.blogContent.trim().split(/\r?\n\s*\r?\n/);

  return (
    <div
      ref={scrollContainerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
      data-lenis-prevent
      className="project-detail"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = scrollContainerRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <LoadTransitionOverlay />
      {!isMobile && (
        <div className="project-detail-dither" aria-hidden="true">
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
      <div className="project-detail-shell">
        <header className="project-detail-topbar">
          <button onClick={onClose} className="project-detail-back">
            <ArrowLeft size={16} aria-hidden="true" /> Back to projects
          </button>
        </header>

        <article>
          <header className="project-detail-intro">
            <h1 id="project-detail-title" ref={titleRef} tabIndex={-1}>{displayTitle(project.title)}</h1>
            <p className="project-detail-lead">{project.previewDescription}</p>
            <div className="project-detail-meta">
              <span>{project.year}</span>
              <ul aria-label="Tools used">
                {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
            </div>
            {(project.liveUrl || project.repoUrl) && (
              <div className="project-detail-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit website <ExternalLink size={15} aria-hidden="true" />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    View source <Github size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </header>

          <div className="project-detail-story">
            {paragraphs.map((paragraph, index) => (
              paragraph.startsWith("> ") ? (
                <blockquote key={index}>{paragraph.replace(/^>\s*/gm, "")}</blockquote>
              ) : <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <nav className="project-detail-pagination" aria-label="Project navigation">
          {projectIndex > 0 ? (
            <button onClick={() => onNavigate(projectIndex - 1)}>
              <span><ArrowLeft size={15} aria-hidden="true" /> Previous project</span>
              <strong>{displayTitle(projects[projectIndex - 1].title)}</strong>
            </button>
          ) : <div />}
          {projectIndex < projects.length - 1 ? (
            <button onClick={() => onNavigate(projectIndex + 1)} className="project-detail-next">
              <span>Next project <ArrowRight size={15} aria-hidden="true" /></span>
              <strong>{displayTitle(projects[projectIndex + 1].title)}</strong>
            </button>
          ) : <div />}
        </nav>
      </div>
    </div>
  );
}

export default ExpandedProjectModal;
