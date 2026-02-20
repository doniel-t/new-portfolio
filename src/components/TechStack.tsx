"use client";

import React, { useRef, useEffect, useMemo, useCallback, memo, forwardRef, useImperativeHandle } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiGo, SiPython, SiPostgresql, SiStrapi, SiPayloadcms, SiDocker, SiPodman, SiNginx, SiGit, SiGithubactions, SiGitlab, SiFigma } from "react-icons/si";
import DecodingWord from "./DecodingWord";
import TargetCursor from "./TargetCursor";
import { useIsMobile } from "@/hooks/useIsMobile";
import Dither from "./Dither";
import { useGPUDetection } from "@/hooks/useGPUDetection";

type TechItem = {
  name: string;
  category: string;
  cost: number;
  icon: React.ReactNode;
  description: string;
};

type ActiveRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
  driftX: number;
  decay: number;
  active: boolean;
};

type SharedParticleLayerHandle = {
  setHoveredIndex: (index: number | null) => void;
};

// Pre-create icons once to avoid re-renders
const ICONS = {
  nextjs: <SiNextdotjs size={24} />,
  react: <SiReact size={24} />,
  typescript: <SiTypescript size={24} />,
  tailwind: <SiTailwindcss size={24} />,
  go: <SiGo size={24} />,
  python: <SiPython size={24} />,
  postgres: <SiPostgresql size={24} />,
  strapi: <SiStrapi size={24} />,
  payload: <SiPayloadcms size={24} />,
  docker: <SiDocker size={24} />,
  podman: <SiPodman size={24} />,
  nginx: <SiNginx size={24} />,
  git: <SiGit size={24} />,
  github: <SiGithubactions size={24} />,
  gitlab: <SiGitlab size={24} />,
  figma: <SiFigma size={24} />,
};

const TECH_STACK: TechItem[] = [
  { name: "Next.js", category: "Framework", cost: 12, icon: ICONS.nextjs, description: "Server-side Rendering" },
  { name: "React", category: "Library", cost: 10, icon: ICONS.react, description: "UI Components" },
  { name: "TypeScript", category: "Language", cost: 8, icon: ICONS.typescript, description: "Type Safety" },
  { name: "Tailwind", category: "CSS", cost: 6, icon: ICONS.tailwind, description: "Utility-first" },
  { name: "Go", category: "Language", cost: 14, icon: ICONS.go, description: "High Performance" },
  { name: "Python", category: "Language", cost: 10, icon: ICONS.python, description: "Automation & AI" },
  { name: "Postgres", category: "Database", cost: 11, icon: ICONS.postgres, description: "Relational DB" },
  { name: "Strapi", category: "CMS", cost: 9, icon: ICONS.strapi, description: "Headless CMS" },
  { name: "Payload", category: "CMS", cost: 9, icon: ICONS.payload, description: "Code-first CMS" },
  { name: "Docker", category: "Container", cost: 15, icon: ICONS.docker, description: "Containerization" },
  { name: "Podman", category: "Container", cost: 12, icon: ICONS.podman, description: "Daemonless" },
  { name: "Nginx", category: "Server", cost: 8, icon: ICONS.nginx, description: "Reverse Proxy" },
  { name: "Git", category: "VCS", cost: 4, icon: ICONS.git, description: "Version Control" },
  { name: "GitHub Actions", category: "CI/CD", cost: 13, icon: ICONS.github, description: "Automation Workflows" },
  { name: "GitLab CI", category: "CI/CD", cost: 13, icon: ICONS.gitlab, description: "DevOps Pipelines" },
  { name: "Figma", category: "Design", cost: 7, icon: ICONS.figma, description: "UI/UX Design" },
];

