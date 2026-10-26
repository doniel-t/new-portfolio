"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import PixelDivider from "@/components/PixelDivider";
import TargetCursor from "@/components/TargetCursor";
import {
  TECH_STACK_CATEGORIES,
  TECH_STACK_ITEMS,
  TECH_STACK_TOTAL_MEMORY,
  type TechCategoryDef,
  type TechItem,
} from "@/components/techStackData";
import { ABOUT_CONTENT } from "@/data/about/profile";
import { PROJECTS } from "@/data/work/projects";
import type { Project } from "@/data/work/types";
import { useGPUDetection } from "@/hooks/useGPUDetection";
import { useIsMobile } from "@/hooks/useIsMobile";
import ExpandedProjectModal from "@/sections/work/ExpandedProjectModal";
import LocalTimeClient from "./LocalTime";
import ProjectToolIcons from "./ProjectToolIcons";

const PortalFieldCollection = dynamic(
  () =>
    import("@designcodeio/threeui/components/PortalFieldCollection").then(
      (module) => module.PortalFieldCollection
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#0a0a0a]" />,
  }
);

const viewEase = [0.16, 1, 0.3, 1] as const;
const DESKTOP_RAIL_TOP = 96;

type RailStyle = React.CSSProperties | undefined;

function useTypewriter(texts: readonly string[], typeSpeed = 80, pauseDuration = 1500) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(true);

  React.useEffect(() => {
    const currentText = texts[currentIndex];

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timeout);
      }

      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setDisplayedText("");
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setIsTyping(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentIndex, texts, typeSpeed, pauseDuration]);

  return { displayedText, isTyping };
}

function PortraitStamp() {
  return (
    <figure className="relative w-full max-w-52.5 sm:max-w-57.5 lg:max-w-61.5">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl">
        <Image
          alt={ABOUT_CONTENT.portrait.alt}
          src="/me crop pixel.png"
          fill
          priority={false}
          sizes="(min-width: 1024px) 246px, (min-width: 640px) 230px, 42vw"
          className="object-cover object-center grayscale-30 saturate-[0.78] contrast-[1.08] brightness-[0.94]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,8,0)_35%,rgba(13,11,8,0.68)_100%)]" />
      </div>
    </figure>
  );
}

function VibeSignal() {
  const { displayedText } = useTypewriter(ABOUT_CONTENT.vibe.emojis, 100, 2000);
  return (
    <div aria-hidden="true" className="mt-5 h-9 font-mono text-2xl text-[#e6c3a8]">
      {displayedText}<span className="ml-1 text-[#d4cdc4]/50">|</span>
    </div>
  );
}

function RailNamePlate() {
  return (
    <div className="py-2 lg:pt-6">
      <p className="font-display text-4xl uppercase leading-none text-[#f4eee3] sm:text-5xl">
        {ABOUT_CONTENT.rail.name}
      </p>
      <p className="mt-3 text-sm text-[#d4cdc4]/65">{ABOUT_CONTENT.location.region}</p>
      <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
          {ABOUT_CONTENT.personalStats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-[#d4cdc4]/65">{stat.label}</dt>
              <dd className={`mt-1.5 text-sm ${stat.isHighlighted ? "text-[#e6c3a8]" : "text-[#f4eee3]"}`}>{stat.value}</dd>
            </div>
          ))}
          <div className="col-span-2">
            <dt className="text-xs text-[#d4cdc4]/65">{ABOUT_CONTENT.location.localTimeLabel}</dt>
            <dd className="mt-1.5 min-h-5"><LocalTimeClient className="text-sm tabular-nums text-[#f4eee3]" /></dd>
          </div>
        </dl>
      <VibeSignal />
    </div>
  );
}

