"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiGo, SiPython, SiPostgresql, SiStrapi, SiPayloadcms, SiDocker, SiPodman, SiNginx, SiGit, SiGithubactions, SiGitlab, SiFigma } from "react-icons/si";
import DecodingWord from "./DecodingWord";
import TargetCursor from "./TargetCursor";
import PixelBlast from "./PixelBlast";
import { useIsMobile } from "@/hooks/useIsMobile";

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
};

const TECH_STACK: TechItem[] = [
  { name: "Next.js", category: "Framework", cost: 12, icon: <SiNextdotjs size={24} />, description: "Server-side Rendering" },
  { name: "React", category: "Library", cost: 10, icon: <SiReact size={24} />, description: "UI Components" },
  { name: "TypeScript", category: "Language", cost: 8, icon: <SiTypescript size={24} />, description: "Type Safety" },
  { name: "Tailwind", category: "CSS", cost: 6, icon: <SiTailwindcss size={24} />, description: "Utility-first" },
  { name: "Go", category: "Language", cost: 14, icon: <SiGo size={24} />, description: "High Performance" },
  { name: "Python", category: "Language", cost: 10, icon: <SiPython size={24} />, description: "Automation & AI" },
  { name: "Postgres", category: "Database", cost: 11, icon: <SiPostgresql size={24} />, description: "Relational DB" },
  { name: "Strapi", category: "CMS", cost: 9, icon: <SiStrapi size={24} />, description: "Headless CMS" },
  { name: "Payload", category: "CMS", cost: 9, icon: <SiPayloadcms size={24} />, description: "Code-first CMS" },
  { name: "Docker", category: "Container", cost: 15, icon: <SiDocker size={24} />, description: "Containerization" },
  { name: "Podman", category: "Container", cost: 12, icon: <SiPodman size={24} />, description: "Daemonless" },
  { name: "Nginx", category: "Server", cost: 8, icon: <SiNginx size={24} />, description: "Reverse Proxy" },
  { name: "Git", category: "VCS", cost: 4, icon: <SiGit size={24} />, description: "Version Control" },
  { name: "GitHub Actions", category: "CI/CD", cost: 13, icon: <SiGithubactions size={24} />, description: "Automation Workflows" },
  { name: "GitLab CI", category: "CI/CD", cost: 13, icon: <SiGitlab size={24} />, description: "DevOps Pipelines" },
  { name: "Figma", category: "Design", cost: 7, icon: <SiFigma size={24} />, description: "UI/UX Design" },
];

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeRect, setActiveRect] = useState<ActiveRect | null>(null);

  const enableHoverParticles = !isMobile && !prefersReducedMotion;
  const enableCursor = !prefersReducedMotion;
  const particleColor = hoveredIndex !== null ? "#130e05" : "#A69F8D";

  const updateActiveRect = useCallback(() => {
    if (hoveredIndex === null || !gridContainerRef.current) {
      setActiveRect(null);
      return;
    }

    const hoveredCard = cardRefs.current[hoveredIndex];
    if (!hoveredCard) {
      setActiveRect(null);
      return;
    }

    const cardBounds = hoveredCard.getBoundingClientRect();
    const containerBounds = gridContainerRef.current.getBoundingClientRect();

    setActiveRect({
      x: cardBounds.left - containerBounds.left,
      y: cardBounds.top - containerBounds.top,
      width: cardBounds.width,
      height: cardBounds.height,
    });
  }, [hoveredIndex]);

  const registerCardRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      cardRefs.current[index] = element;
      if (hoveredIndex === index) {
        updateActiveRect();
      }
    },
    [hoveredIndex, updateActiveRect]
  );

  useEffect(() => {
    if (!enableHoverParticles) {
      setActiveRect(null);
      return;
    }
    updateActiveRect();
  }, [enableHoverParticles, updateActiveRect]);

  useEffect(() => {
    if (!enableHoverParticles || hoveredIndex === null) return;
    const handlePositionChange = () => updateActiveRect();
    handlePositionChange();
    window.addEventListener("resize", handlePositionChange);
    window.addEventListener("scroll", handlePositionChange, true);
    return () => {
      window.removeEventListener("resize", handlePositionChange);
      window.removeEventListener("scroll", handlePositionChange, true);
    };
  }, [enableHoverParticles, hoveredIndex, updateActiveRect]);
  
  return (
    <section className="relative w-full py-20 overflow-hidden" ref={containerRef}>
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
      <div className="absolute inset-0 bg-[#130e05]/95 -z-20" style={{ backgroundColor: "var(--dark)" }} />
      
      {/* Decorative Separator & Fade Mask */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A69F8D]/30 to-transparent z-10" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[var(--dark)] to-transparent z-0 pointer-events-none" />

      {!isMobile && !prefersReducedMotion && (
        <div className="absolute inset-0 -z-15 opacity-20" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 150px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 150px)" }}>
            <PixelBlast
              pixelSize={24}
              color="#A69F8D"
              variant="square"
            />
        </div>
      )}
      <div className="absolute inset-0 scanlines -z-10 opacity-30 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 150px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 150px)" }} />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
         <motion.div 
           initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
           animate={prefersReducedMotion ? { opacity: 1, x: 0 } : isInView ? { opacity: 1, x: 0 } : {}}
           transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
           className="flex items-center gap-4 border-b border-[#A69F8D]/30 pb-4 mb-8"
         >
            <div className="w-2 h-2 bg-[#A69F8D] rotate-45" />
            <h2 className="text-2xl sm:text-3xl font-display tracking-widest text-[#A69F8D]">
              <DecodingWord word="INSTALLED_CHIPS" active={isInView} />
            </h2>
            <div className="flex-1" />
            <div className="text-xs font-mono text-[#A69F8D]/60 tracking-widest">
              MEMORY: {TECH_STACK.reduce((acc, item) => acc + item.cost, 0)} / 256
            </div>
         </motion.div>

         {/* Grid of Chips */}
         <div ref={gridContainerRef} className="relative">
            {enableHoverParticles && (
              <SharedParticleLayer 
                containerRef={gridContainerRef} 
                activeRect={activeRect} 
                color={particleColor} 
              />
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 relative z-10">
              {TECH_STACK.map((tech, index) => (
                <Chip 
                  key={tech.name} 
                  tech={tech} 
                  index={index} 
                  active={isInView}
                  isHovered={hoveredIndex === index}
                  registerRef={(element) => registerCardRef(element, index)}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() =>
                    setHoveredIndex((current) => {
                      if (current === index) {
                        setActiveRect(null);
                        return null;
                      }
                      return current;
                    })
                  }
                />
              ))}
            </div>
         </div>
      </div>
    </section>
  );
}

