"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import BackgroundLineArt from "@/components/BackgroundLineArt";
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
import { useScrollFade } from "@/hooks/useScrollFade";
import ExpandedProjectModal from "@/sections/work/ExpandedProjectModal";
import LocalTimeClient from "./LocalTime";
import type { IconType } from "react-icons";
import {
  FaBriefcase,
  FaChartBar,
  FaCode,
  FaMapMarkerAlt,
  FaRegAddressCard,
  FaSignal,
  FaUser,
} from "react-icons/fa";

const Dither = dynamic(() => import("@/components/Dither"), {
  ssr: false,
  loading: () => null,
});

const CORE_STACK_ITEMS = ABOUT_CONTENT.coreStackNames.map((name) =>
  TECH_STACK_ITEMS.find((item) => item.name === name)
).filter((item): item is TechItem => item !== undefined);

const SCANLINE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,205,196,0.04) 2px, rgba(212,205,196,0.04) 4px)",
};

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

function FrameTicks({ className = "border-[#d4cdc4]/50" }: { className?: string }) {
  return (
    <>
      <span className={`absolute left-0 top-0 hidden h-5 w-5 border-l border-t sm:block ${className}`} />
      <span className={`absolute right-0 top-0 hidden h-5 w-5 border-r border-t sm:block ${className}`} />
      <span className={`absolute bottom-0 left-0 hidden h-5 w-5 border-b border-l sm:block ${className}`} />
      <span className={`absolute bottom-0 right-0 hidden h-5 w-5 border-b border-r sm:block ${className}`} />
    </>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: IconType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase text-[#d4cdc4]/40">
      <Icon className="h-3.5 w-3.5 text-[#e6c3a8]" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

function ScrollFadeBlock({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const ref = useScrollFade<HTMLDivElement>();

  return (
    <div ref={ref} className={className} style={{ opacity: 0.2 }}>
      {children}
    </div>
  );
}

function PortraitStamp() {
  return (
    <figure className="relative w-full max-w-52.5 sm:max-w-57.5 lg:max-w-61.5">
      <div className="relative aspect-3/4 overflow-hidden border border-[#d4cdc4]/25">
        <Image
          alt={ABOUT_CONTENT.portrait.alt}
          src="/me crop pixel.png"
          fill
          priority={false}
          sizes="(min-width: 1024px) 246px, 230px"
          className="object-cover object-center grayscale-30 saturate-[0.78] contrast-[1.08] brightness-[0.94]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,8,0)_35%,rgba(13,11,8,0.68)_100%)]" />
        <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={SCANLINE_STYLE} />
        <FrameTicks />
      </div>
      <ScrollFadeBlock className="mt-2 flex items-center justify-between gap-3 pb-2 font-mono text-[10px] uppercase text-[#d4cdc4]/60 sm:border-b sm:border-[#d4cdc4]/20">
        <span>{ABOUT_CONTENT.portrait.feedLabel}</span>
        <span>{ABOUT_CONTENT.portrait.capturedAt}</span>
      </ScrollFadeBlock>
    </figure>
  );
}

function StickyIntroLabel() {
  return (
    <ScrollFadeBlock className="pb-4 font-mono text-[11px] uppercase text-[#e6c3a8] sm:border-b sm:border-[#d4cdc4]/50">
      <p className="flex items-center gap-2 text-[12px] font-bold">
        <FaRegAddressCard className="h-3.5 w-3.5" aria-hidden />
        <span>{ABOUT_CONTENT.intro.label}</span>
      </p>
      <p className="mt-2 font-semibold text-[#d4cdc4]/40">{ABOUT_CONTENT.intro.meta}</p>
    </ScrollFadeBlock>
  );
}

function VibeSignal() {
  const { displayedText, isTyping } = useTypewriter(ABOUT_CONTENT.vibe.emojis, 100, 2000);

  return (
    <ScrollFadeBlock className="py-3 lg:mt-4">
      <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase text-[#d4cdc4]/40">
        <span className="inline-flex items-center gap-2 text-[12px] font-bold">
          <FaSignal className={`h-3 w-3 ${isTyping ? "animate-pulse text-[#e6c3a8]" : "text-[#d4cdc4]/25"}`} aria-hidden />
          {ABOUT_CONTENT.vibe.label}
        </span>
        <span>{ABOUT_CONTENT.vibe.emojis.length} states</span>
      </div>
      <div className="font-mono text-3xl font-semibold leading-none text-[#d4cdc4] sm:text-4xl lg:text-[2rem]">
        {displayedText}
        <span className="ml-1 inline-block h-[1em] w-0.75 translate-y-1 bg-[#e6c3a8] align-baseline" />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] text-[#d4cdc4]/30">
        {ABOUT_CONTENT.vibe.emojis.map((emoji) => (
          <span key={emoji} className={displayedText === emoji ? "text-[#e6c3a8]" : undefined}>
            {emoji}
          </span>
        ))}
      </div>
    </ScrollFadeBlock>
  );
}

function RailNamePlate() {
  return (
    <ScrollFadeBlock className="py-3 sm:border-b sm:border-[#d4cdc4]/20">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/36">
        {ABOUT_CONTENT.rail.eyebrow}
      </p>
      <p className="mt-2 max-w-[9ch] font-display text-4xl uppercase leading-[0.9] text-[#d4cdc4] sm:text-5xl lg:text-[3.35rem]">
        {ABOUT_CONTENT.rail.name}
      </p>
    </ScrollFadeBlock>
  );
}

function FadeInView({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { amount: 0.1, margin: "-8% 0px -16% 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {
          opacity: prefersReducedMotion ? 1 : 0.18,
          y: prefersReducedMotion ? 0 : 34,
        },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.72, ease: viewEase },
        },
      }}
      className={`scroll-mt-28 py-12 lg:min-h-[78vh] lg:py-14 ${className}`}
    >
      {children}
    </motion.article>
  );
}

function ViewTitle({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="relative pb-7">
      <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/46">
        <span className="h-2 w-2 rotate-45 bg-[#e6c3a8]" />
        <span>{meta}</span>
        <span className="h-px flex-1 bg-[#d4cdc4]/18" />
      </div>
      <h2 className="max-w-[11ch] font-display text-6xl uppercase leading-[0.88] text-[#f4eee3] sm:text-8xl md:text-9xl">
        {title}
      </h2>
    </div>
  );
}

function FloatingPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative bg-[#0d0b08]/24 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.14)] sm:p-6 ${className}`}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(230,195,168,0.52),rgba(212,205,196,0.12)_45%,transparent)]" />
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#e6c3a8]/70" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#d4cdc4]/24" />
      {children}
    </div>
  );
}