function FadeInView({
  id,
  children,
  className = "",
  revealOnce = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  revealOnce?: boolean;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: revealOnce, amount: 0.1, margin: "-8% 0px -16% 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {
          opacity: prefersReducedMotion || revealOnce ? 1 : 0.18,
          y: prefersReducedMotion || revealOnce ? 0 : 34,
        },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.72, ease: viewEase },
        },
      }}
      className={`scroll-mt-28 py-12 lg:py-14 ${className}`}
    >
      {children}
    </motion.article>
  );
}

function useCardReveal() {
  const reducedMotion = useReducedMotion();
  const textReveal = {
    hidden: { opacity: reducedMotion ? 1 : 0.15, filter: reducedMotion ? "blur(0px)" : "blur(8px)", y: reducedMotion ? 0 : 12 },
    show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: reducedMotion ? 0 : 0.85, ease: viewEase } },
  };
  const cardReveal = {
    hidden: { opacity: reducedMotion ? 1 : 0.15, filter: reducedMotion ? "blur(0px)" : "blur(12px)", y: reducedMotion ? 0 : 20 },
    show: {
      opacity: 1, filter: "blur(0px)", y: 0,
      transition: { duration: reducedMotion ? 0 : 0.85, ease: viewEase, delayChildren: reducedMotion ? 0 : 0.12, staggerChildren: reducedMotion ? 0 : 0.08 },
    },
  };
  return { textReveal, cardReveal };
}

const ABOUT_CARD_CLASS_NAME = "max-w-3xl rounded-xl bg-[#121210]/85 px-6 py-8 sm:p-10 xl:p-12";