function Chip({
  tech,
  index,
  active,
  isHovered,
  registerRef,
  onHoverStart,
  onHoverEnd,
}: {
  tech: TechItem;
  index: number;
  active: boolean;
  isHovered: boolean;
  registerRef: (element: HTMLDivElement | null) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Animation variants for spawn
  const variants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      };
    }

    return {
      hidden: { 
        opacity: 0, 
        scaleX: isMobile ? 1 : 0, 
        filter: isMobile ? "blur(0px)" : "blur(4px)"
      },
      visible: { 
        opacity: 1, 
        scaleX: 1,
        filter: "blur(0px)",
        transition: { 
          duration: isMobile ? 0.2 : 0.4, 
          delay: isMobile ? 0 : index * 0.05,
          ease: [0.16, 1, 0.3, 1] as const,
        }  
      }
    };
  }, [isMobile, index, prefersReducedMotion]);

  return (
    <motion.div
      ref={registerRef}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={variants}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      tabIndex={0}
      className={`
        relative min-h-[140px] h-auto p-4 border transition-colors duration-200 cursor-default group overflow-hidden tech-card
        ${isHovered ? 'bg-[#A69F8D] border-[#A69F8D] text-[#130e05]' : 'bg-[#130e05]/40 border-[#A69F8D]/30 text-[#A69F8D] hover:border-[#A69F8D]/80'}
      `}
    >
      {/* Corner decorative markers */}
      <div className={`absolute top-0 left-0 w-1 h-1 transition-colors ${isHovered ? 'bg-[#130e05]' : 'bg-[#A69F8D]'}`} />
      <div className={`absolute top-0 right-0 w-1 h-1 transition-colors ${isHovered ? 'bg-[#130e05]' : 'bg-[#A69F8D]'}`} />
      <div className={`absolute bottom-0 left-0 w-1 h-1 transition-colors ${isHovered ? 'bg-[#130e05]' : 'bg-[#A69F8D]'}`} />
      <div className={`absolute bottom-0 right-0 w-1 h-1 transition-colors ${isHovered ? 'bg-[#130e05]' : 'bg-[#A69F8D]'}`} />

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
          <span className={`block font-bold font-mono tracking-tight text-lg uppercase ${isHovered ? 'glitch-jitter' : ''}`}>
            {tech.name}
          </span>
        </div>
        
        <div className="h-[1px] w-full bg-current opacity-20 mb-2" />
        
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-80 truncate mr-2">
              {tech.category}
          </span>
          
          {/* Hover reveal description or static decorative bar */}
          <div className="flex gap-0.5 shrink-0">
               {Array.from({ length: 5 }).map((_, i) => (
                   <div 
                      key={i} 
                      className={`w-1 h-2 ${i < Math.ceil(tech.cost / 3) ? 'opacity-100' : 'opacity-20'} bg-current`}
                   />
               ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SharedParticleLayer({
  containerRef,
  activeRect,
  color,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeRect: ActiveRect | null;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRectRef = useRef<ActiveRect | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startLoopRef = useRef<(() => void) | null>(null);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    activeRectRef.current = activeRect;
    if (activeRect && startLoopRef.current) {
      startLoopRef.current();
    }
  }, [activeRect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resize();

    let resizeObserver: ResizeObserver | null = null;
    const canObserve = typeof ResizeObserver !== "undefined";
    if (canObserve) {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", resize);
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rect = activeRectRef.current;

      if (rect && particlesRef.current.length < 90 && Math.random() < 0.6) {
        particlesRef.current.push({
          x: rect.x + Math.random() * rect.width,
          y: rect.y + Math.random() * rect.height,
          size: Math.random() * 2 + 1,
          alpha: 0.85,
          speedY: Math.random() * 0.3 + 0.2,
          driftX: (Math.random() - 0.5) * 0.4,
          decay: Math.random() * 0.02 + 0.01,
        });
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.x += particle.driftX;
        particle.y -= particle.speedY;
        particle.alpha -= particle.decay;

        if (particle.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = colorRef.current;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      ctx.globalAlpha = 1;

      if (activeRectRef.current || particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
      }
    };

    const startLoop = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      particlesRef.current = [];
      startLoopRef.current = null;
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [containerRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />;
}