function ProfileSheetRow({
  children,
  icon,
  label,
  className = "",
}: {
  children: React.ReactNode;
  icon: IconType;
  label: string;
  className?: string;
}) {
  return (
    <section className={`grid gap-6 border-t border-[#d4cdc4]/14 py-8 md:grid-cols-[142px_minmax(0,1fr)] md:py-9 xl:grid-cols-[164px_minmax(0,1fr)] ${className}`}>
      <SectionLabel icon={icon}>{label}</SectionLabel>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function ProfileSummaryPanel() {
  return (
    <ProfileSheetRow icon={FaUser} label={ABOUT_CONTENT.summary.sectionLabel} className="border-t-0 pt-0">
      <div className="space-y-7">
        <p className="max-w-3xl text-lg leading-8 text-[#d4cdc4]/82 sm:text-xl">
          {ABOUT_CONTENT.summary.lead}
          <span className="text-[#d4cdc4]/58"> {ABOUT_CONTENT.summary.detail}</span>
        </p>

        <dl className="grid grid-cols-2 gap-3 sm:max-w-136 sm:gap-4">
          {ABOUT_CONTENT.profileStats.map((stat) => (
            <div key={stat.label} className="relative min-w-0 border border-[#d4cdc4]/14 bg-[#0d0b08]/18 p-4 sm:p-5">
              <span className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 bg-[#e6c3a8]/70" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 bg-[#d4cdc4]/24" />
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/42">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-5xl leading-none text-[#e6c3a8] sm:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </ProfileSheetRow>
  );
}

function CoreStackPanel() {
  return (
    <ProfileSheetRow icon={FaCode} label={ABOUT_CONTENT.sections.coreStack}>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 xl:grid-cols-4">
        {CORE_STACK_ITEMS.map((item, index) => (
          <span
            key={item.name}
            className="inline-flex min-w-0 items-center gap-2 font-mono text-xs font-semibold uppercase text-[#d4cdc4]"
          >
            <span className="text-[#e6c3a8]">{String(index + 1).padStart(2, "0")}</span>
            <span className="shrink-0 text-[#d4cdc4]" aria-hidden>{item.icon}</span>
            <span className="truncate">{item.name}</span>
          </span>
        ))}
      </div>
    </ProfileSheetRow>
  );
}

function PersonalStatsPanel() {
  return (
    <ProfileSheetRow icon={FaChartBar} label={ABOUT_CONTENT.sections.stats}>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
        {ABOUT_CONTENT.personalStats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/40">
              {stat.label}
            </p>
            <p className="flex items-center gap-2 font-mono text-base font-semibold text-[#d4cdc4]">
              {stat.isHighlighted ? <span className="h-2 w-2 rounded-full bg-[#e6c3a8]" /> : null}
              <span className="whitespace-nowrap">{stat.value}</span>
            </p>
          </div>
        ))}
      </div>
    </ProfileSheetRow>
  );
}

function ExperiencePanel() {
  return (
    <ProfileSheetRow icon={FaBriefcase} label={ABOUT_CONTENT.sections.experience} className="py-10 md:py-11">
      <div className="relative pl-9 sm:pl-12">
        <span
          className="absolute bottom-8 left-1.5 top-2 w-px bg-[linear-gradient(180deg,rgba(230,195,168,0.86),rgba(212,205,196,0.22)_52%,rgba(212,205,196,0.04))]"
          aria-hidden
        />
        {ABOUT_CONTENT.experience.map((item, index) => (
          <article
            key={`${item.company}-${item.role}`}
            className="relative pb-10 last:pb-0"
          >
            <span
              className={`absolute -left-9.5 top-1 h-3.25 w-3.25 border border-[#0d0b08] sm:-left-12.5 ${
                index === 0 ? "bg-[#e6c3a8] shadow-[0_0_0_5px_rgba(230,195,168,0.12)]" : "bg-[#d4cdc4]/48"
              }`}
              aria-hidden
            />
            <span
              className="absolute -left-7.75 top-1.75 hidden h-px w-7 bg-[#d4cdc4]/20 sm:-left-10.75 sm:block"
              aria-hidden
            />

            <div className="grid gap-5 border-t border-[#d4cdc4]/10 pt-5 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(210px,0.62fr)_minmax(0,1fr)] lg:gap-8">
              <div className="min-w-0">
                <div className="mb-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-mono text-base font-semibold leading-snug text-[#d4cdc4]">
                    {item.role}
                  </h3>
                  <span className={index === 0 ? "font-mono text-[10px] uppercase text-[#e6c3a8]" : "font-mono text-[10px] uppercase text-[#d4cdc4]/40"}>
                    {item.badge}
                  </span>
                </div>
                <p className="font-mono text-xs text-[#d4cdc4]/58">
                  {item.company}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#d4cdc4]/34">
                  {item.duration}
                </p>
              </div>

              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.focus.map((focus) => (
                    <span
                      key={focus}
                      className="border border-[#d4cdc4]/12 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#d4cdc4]/58"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase text-[#d4cdc4]/40">
                  <span>{item.status}</span>
                  {index === 0 ? (
                    <span className="relative h-1 w-24 overflow-hidden bg-[#d4cdc4]/10">
                      <span
                        className="absolute inset-y-0 w-1/2 bg-[#e6c3a8]/75"
                        style={{ animation: "loading 1.5s ease-in-out infinite" }}
                      />
                    </span>
                  ) : (
                    <span className="h-1 w-8 bg-[#e6c3a8]/60" />
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </ProfileSheetRow>
  );
}

function LocationPanel() {
  return (
    <ProfileSheetRow icon={FaMapMarkerAlt} label={ABOUT_CONTENT.sections.location} className="pb-0">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/40">
            {ABOUT_CONTENT.location.regionLabel}
          </p>
          <p className="font-mono text-sm font-semibold text-[#d4cdc4]">{ABOUT_CONTENT.location.region}</p>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/40">
            {ABOUT_CONTENT.location.localTimeLabel}
          </p>
          <LocalTimeClient className="font-mono text-sm font-semibold text-[#d4cdc4]" />
        </div>
      </div>
    </ProfileSheetRow>
  );
}

function SoftwareEngineerView() {
  return (
    <FadeInView id="about-software-engineer" className="pt-6 lg:min-h-[92vh]">
      <ViewTitle title={ABOUT_CONTENT.views.profile.title} meta={ABOUT_CONTENT.views.profile.meta} />

      <div className="relative max-w-304">
        <span className="pointer-events-none absolute bottom-0 left-0 top-1 hidden w-px bg-[linear-gradient(180deg,rgba(230,195,168,0.48),rgba(212,205,196,0.12)_35%,transparent)] md:block" />
        <div className="md:pl-6 xl:pl-8">
          <ProfileSummaryPanel />
          <ExperiencePanel />
          <CoreStackPanel />
          <PersonalStatsPanel />
          <LocationPanel />
        </div>
      </div>
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
    <div className="relative min-h-40 overflow-hidden border border-[#d4cdc4]/10 bg-[#11100d] sm:min-h-44">
      {hasImage ? (
        <Image
          src={project.image}
          alt={`${displayTitle} preview`}
          fill
          priority={index < 2}
          sizes="(min-width: 1024px) 220px, 100vw"
          className="object-cover grayscale-12 saturate-[0.9] contrast-[1.02] transition duration-500 group-hover/project:scale-[1.025] group-hover/project:grayscale-0"
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
    <article className="group/project grid transform-gpu gap-5 border-t border-[#d4cdc4]/12 py-6 transition-[border-color,translate] duration-200 ease-out first:border-t-0 first:pt-0 hover:translate-x-1.5 hover:border-[#d4cdc4]/22 motion-reduce:transition-none motion-reduce:hover:translate-x-0 sm:grid-cols-[196px_minmax(0,1fr)] sm:gap-6">
      <ProjectVisual project={project} displayTitle={displayTitle} index={index} />

      <div className="flex min-w-0 flex-col">
        <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase text-[#d4cdc4]/42">
          <span>[{String(index + 1).padStart(2, "0")}]</span>
          <span>{project.year}</span>
        </div>

        <h4 className="font-display text-3xl leading-none text-[#d4cdc4] transition-colors duration-300 group-hover/project:text-[#f4eee3] sm:text-4xl">
          {displayTitle}
        </h4>

        <p className="mt-3 overflow-hidden text-sm leading-6 text-[#d4cdc4]/62 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="border-l border-[#d4cdc4]/14 pl-3 font-mono text-[10px] uppercase text-[#d4cdc4]/54 first:border-l-0 first:pl-0"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpen(project.id)}
            className="inline-flex h-8 items-center gap-2 border-b border-[#d4cdc4]/24 font-mono text-[10px] uppercase text-[#f4eee3] transition hover:border-[#f4eee3]"
          >
            Read
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-2 border-b border-transparent font-mono text-[10px] uppercase text-[#d4cdc4]/62 transition hover:border-[#d4cdc4]/24 hover:text-[#f4eee3]"
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
              className="inline-flex h-8 items-center gap-2 border-b border-transparent font-mono text-[10px] uppercase text-[#d4cdc4]/62 transition hover:border-[#d4cdc4]/24 hover:text-[#f4eee3]"
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
  return (
    <FadeInView id="about-projects">
      <ViewTitle title={ABOUT_CONTENT.views.projects.title} meta={`view 02 / ${PROJECTS.length} records`} />

      <FloatingPanel className="max-w-6xl px-5 py-8 sm:px-8 sm:py-10 xl:ml-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-[#d4cdc4]/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel icon={FaBriefcase}>{ABOUT_CONTENT.views.projects.sectionLabel}</SectionLabel>
            <p className="mt-3 max-w-2xl font-mono text-[12px] leading-6 text-[#d4cdc4]/56">
              {ABOUT_CONTENT.views.projects.description}
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4cdc4]/42">
            archive: {PROJECTS.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="space-y-4">
          {PROJECTS.map((project, index) => (
            <ProjectListCard
              key={project.id}
              project={project}
              index={index}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      </FloatingPanel>
    </FadeInView>
  );
}

function CostBars({ filled }: { filled: number }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span key={bar} className={`h-2 w-1 bg-current ${filled >= bar ? "opacity-100" : "opacity-20"}`} />
      ))}
    </div>
  );
}

function AboutTechChip({ tech }: { tech: TechItem }) {
  const filledBars = Math.ceil(tech.cost / 3);

  return (
    <div
      tabIndex={0}
      className="about-tech-card group relative min-h-35.5 cursor-default overflow-hidden border border-[#A69F8D]/30 bg-[#0d0b08]/24 p-4 text-[#A69F8D] transition-colors duration-200 hover:border-[#A69F8D]/80 hover:bg-[#A69F8D] hover:text-[#0d0b08] focus-visible:border-[#A69F8D] focus-visible:bg-[#A69F8D] focus-visible:text-[#0d0b08] focus-visible:outline-none"
    >
      <div className="absolute left-0 top-0 h-1 w-1 bg-[#A69F8D] transition-colors group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute right-0 top-0 h-1 w-1 bg-[#A69F8D] transition-colors group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute bottom-0 left-0 h-1 w-1 bg-[#A69F8D] transition-colors group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute bottom-0 right-0 h-1 w-1 bg-[#A69F8D] transition-colors group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />

      <div className="absolute right-3 top-3 font-mono text-xs opacity-60">[{tech.cost}]</div>

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="shrink-0 opacity-80 transition-colors group-hover:opacity-100">
            {tech.icon}
          </div>
          <span className="font-mono text-base font-bold uppercase tracking-tight group-hover:glitch-jitter group-focus-visible:glitch-jitter">
            {tech.name}
          </span>
        </div>

        <div className="mb-2 h-px w-full bg-current opacity-20" />

        <div className="flex items-end justify-between">
          <span className="mr-2 truncate font-mono text-[10px] uppercase tracking-widest opacity-80">
            {tech.description}
          </span>
          <CostBars filled={filledBars} />
        </div>
      </div>
    </div>
  );
}

function AboutTechCategory({ category }: { category: TechCategoryDef }) {
  const categoryMemory = category.items.reduce((acc, item) => acc + item.cost, 0);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 font-mono">
        <div className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#A69F8D]" />
        <h4 className="whitespace-nowrap font-display text-3xl font-bold italic leading-none text-[#A69F8D] sm:text-4xl">
          {category.label}
        </h4>
        <div className="h-px flex-1 bg-[#A69F8D]/15" />
        <span className="hidden text-[10px] uppercase tracking-widest text-[#A69F8D]/35 sm:block">
          {category.tag}
        </span>
        <span className="font-mono text-[10px] tracking-wider text-[#A69F8D]/50">
          {categoryMemory} mem
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {category.items.map((tech) => (
          <AboutTechChip key={tech.name} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function AboutTechStackView() {
  return (
    <FadeInView id="about-tech-stack" className="pb-2">
      <ViewTitle title={ABOUT_CONTENT.views.techStack.title} meta={`view 03 / ${TECH_STACK_ITEMS.length} installed chips`} />

      <div className="relative max-w-6xl xl:ml-auto">
        <div className="mb-9 grid gap-5 border-t border-[#A69F8D]/26 pt-5 sm:grid-cols-[minmax(150px,0.34fr)_minmax(0,1fr)] sm:items-end">
          <SectionLabel icon={FaCode}>Installed chips</SectionLabel>
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A69F8D]/58 sm:items-end sm:text-right">
            <p>memory: {TECH_STACK_TOTAL_MEMORY} / 256</p>
            <p>{TECH_STACK_CATEGORIES.length} categories / cursor enabled in view</p>
          </div>
        </div>

        <div className="space-y-11">
          {TECH_STACK_CATEGORIES.map((category) => (
            <AboutTechCategory key={category.key} category={category} />
          ))}
        </div>
      </div>
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

function SectionDitherBackdrop() {
  const prefersReducedMotion = useReducedMotion();
  const layerRef = React.useRef<HTMLDivElement>(null);
  const ditherStartedRef = React.useRef(false);
  const [hasDitherStarted, setHasDitherStarted] = React.useState(false);

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
      const layerRect = layer.getBoundingClientRect();
      const visibleTop = Math.max(sectionRect.top, layerRect.top);
      const visibleBottom = Math.min(sectionRect.bottom, layerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight <= 1 || sectionRect.top >= window.innerHeight || sectionRect.bottom <= 0) {
        layer.style.opacity = "0";
        layer.style.clipPath = "inset(50% 0px 50% 0px)";
        layer.style.setProperty("-webkit-clip-path", "inset(50% 0px 50% 0px)");
        return;
      }

      if (!ditherStartedRef.current) {
        ditherStartedRef.current = true;
        setHasDitherStarted(true);
      }

      const topClip = Math.max(0, visibleTop - layerRect.top);
      const bottomClip = Math.max(0, layerRect.bottom - visibleBottom);
      const opacity = Math.min(1, (visibleHeight / layerRect.height) * 1.2) * 0.11;
      const clipValue = `inset(${topClip.toFixed(1)}px 0px ${bottomClip.toFixed(1)}px 0px)`;

      layer.style.opacity = opacity.toFixed(3);
      layer.style.clipPath = clipValue;
      layer.style.setProperty("-webkit-clip-path", clipValue);
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateBounds);
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-1 h-[clamp(7rem,16svh,11rem)] opacity-0"
      style={{
        clipPath: "inset(50% 0px 50% 0px)",
        WebkitClipPath: "inset(50% 0px 50% 0px)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 44%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 44%, black 100%)",
        willChange: "clip-path, opacity",
      }}
      aria-hidden
    >
      {hasDitherStarted ? (
        <Dither
          waveColor={[166 / 255, 159 / 255, 141 / 255]}
          disableAnimation={Boolean(prefersReducedMotion)}
          enableMouseInteraction={false}
          enableOnMobile
          colorNum={2}
          waveAmplitude={0.08}
          waveFrequency={2}
          waveSpeed={0.05}
        />
      ) : null}
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
            className="grid gap-4 sm:grid-cols-[minmax(170px,230px)_minmax(0,1fr)] sm:items-end lg:block"
          >
            <div className="sm:col-span-2 lg:mb-4">
              <StickyIntroLabel />
            </div>
            <div className="lg:mb-5">
              <PortraitStamp />
            </div>
            <RailNamePlate />
            <VibeSignal />
          </div>
        </aside>

        <div className="relative lg:pl-12 xl:pl-16 xl:pr-2">
          <ScrollFadeBlock className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[#d4cdc4]/50 lg:block" />
          <div className="space-y-16 lg:space-y-28">
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
        className="relative w-full overflow-x-clip py-24 sm:py-32"
      >
        <div className="absolute inset-0 -z-10 bg-[#0d0b08]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(212,205,196,0.08),transparent_28%,rgba(166,159,141,0.08)_72%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-56 bg-[linear-gradient(180deg,#0d0b08_0%,rgba(13,11,8,0.94)_26%,rgba(13,11,8,0)_100%)]" aria-hidden />
        <div className="absolute inset-0 -z-10 opacity-45" style={SCANLINE_STYLE} />
        <BackgroundLineArt className="opacity-55" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 12px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) calc(100% - 12px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 12px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 calc(100% - 12px) / 100% 1px no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 36px 0 / 1px 100% no-repeat, " +
              "linear-gradient(to right, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) calc(100% - 36px) 0 / 1px 100% no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 36px / 100% 1px no-repeat, " +
              "linear-gradient(to bottom, rgba(166,159,141,0.20), rgba(166,159,141,0.20)) 0 calc(100% - 36px) / 100% 1px no-repeat",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-368 px-6 sm:px-8 lg:px-10">
          <InViewAboutBlock />
        </div>

        <SectionDitherBackdrop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-[linear-gradient(180deg,rgba(13,11,8,0)_0%,#0d0b08_100%)]" aria-hidden />
      </section>
    </>
  );
}