// Pre-compute total memory cost
const TOTAL_MEMORY = TECH_STACK.reduce((acc, item) => acc + item.cost, 0);

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sharedParticleLayerRef = useRef<SharedParticleLayerHandle | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const gpuSupport = useGPUDetection();

  const enableHoverParticles = !isMobile && !prefersReducedMotion && gpuSupport !== 'none';
  const enableCursor = !prefersReducedMotion && gpuSupport !== 'none';

  // Memoize hover handlers to prevent recreation on each render
  const hoverHandlers = useMemo(() => 
    TECH_STACK.map((_, index) => ({
      onHoverStart: () => {
        if (!enableHoverParticles) return;
        sharedParticleLayerRef.current?.setHoveredIndex(index);
      },
      onHoverEnd: () => {
        if (!enableHoverParticles) return;
        sharedParticleLayerRef.current?.setHoveredIndex(null);
      },
    })), 
  [enableHoverParticles]);
  
  return (
    <section id="installed_chips" className="relative w-full py-20 overflow-hidden" ref={containerRef}>
      {/* Target Cursor for Tech Cards */}
      {enableCursor && (
        
          <TargetCursor 
            targetSelector=".tech-card" 
            spinDuration={4} 
            hideDefaultCursor={false} 
            hoverDuration={0.15}
            parallaxOn={false}
          />
        
      )}

      {/* Background decorations */}
      <div className="absolute inset-0 bg-[#0d0b08]/95 -z-20" style={{ backgroundColor: "var(--dark)" }} />
      
      {/* Decorative Separator & Fade Mask */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A69F8D]/30 to-transparent z-10" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[var(--dark)] to-transparent z-0 pointer-events-none" />

      {/* Dither animated background - disabled on mobile */}
      {!prefersReducedMotion && !isMobile && (
        
          <div 
            className="absolute inset-0 -z-15 opacity-[0.16] pointer-events-none" 
            style={{ 
              maskImage: "linear-gradient(to bottom, transparent 20%, black 100%)", 
              WebkitMaskImage: "linear-gradient(to bottom, transparent 20%, black 100%)"
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
      <div className="absolute inset-0 scanlines -z-10 opacity-30 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 150px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 150px)" }} />

      {/* Bottom fade overlay - on top of dither */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#3C3A35] to-transparent z-0 pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
         
           <motion.div 
             className="flex items-center gap-4 border-b border-[#A69F8D]/30 pb-4 mb-8"
           >
              <div className="w-2 h-2 bg-[#A69F8D] rotate-45" />
              <h2 className="text-2xl sm:text-3xl font-display tracking-widest text-[#A69F8D]">
                <DecodingWord word="INSTALLED_CHIPS" active={isInView} />
              </h2>
              <div className="flex-1" />
              <div className="text-xs font-mono text-[#A69F8D]/60 tracking-widest">
                MEMORY: {TOTAL_MEMORY} / 256
              </div>
           </motion.div>
         

         {/* Grid of Chips */}
         <div ref={gridContainerRef} className="relative">
             {enableHoverParticles && (
               
                 <SharedParticleLayer 
                   ref={sharedParticleLayerRef}
                   containerRef={gridContainerRef} 
                   cardRefs={cardRefs}
                 />
               
             )}
            
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 relative z-10">
                {TECH_STACK.map((tech, index) => (
                  
                    <Chip 
                      key={tech.name}
                      tech={tech} 
                      index={index} 
                      cardRefs={cardRefs}
                      onHoverStart={hoverHandlers[index].onHoverStart}
                      onHoverEnd={hoverHandlers[index].onHoverEnd}
                    />
                  
                ))}
              </div>
            
         </div>
      </div>
    </section>
  );
}

// Pre-compute cost bars to avoid recreation
const COST_BARS = TECH_STACK.map(tech => Math.ceil(tech.cost / 3));

// Particle pool size - reduced from 90 for better performance
const MAX_PARTICLES = 40;

// Create particle pool once - avoids GC pressure
function createParticlePool(): Particle[] {
  const pool: Particle[] = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    pool.push({ x: 0, y: 0, size: 0, alpha: 0, speedY: 0, driftX: 0, decay: 0, active: false });
  }
  return pool;
}

const Chip = memo(function Chip({
  tech,
  index,
  cardRefs,
  onHoverStart,
  onHoverEnd,
}: {
  tech: TechItem;
  index: number;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const filledBars = COST_BARS[index];

  // Stable ref callback - avoids creating new functions on parent re-render
  const setRef = useCallback((element: HTMLDivElement | null) => {
    cardRefs.current[index] = element;
  }, [cardRefs, index]);

  return (
    <motion.div
      ref={setRef}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      tabIndex={0}
      className="relative min-h-[140px] h-auto p-4 border transition-colors duration-200 cursor-default group overflow-hidden tech-card bg-[#0d0b08]/40 border-[#A69F8D]/30 text-[#A69F8D] hover:border-[#A69F8D]/80 hover:bg-[#A69F8D] hover:text-[#0d0b08] focus-visible:border-[#A69F8D] focus-visible:bg-[#A69F8D] focus-visible:text-[#0d0b08]"
    >
      {/* Corner decorative markers */}
      <div className="absolute top-0 left-0 w-1 h-1 transition-colors bg-[#A69F8D] group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute top-0 right-0 w-1 h-1 transition-colors bg-[#A69F8D] group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute bottom-0 left-0 w-1 h-1 transition-colors bg-[#A69F8D] group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />
      <div className="absolute bottom-0 right-0 w-1 h-1 transition-colors bg-[#A69F8D] group-hover:bg-[#0d0b08] group-focus-visible:bg-[#0d0b08]" />

      {/* Icon in Top Left */}
      <div className="absolute top-3 left-3 transition-colors opacity-80 group-hover:opacity-100">
        {tech.icon}
      </div>

      {/* Memory Cost Top Right */}
      <div className="absolute top-3 right-3 font-mono text-xs opacity-60">
        [{tech.cost}]
      </div>

      {/* Content - Centered/Bottom */}
      <div className="relative z-10 flex flex-col justify-end h-full mt-4">
        <div className="mb-2">
          <span className="block font-bold font-mono tracking-tight text-lg uppercase group-hover:glitch-jitter group-focus-visible:glitch-jitter">
            {tech.name}
          </span>
        </div>
        
        <div className="h-[1px] w-full bg-current opacity-20 mb-2" />
        
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-80 truncate mr-2">
              {tech.category}
          </span>
          
          {/* Hover reveal description or static decorative bar */}
          <CostBars filled={filledBars} />
        </div>
      </div>
    </motion.div>
  );
});

// Memoized cost bars component to avoid re-rendering
const CostBars = memo(function CostBars({ filled }: { filled: number }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      <div className={`w-1 h-2 ${filled >= 1 ? 'opacity-100' : 'opacity-20'} bg-current`} />
      <div className={`w-1 h-2 ${filled >= 2 ? 'opacity-100' : 'opacity-20'} bg-current`} />
      <div className={`w-1 h-2 ${filled >= 3 ? 'opacity-100' : 'opacity-20'} bg-current`} />
      <div className={`w-1 h-2 ${filled >= 4 ? 'opacity-100' : 'opacity-20'} bg-current`} />
      <div className={`w-1 h-2 ${filled >= 5 ? 'opacity-100' : 'opacity-20'} bg-current`} />
    </div>
  );
});

const SharedParticleLayer = memo(
  forwardRef<
    SharedParticleLayerHandle,
    {
      containerRef: React.RefObject<HTMLDivElement | null>;
      cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    }
  >(function SharedParticleLayer({ containerRef, cardRefs }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activeRectRef = useRef<ActiveRect | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const startLoopRef = useRef<(() => void) | null>(null);
    const colorRef = useRef("#A69F8D");
    const hoveredIndexRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef(0);
    const syncFrameRef = useRef<number | null>(null);

    const particlePoolRef = useRef<Particle[] | null>(null);
    if (particlePoolRef.current === null) {
      particlePoolRef.current = createParticlePool();
    }

    const syncActiveRect = useCallback(() => {
      const hoveredIndex = hoveredIndexRef.current;
      const container = containerRef.current;

      if (hoveredIndex === null || !container) {
        activeRectRef.current = null;
        return;
      }

      const hoveredCard = cardRefs.current[hoveredIndex];
      if (!hoveredCard) {
        activeRectRef.current = null;
        return;
      }

      const cardBounds = hoveredCard.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();

      activeRectRef.current = {
        x: cardBounds.left - containerBounds.left,
        y: cardBounds.top - containerBounds.top,
        width: cardBounds.width,
        height: cardBounds.height,
      };
    }, [cardRefs, containerRef]);

    useImperativeHandle(
      ref,
      () => ({
        setHoveredIndex: (index: number | null) => {
          hoveredIndexRef.current = index;
          colorRef.current = index === null ? "#A69F8D" : "#0d0b08";
          syncActiveRect();
          if (startLoopRef.current) {
            startLoopRef.current();
          }
        },
      }),
      [syncActiveRect],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const pool = particlePoolRef.current!;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = container.clientWidth;
        const h = container.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const scheduleRectSync = () => {
        if (syncFrameRef.current !== null) return;

        syncFrameRef.current = requestAnimationFrame(() => {
          syncFrameRef.current = null;
          syncActiveRect();
          if (hoveredIndexRef.current !== null && startLoopRef.current) {
            startLoopRef.current();
          }
        });
      };

      resize();
      syncActiveRect();

      let resizeObserver: ResizeObserver | null = null;
      const canObserve = typeof ResizeObserver !== "undefined";
      if (canObserve) {
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);
      } else {
        window.addEventListener("resize", resize);
      }

      window.addEventListener("resize", scheduleRectSync);
      window.addEventListener("scroll", scheduleRectSync, true);

      const getInactiveParticle = (): Particle | null => {
        for (let i = 0; i < pool.length; i++) {
          if (!pool[i].active) return pool[i];
        }
        return null;
      };

      const FRAME_INTERVAL = 33;

      const tick = (timestamp: number) => {
        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed < FRAME_INTERVAL) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        lastFrameTimeRef.current = timestamp;

        const w = container.clientWidth;
        const h = container.clientHeight;
        ctx.clearRect(0, 0, w, h);

        const rect = activeRectRef.current;
        if (rect && Math.random() < 0.4) {
          const particle = getInactiveParticle();
          if (particle) {
            particle.x = rect.x + Math.random() * rect.width;
            particle.y = rect.y + Math.random() * rect.height;
            particle.size = Math.random() * 2 + 1;
            particle.alpha = 0.85;
            particle.speedY = Math.random() * 0.4 + 0.3;
            particle.driftX = (Math.random() - 0.5) * 0.5;
            particle.decay = Math.random() * 0.025 + 0.015;
            particle.active = true;
          }
        }

        let hasActiveParticles = false;
        ctx.fillStyle = colorRef.current;

        for (let i = 0; i < pool.length; i++) {
          const particle = pool[i];
          if (!particle.active) continue;

          particle.x += particle.driftX;
          particle.y -= particle.speedY;
          particle.alpha -= particle.decay;

          if (particle.alpha <= 0) {
            particle.active = false;
            continue;
          }

          hasActiveParticles = true;
          ctx.globalAlpha = particle.alpha;
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }

        ctx.globalAlpha = 1;

        if (activeRectRef.current || hasActiveParticles) {
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          animationFrameRef.current = null;
        }
      };

      const startLoop = () => {
        if (animationFrameRef.current !== null) return;
        lastFrameTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(tick);
      };

      startLoopRef.current = startLoop;

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        if (syncFrameRef.current !== null) {
          cancelAnimationFrame(syncFrameRef.current);
          syncFrameRef.current = null;
        }

        for (let i = 0; i < pool.length; i++) {
          pool[i].active = false;
        }

        startLoopRef.current = null;

        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener("resize", resize);
        }

        window.removeEventListener("resize", scheduleRectSync);
        window.removeEventListener("scroll", scheduleRectSync, true);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    }, [cardRefs, containerRef, syncActiveRect]);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />;
  }),
);