function SoftwareEngineerView() {
  const { textReveal, cardReveal } = useCardReveal();
  return (
    <FadeInView id="about-software-engineer" className="pt-0" revealOnce>
      <motion.div variants={cardReveal} className={ABOUT_CARD_CLASS_NAME}>
        <motion.h2 variants={textReveal} className="font-display text-5xl uppercase leading-none text-[#f4eee3] sm:text-6xl xl:text-7xl">
          {ABOUT_CONTENT.views.profile.title}
        </motion.h2>
        <motion.p variants={textReveal} className="mt-6 max-w-2xl text-xl leading-relaxed tracking-[-0.015em] text-[#d4cdc4] sm:text-2xl">
          {ABOUT_CONTENT.summary.lead}
        </motion.p>
        <motion.dl variants={textReveal} className="mt-7 grid max-w-sm grid-cols-2 gap-6">
          {ABOUT_CONTENT.profileStats.map((stat, index) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="mt-1 text-xs text-[#d4cdc4]/65">{index === 0 ? "Years coding" : "Years professional"}</dt>
              <dd className="order-first font-display text-5xl leading-none text-[#e6c3a8] sm:text-6xl">{stat.value}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={textReveal} className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="text-[#d4cdc4]/65">{ABOUT_CONTENT.sections.coreStack}</span>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[#f4eee3]" aria-label={ABOUT_CONTENT.sections.coreStack}>
            {ABOUT_CONTENT.coreStackNames.map((name) => {
              const tech = TECH_STACK_ITEMS.find((item) => item.name === name);
              return (
                <li key={name} role="img" aria-label={name} title={name} className="flex h-9 w-9 items-center justify-center [&_svg]:size-7">
                  <span aria-hidden="true">{tech?.icon}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.section variants={textReveal} aria-labelledby="about-experience-title" className="mt-8 sm:mt-10">
          <h3 id="about-experience-title" className="mb-5 text-sm font-medium text-[#d4cdc4]/65">Experience</h3>
          <div className="space-y-6">
            {ABOUT_CONTENT.experience.map((item, index) => (
              <article key={item.company} className="flex items-baseline justify-between gap-5">
                <span className="shrink-0 font-mono text-xs tabular-nums text-[#e6c3a8]">
                  {String(ABOUT_CONTENT.experience.length - index).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-medium leading-snug text-[#f4eee3]">{item.role}</h4>
                  <p className="mt-1 text-sm text-[#d4cdc4]/65">
                    {item.company}<span className="px-2 text-[#d4cdc4]/40" aria-hidden="true">·</span>
                    <span className={item.status === "ONGOING" ? "text-[#e6c3a8]" : undefined}>{item.status.toLowerCase()}</span>
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#d4cdc4]/65">{item.focus.join(" · ")}</p>
                </div>
                <p className="shrink-0 text-xs tabular-nums text-[#d4cdc4]/65">{item.duration}</p>
              </article>
            ))}
          </div>
        </motion.section>


      </motion.div>
    </FadeInView>
  );
}

function formatProjectTitle(title: string) {
  return title
    .replace(/^PROJECT_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ProjectPlaceholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 bg-[#11100d] p-4 font-mono text-[10px] text-[#d4cdc4]/45">
      <div className="mb-4 flex items-center justify-between uppercase tracking-[0.12em]">
        <span>Preview</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="grid h-[calc(100%-2rem)] grid-cols-3 gap-2">
        {[64, 42, 82, 54, 72, 36].map((height, itemIndex) => (
          <div key={itemIndex} className="flex items-end border border-[#d4cdc4]/10 p-1">
            <span className="block w-full bg-[#d4cdc4]/22" style={{ height: `${height}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectVisual({ project, displayTitle, index }: { project: Project; displayTitle: string; index: number }) {
  const hasImage = project.image !== "/placeholder-project.jpg";

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1b1b18] sm:aspect-auto sm:min-h-44">
      {hasImage ? (
        <Image
          src={project.image}
          alt={`${displayTitle} preview`}
          fill
          priority={false}
          sizes="(min-width: 640px) 196px, calc(100vw - 96px)"
          className={`${project.image === "/ingolstadt-project-dark.png" ? "object-contain bg-[#0d0b08]" : "object-cover"} grayscale-12 saturate-[0.9] contrast-[1.02] transition duration-500 group-hover/project:scale-[1.025] group-hover/project:grayscale-0`}
        />
      ) : (
        <ProjectPlaceholder index={index} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,8,0.02),rgba(13,11,8,0.34))]" />
    </div>
  );
}

function ProjectListCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (projectId: string) => void;
}) {
  const displayTitle = formatProjectTitle(project.title);

  return (
    <article className="group/project grid gap-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-6">
      <ProjectVisual project={project} displayTitle={displayTitle} index={index} />

      <div className="flex min-w-0 flex-col">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs text-[#d4cdc4]/65">
          <span className="font-mono text-[#e6c3a8]">{String(index + 1).padStart(2, "0")}</span>
          <span>{project.year}</span>
        </div>

        <h3 className="text-xl font-medium leading-snug text-[#f4eee3]">
          {displayTitle}
        </h3>

        <p className="mt-3 overflow-hidden text-sm leading-6 text-[#d4cdc4]/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {project.previewDescription ?? project.description}
        </p>

        <ProjectToolIcons tools={project.techStack.slice(0, 4)} />

        <div className="mt-4 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => onOpen(project.id)}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-[#e6c3a8] underline-offset-4 transition-colors hover:text-[#f4eee3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6c3a8]"
          >
            Read
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-[#d4cdc4]/70 underline-offset-4 transition-colors hover:text-[#f4eee3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6c3a8]"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-[#d4cdc4]/70 underline-offset-4 transition-colors hover:text-[#f4eee3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6c3a8]"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function RecentProjectsView({ onOpenProject }: { onOpenProject: (projectId: string) => void }) {
  const { textReveal, cardReveal } = useCardReveal();

  return (
    <FadeInView id="about-projects" revealOnce>
      <motion.div variants={cardReveal} className={ABOUT_CARD_CLASS_NAME}>
        <motion.h2 variants={textReveal} className="font-display text-5xl uppercase leading-none text-[#f4eee3] sm:text-6xl xl:text-7xl">
          {ABOUT_CONTENT.views.projects.title}
        </motion.h2>
        <motion.p variants={textReveal} className="mt-6 max-w-2xl text-base leading-relaxed text-[#d4cdc4]/70 sm:text-lg">
          {ABOUT_CONTENT.views.projects.description}
        </motion.p>
        <div className="mt-9 space-y-10 sm:mt-10 sm:space-y-12">
          {PROJECTS.map((project, index) => (
            <motion.div key={project.id} variants={textReveal}>
              <ProjectListCard project={project} index={index} onOpen={onOpenProject} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FadeInView>
  );
}

function AboutTechChip({ tech }: { tech: TechItem }) {
  return (
    <div
      tabIndex={0}
      className="about-tech-card group flex min-w-0 items-start gap-3 rounded-xl px-2 py-3 text-[#d4cdc4] transition-colors duration-200 hover:bg-[#e6c3a8]/8 focus-visible:bg-[#e6c3a8]/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c3a8]"
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#e6c3a8] [&_svg]:size-5">{tech.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-6 text-[#f4eee3]">{tech.name}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#d4cdc4]/65">{tech.description}</p>
      </div>
      <span className="mt-1 shrink-0 font-mono text-[10px] tabular-nums text-[#d4cdc4]/65" aria-label={`${tech.cost} memory`}>{tech.cost}</span>
    </div>
  );
}

function AboutTechCategory({ category }: { category: TechCategoryDef }) {
  const categoryMemory = category.items.reduce((acc, item) => acc + item.cost, 0);

  return (
    <section aria-labelledby={`tech-category-${category.key}`}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 id={`tech-category-${category.key}`} className="text-base font-medium capitalize text-[#f4eee3]">{category.label === "CMS" ? category.label : category.label.toLowerCase()}</h3>
        <span className="font-mono text-[10px] tabular-nums text-[#d4cdc4]/65">{categoryMemory} mem</span>
      </div>
      <div className="-mx-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {category.items.map((tech) => <AboutTechChip key={tech.name} tech={tech} />)}
      </div>
    </section>
  );
}

function AboutTechStackView() {
  const { textReveal, cardReveal } = useCardReveal();

  return (
    <FadeInView id="about-tech-stack" className="pb-2" revealOnce>
      <motion.div variants={cardReveal} className={ABOUT_CARD_CLASS_NAME}>
        <motion.h2 variants={textReveal} className="font-display text-5xl uppercase leading-none text-[#f4eee3] sm:text-6xl xl:text-7xl">
          {ABOUT_CONTENT.views.techStack.title}
        </motion.h2>
        <motion.div variants={textReveal} className="mt-6 flex flex-wrap justify-between gap-x-6 gap-y-2 text-xs text-[#d4cdc4]/65">
          <p>{TECH_STACK_CATEGORIES.length} categories · {TECH_STACK_ITEMS.length} tools</p>
          <p className="tabular-nums">Memory: {TECH_STACK_TOTAL_MEMORY} / 256</p>
        </motion.div>
        <div className="mt-9 space-y-8 sm:mt-10 sm:space-y-9">
          {TECH_STACK_CATEGORIES.map((category) => (
            <motion.div key={category.key} variants={textReveal}>
              <AboutTechCategory category={category} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FadeInView>
  );
}

function AboutTechCursor() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const gpuSupport = useGPUDetection();
  const enableCursor = !isMobile && !prefersReducedMotion && (gpuSupport === "full" || gpuSupport === "limited");
  const [isStackInView, setIsStackInView] = React.useState(false);

  React.useEffect(() => {
    if (!enableCursor) {
      setIsStackInView(false);
      return;
    }

    const stackView = document.getElementById("about-tech-stack");

    if (!stackView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStackInView(entry.isIntersecting);
      },
      {
        rootMargin: "-10% 0px -22% 0px",
        threshold: 0.12,
      }
    );

    observer.observe(stackView);

    return () => {
      observer.disconnect();
    };
  }, [enableCursor]);

  if (!enableCursor || !isStackInView) {
    return null;
  }

  return (
    <TargetCursor
      targetSelector=".about-tech-card"
      spinDuration={4}
      hideDefaultCursor={false}
      hoverDuration={0.15}
      parallaxOn={false}
    />
  );
}

function Scene() {
  return (
    <div className="shader-frame h-full w-full opacity-10 scale-x-200">
      <PortalFieldCollection
        variant="flow-field"
        speed={0.5}
        size={1.5}
        length={4}
        density={10}
        opacity={1}
        hue={9}
        saturation={0.2}
        brightness={0.05}
      />
    </div>
  );
}

function SectionPortalBackdrop() {
  const layerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const layer = layerRef.current;
    const aboutSection = document.getElementById("work");

    if (!layer || !aboutSection) {
      return;
    }

    let frameId = 0;

    const updateBounds = () => {
      frameId = 0;

      const sectionRect = aboutSection.getBoundingClientRect();
      const visibleTop = Math.max(0, sectionRect.top);
      const visibleBottom = Math.min(window.innerHeight, sectionRect.bottom);

      if (visibleBottom <= visibleTop) {
        layer.style.opacity = "0";
        layer.style.clipPath = "inset(50% 0px 50% 0px)";
        return;
      }

      const bottomClip = Math.max(0, window.innerHeight - visibleBottom);
      layer.style.opacity = "1";
      layer.style.clipPath = `inset(${visibleTop.toFixed(1)}px 0px ${bottomClip.toFixed(1)}px 0px)`;
    };

    const scheduleUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateBounds);
      }
    };

    updateBounds();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-0"
      style={{
        clipPath: "inset(50% 0px 50% 0px)",
        willChange: "clip-path, opacity",
      }}
      aria-hidden
    >
      <Scene />
    </div>
  );
}

function useAboutProjectModal() {
  const [expandedProject, setExpandedProject] = React.useState<number | null>(null);
  const expandedProjectRef = React.useRef<number | null>(null);
  const modalHistoryPushedRef = React.useRef(false);

  React.useEffect(() => {
    expandedProjectRef.current = expandedProject;
  }, [expandedProject]);

  const handleOpenProject = React.useCallback((projectId: string) => {
    const projectIndex = PROJECTS.findIndex((project) => project.id === projectId);

    if (projectIndex < 0) {
      return;
    }

    if (expandedProjectRef.current === null) {
      const currentState = window.history.state;
      const historyState =
        typeof currentState === "object" && currentState !== null ? currentState : {};

      window.history.pushState(
        { ...historyState, aboutProjectModal: true, projectId },
        "",
        window.location.href
      );
      modalHistoryPushedRef.current = true;
    }

    setExpandedProject(projectIndex);
  }, []);

  const handleCloseProject = React.useCallback(() => {
    if (modalHistoryPushedRef.current) {
      window.history.back();
      return;
    }

    setExpandedProject(null);
  }, []);

  const handleNavigateProject = React.useCallback((index: number) => {
    setExpandedProject(index);
  }, []);

  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { aboutProjectModal?: boolean; projectId?: string } | null;

      if (state?.aboutProjectModal && state.projectId) {
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

  return {
    expandedProject,
    handleCloseProject,
    handleNavigateProject,
    handleOpenProject,
  };
}

function useBoundedDesktopRail() {
  const columnRef = React.useRef<HTMLElement | null>(null);
  const railRef = React.useRef<HTMLDivElement | null>(null);
  const [railStyle, setRailStyle] = React.useState<RailStyle>();
  const railStyleKeyRef = React.useRef("");
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      railStyleKeyRef.current = "";
      setRailStyle(undefined);
      return;
    }

    let frameId = 0;

    const commitStyle = (nextStyle: RailStyle, nextKey: string) => {
      if (railStyleKeyRef.current === nextKey) {
        return;
      }

      railStyleKeyRef.current = nextKey;
      setRailStyle(nextStyle);
    };

    const updateRail = () => {
      frameId = 0;

      const column = columnRef.current;
      const rail = railRef.current;

      if (!column || !rail || window.innerWidth < 1024) {
        commitStyle(undefined, "normal");
        return;
      }

      const columnRect = column.getBoundingClientRect();
      const railHeight = rail.offsetHeight;
      const columnHeight = column.offsetHeight;

      if (columnRect.top > DESKTOP_RAIL_TOP) {
        commitStyle(undefined, "normal");
        return;
      }

      if (columnRect.bottom - railHeight <= DESKTOP_RAIL_TOP) {
        const top = Math.max(0, columnHeight - railHeight);
        commitStyle(
          {
            left: 0,
            position: "absolute",
            top,
            width: "100%",
            zIndex: 20,
          },
          `absolute:${Math.round(top)}`
        );
        return;
      }

      const left = Math.round(columnRect.left);
      const width = Math.round(columnRect.width);

      commitStyle(
        {
          left: columnRect.left,
          position: "fixed",
          top: DESKTOP_RAIL_TOP,
          width: columnRect.width,
          zIndex: 20,
        },
        `fixed:${left}:${width}`
      );
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateRail);
    };

    updateRail();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isMobile]);

  return { columnRef, railRef, railStyle };
}

function ModernAboutLayout() {
  const isMobile = useIsMobile();
  const { columnRef, railRef, railStyle } = useBoundedDesktopRail();
  const {
    expandedProject,
    handleCloseProject,
    handleNavigateProject,
    handleOpenProject,
  } = useAboutProjectModal();

  return (
    <div className="relative">
      <AboutTechCursor />
      <div className="grid gap-12 lg:grid-cols-[minmax(210px,0.48fr)_minmax(0,1.52fr)] lg:items-stretch xl:gap-16 xl:grid-cols-[minmax(230px,0.44fr)_minmax(0,1.56fr)]">
        <aside ref={columnRef} className="relative">
          <div
            ref={railRef}
            style={railStyle}
            className="grid grid-cols-[minmax(120px,0.9fr)_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[minmax(170px,230px)_minmax(0,1fr)] lg:block"
          >
            <div className="lg:mb-5">
              <PortraitStamp />
            </div>
            <RailNamePlate />
          </div>
        </aside>

        <div className="relative min-w-0 xl:pr-2">
          <div className="space-y-6 lg:space-y-8">
            <SoftwareEngineerView />
            <RecentProjectsView onOpenProject={handleOpenProject} />
            <AboutTechStackView />
          </div>
        </div>
      </div>

      {expandedProject !== null ? (
        <ExpandedProjectModal
          projects={PROJECTS}
          projectIndex={expandedProject}
          isMobile={isMobile}
          onClose={handleCloseProject}
          onNavigate={handleNavigateProject}
        />
      ) : null}
    </div>
  );
}

function InViewAboutBlock() {
  return <ModernAboutLayout />;
}

export default function AboutSection() {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="relative h-0 w-full" aria-hidden>
        <div className="absolute inset-x-0" style={{ top: "-180px", height: "180px", zIndex: 5 }}>
          <PixelDivider
            color="#0d0b08"
            pixelSize={isMobile ? 12 : 24}
            durationSec={8}
            rise="-200%"
            streamsPerCol={4}
          />
        </div>
      </div>

      <section
        id="work"
        data-snap-section="work"
        data-navbar-variant="bright"
        aria-labelledby="about-software-engineer"
        className="relative isolate w-full bg-[#0a0a0a] font-sans py-24 sm:py-32"
      >
        <SectionPortalBackdrop />

        <div className="relative z-10 mx-auto w-full max-w-368 px-6 sm:px-8 lg:px-10">
          <InViewAboutBlock />
        </div>
      </section>
    </>
  );
}
