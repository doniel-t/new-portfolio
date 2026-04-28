"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import DecodingWord from "@/components/DecodingWord";
import Dither from "@/components/Dither";
import PixelDivider from "@/components/PixelDivider";
import { useIsMobile } from "@/hooks/useIsMobile";
import ExpandedProjectModal from "./ExpandedProjectModal";
import { PROJECTS } from "./data";
import type { Project } from "./types";

const workEase = [0.16, 1, 0.3, 1] as const;

function formatProjectTitle(title: string) {
  return title
    .replace(/^PROJECT_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SectionBackdrop({ showTopDither }: { showTopDither: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-[#11100d]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(214,208,197,0.1)_1px,transparent_1px)] [background-size:9px_9px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_2%,rgba(214,208,197,0.12),transparent_22%),radial-gradient(circle_at_90%_18%,rgba(128,120,102,0.12),transparent_24%),linear-gradient(180deg,rgba(17,16,13,0)_0%,#11100d_96%)]" />
      <div className="absolute inset-0 work-section-noise pointer-events-none opacity-20" />
      {showTopDither && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.16]"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 18%, transparent 82%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 18%, transparent 82%)",
          }}
        >
          <Dither
            waveColor={[166 / 255, 159 / 255, 141 / 255]}
            disableAnimation={false}
            enableMouseInteraction={false}
            colorNum={2}
            waveAmplitude={0.1}
            waveFrequency={2}
            waveSpeed={0.05}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,#3C3A35_0%,rgba(60,58,53,0.62)_34%,rgba(17,16,13,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(17,16,13,0)_0%,#0d0b08_100%)]" />
    </>
  );
}

function PlaceholderInterface({ index }: { index: number }) {
  const preset = index % 3;

  if (preset === 0) {
    return (
      <div className="absolute inset-0 p-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#d6d0c5]/48">
        <div className="mb-4 flex items-center justify-between">
          <span>Status</span>
          <span className="text-[#d6d0c5]/70">Live</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[68, 42, 86, 54, 74, 32].map((height, itemIndex) => (
            <div key={itemIndex} className="flex h-24 items-end border border-[#d6d0c5]/10 p-1">
              <span
                className="block w-full bg-[#d6d0c5]/24"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 border-t border-[#d6d0c5]/12 pt-3">
          <span>Latency</span>
          <span>42ms</span>
          <span>Region</span>
          <span>EU-WEST</span>
        </div>
      </div>
    );
  }

  if (preset === 1) {
    return (
      <div className="absolute inset-0 p-4 font-mono text-[10px] text-[#d6d0c5]/48">
        <div className="mb-4 flex gap-1.5">
          <span className="h-2 w-2 bg-[#d6d0c5]/50" />
          <span className="h-2 w-2 bg-[#d6d0c5]/24" />
          <span className="h-2 w-2 bg-[#d6d0c5]/24" />
        </div>
        <div className="space-y-2">
          {[
            "const project = await fetch()",
            "render.preview(card)",
            "cache.revalidate(60)",
            "return response.json()",
          ].map((line, lineIndex) => (
            <div key={line} className="grid grid-cols-[24px_1fr] gap-3">
              <span className="text-[#d6d0c5]/28">{String(lineIndex + 1).padStart(2, "0")}</span>
              <span className="truncate text-[#d6d0c5]/62">{line}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <span key={item} className="h-10 border border-[#d6d0c5]/10 bg-[#d6d0c5]/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-4">
      <div className="relative h-full border border-[#d6d0c5]/10">
        <div className="absolute left-[15%] top-[24%] h-3 w-3 bg-[#d6d0c5]/56" />
        <div className="absolute left-[52%] top-[18%] h-2.5 w-2.5 bg-[#d6d0c5]/36" />
        <div className="absolute left-[68%] top-[58%] h-3 w-3 bg-[#d6d0c5]/48" />
        <div className="absolute left-[28%] top-[70%] h-2 w-2 bg-[#d6d0c5]/30" />
        <div className="absolute left-[19%] top-[30%] h-px w-[42%] rotate-[-8deg] bg-[#d6d0c5]/18" />
        <div className="absolute left-[54%] top-[26%] h-px w-[24%] rotate-[48deg] bg-[#d6d0c5]/18" />
        <div className="absolute left-[32%] top-[68%] h-px w-[40%] rotate-[-14deg] bg-[#d6d0c5]/18" />
        <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d6d0c5]/42">
          Node Map
        </div>
      </div>
    </div>
  );
}

function ProjectVisual({
  project,
  displayTitle,
  index,
}: {
  project: Project;
  displayTitle: string;
  index: number;
}) {
  const hasImage = project.image !== "/placeholder-project.jpg";

  return (
    <div className="relative mt-7 h-44 overflow-hidden border border-[#d6d0c5]/12 bg-[#0f0e0b] sm:h-48">
      {hasImage ? (
        <Image
          src={project.image}
          alt={`${displayTitle} preview`}
          fill
          priority={index < 2}
          className="object-cover grayscale-[24%] sepia-[0.18] saturate-[0.76] contrast-[1.08] transition duration-500 group-hover/project:scale-[1.04] group-hover/project:grayscale-0"
          sizes="(max-width: 640px) 82vw, 380px"
        />
      ) : (
        <PlaceholderInterface index={index} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,13,0.04),rgba(17,16,13,0.58))]" />
      <div className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_4px)]" />
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const displayTitle = formatProjectTitle(project.title);
  const primaryUrl = project.liveUrl ?? project.repoUrl;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 34, filter: "blur(14px) brightness(0.88)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px) brightness(1)",
          transition: { duration: 0.72, ease: workEase },
        },
      }}
      whileHover={{ filter: "blur(0px) brightness(1.04)" }}
      data-project-card
      className="group/project relative flex h-[590px] w-[82vw] shrink-0 cursor-pointer flex-col border border-[#d6d0c5]/18 bg-[#15130f]/58 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-300 hover:border-[#d6d0c5]/28 hover:bg-[#1a1814]/66 sm:h-[620px] sm:w-[355px] md:w-[380px]"
    >
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#d6d0c5]/60"
        aria-label={`Read article for ${displayTitle}`}
      />
      <span className="pointer-events-none absolute left-0 top-0 z-30 h-2 w-2 border-l border-t border-[#d6d0c5]/70 transition-transform duration-300 group-hover/project:translate-x-2 group-hover/project:translate-y-2" />
      <span className="pointer-events-none absolute right-0 top-0 z-30 h-2 w-2 border-r border-t border-[#d6d0c5]/34 transition-transform duration-300 group-hover/project:-translate-x-2 group-hover/project:translate-y-2" />
      <span className="pointer-events-none absolute bottom-0 left-0 z-30 h-2 w-2 border-b border-l border-[#d6d0c5]/70 transition-transform duration-300 group-hover/project:translate-x-2 group-hover/project:-translate-y-2" />
      <span className="pointer-events-none absolute bottom-0 right-0 z-30 h-2 w-2 border-b border-r border-[#d6d0c5]/34 transition-transform duration-300 group-hover/project:-translate-x-2 group-hover/project:-translate-y-2" />

      <div className="relative z-0 flex items-center justify-between font-mono text-[12px] text-[#d6d0c5]/58">
        <span>[{String(index + 1).padStart(2, "0")}]</span>
        <span>{project.year}</span>
      </div>

      <ProjectVisual project={project} displayTitle={displayTitle} index={index} />

      <div className="relative z-0 mt-8 min-h-[144px]">
        <h3 className="max-w-[11ch] font-display text-[34px] leading-[0.98] text-[#d6d0c5] transition group-hover/project:text-[#f4eee3] sm:text-[38px]">
          {displayTitle}
        </h3>
        <p className="mt-6 overflow-hidden font-mono text-[13px] leading-6 text-[#d6d0c5]/64 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {project.description}
        </p>
      </div>

      <div className="relative z-20 mt-auto">
        <div className="mb-6 h-px bg-[#d6d0c5]/12" />
        <div className="mb-7">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d6d0c5]/44">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="border border-[#d6d0c5]/16 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#d6d0c5]/58"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 cursor-pointer items-center gap-2 border border-[#d6d0c5]/20 px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4eee3] transition hover:border-[var(--mid)] hover:bg-[var(--mid)] hover:text-[#0d0b08]"
            >
              View Project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-11 cursor-pointer items-center gap-2 border border-[#d6d0c5]/12 px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#d6d0c5]/70 transition hover:border-[#d6d0c5]/32 hover:text-[#f4eee3]"
          >
            Read Article
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function WorkSection() {
  const introRef = React.useRef<HTMLDivElement | null>(null);
  const cardsRef = React.useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const expandedProjectRef = React.useRef<number | null>(null);
  const modalHistoryPushedRef = React.useRef(false);
  const introInView = useInView(introRef, {
    once: true,
    margin: "-8% 0px -12% 0px",
  });
  const cardsInView = useInView(cardsRef, {
    once: true,
    amount: 0.18,
    margin: "0px 0px -10% 0px",
  });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const visibleProjects = PROJECTS;

  React.useEffect(() => {
    expandedProjectRef.current = expandedProject;
  }, [expandedProject]);

  const updateScrollState = useCallback(() => {
    const scroller = scrollContainerRef.current;

    if (!scroller) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 1);
  }, []);

  const handleOpenProject = useCallback((projectId: string) => {
    const projectIndex = PROJECTS.findIndex((project) => project.id === projectId);
    if (projectIndex >= 0) {
      if (expandedProjectRef.current === null) {
        const currentState = window.history.state;
        const historyState =
          typeof currentState === "object" && currentState !== null ? currentState : {};

        window.history.pushState(
          { ...historyState, workProjectModal: true, projectId },
          "",
          window.location.href
        );
        modalHistoryPushedRef.current = true;
      }

      setExpandedProject(projectIndex);
    }
  }, []);

  const handleCloseProject = useCallback(() => {
    if (modalHistoryPushedRef.current) {
      window.history.back();
      return;
    }

    setExpandedProject(null);
  }, []);

  const handleNavigateProject = useCallback((index: number) => {
    setExpandedProject(index);
  }, []);

  const handleRailScroll = useCallback((direction: "left" | "right") => {
    const scroller = scrollContainerRef.current;
    const firstCard = scroller?.querySelector<HTMLElement>("[data-project-card]");

    if (!scroller || !firstCard) {
      return;
    }

    const cardGap = 20;
    scroller.scrollBy({
      left: (firstCard.offsetWidth + cardGap) * (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  }, []);

  React.useEffect(() => {
    const scroller = scrollContainerRef.current;

    if (!scroller) {
      return;
    }

    updateScrollState();

    const handleScroll = () => updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, visibleProjects.length]);

  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { workProjectModal?: boolean; projectId?: string } | null;

      if (state?.workProjectModal && state.projectId) {
        const projectIndex = PROJECTS.findIndex((project) => project.id === state.projectId);

        if (projectIndex >= 0) {
          modalHistoryPushedRef.current = true;
          setExpandedProject(projectIndex);
          return;
        }
      }

      if (expandedProjectRef.current !== null) {
        modalHistoryPushedRef.current = false;
        setExpandedProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <section
      id="projects"
      data-snap-section="projects"
      data-navbar-variant="bright"
      aria-labelledby="projects-heading"
      className="relative overflow-x-clip overflow-y-hidden bg-[#11100d] py-20 text-[#d6d0c5] sm:py-28"
    >
      <SectionBackdrop showTopDither={!isMobile && !prefersReducedMotion} />
      <div className="relative h-0 w-full" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#11100d"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
            direction="down"
          />
        </div>
      </div>

      <motion.div
        ref={introRef}
        initial="hidden"
        animate={introInView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: isMobile ? 0.03 : 0.09,
              delayChildren: isMobile ? 0 : 0.04,
            },
          },
        }}
        className="relative mx-auto w-full pl-8 pr-5 sm:pl-14 sm:pr-10 lg:pl-24 lg:pr-16"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: workEase } },
          }}
          className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#A69F8D]/30 pb-4"
        >
          <div className="h-2 w-2 shrink-0 rotate-45 bg-[#A69F8D]" />
          <h2
            id="projects-heading"
            className="font-display text-5xl leading-[1.05] tracking-tight text-[#A69F8D] sm:text-7xl md:text-8xl"
          >
            <DecodingWord word="PROJECTS" className="leading-[1.05] tracking-tight" active={introInView} />
          </h2>
          <div className="flex-1" />
          <div className="ml-auto font-mono text-xs tracking-widest text-[#A69F8D]/60">
            WORK: {visibleProjects.length} / {PROJECTS.length}
          </div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: workEase } },
          }}
          className="flex flex-col gap-5 border-b border-[#d6d0c5]/10 py-5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#d6d0c5]/52 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex max-w-3xl items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#d6d0c5]/70" />
            <p className="normal-case leading-5 tracking-[0.02em]">
              Selected project archive. This is a mix of work projects, client builds, and personal projects I made to chase ideas, sharpen my craft, or see if a rough thought could become something real.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleRailScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll projects left"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-[#d6d0c5]/16 text-[#d6d0c5] transition hover:border-[var(--mid)] hover:bg-[var(--mid)] hover:text-[#0d0b08] disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleRailScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll projects right"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-[#d6d0c5]/16 text-[#d6d0c5] transition hover:border-[var(--mid)] hover:bg-[var(--mid)] hover:text-[#0d0b08] disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <span>{visibleProjects.length} Projects</span>
          </div>
        </motion.div>

        <motion.div
          ref={cardsRef}
          initial="hidden"
          animate={cardsInView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: isMobile ? 0.02 : 0.08,
                staggerChildren: isMobile ? 0.045 : 0.09,
              },
            },
          }}
        >
          <div
            ref={scrollContainerRef}
            className="relative left-1/2 z-[45] w-[100svw] max-w-[100svw] -translate-x-1/2 overflow-x-auto overscroll-x-contain pb-10 pl-8 pr-5 pt-8 [scrollbar-color:rgba(214,208,197,0.55)_rgba(214,208,197,0.08)] [scrollbar-width:thin] sm:pl-14 sm:pr-10 lg:pl-24 lg:pr-16 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#d6d0c5]/8 [&::-webkit-scrollbar-thumb]:bg-[#d6d0c5]/45"
          >
            <div className="flex w-max gap-5 pr-[18vw]">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={() => handleOpenProject(project.id)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

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
