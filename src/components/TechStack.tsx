"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
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
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const isMobile = useIsMobile();
  
  return (
    <section className="relative w-full py-20 overflow-hidden" ref={containerRef}>
      {/* Target Cursor for Tech Cards */}
      <TargetCursor 
        targetSelector=".tech-card" 
        spinDuration={4} 
        hideDefaultCursor={false} 
        hoverDuration={0.15}
        parallaxOn={false}
      />

      {/* Background decorations */}
      <div className="absolute inset-0 bg-[#130e05]/95 -z-20" style={{ backgroundColor: "var(--dark)" }} />
      
      {/* Decorative Separator & Fade Mask */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A69F8D]/30 to-transparent z-10" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[var(--dark)] to-transparent z-0 pointer-events-none" />

      {!isMobile && (
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
           initial={{ opacity: 0, x: -20 }}
           animate={isInView ? { opacity: 1, x: 0 } : {}}
           transition={{ duration: 0.8, ease: "easeOut" }}
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
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {TECH_STACK.map((tech, index) => (
              <Chip key={tech.name} tech={tech} index={index} active={isInView} />
            ))}
         </div>
      </div>
    </section>
  );
}

function Chip({ tech, index, active }: { tech: TechItem; index: number; active: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Animation variants for spawn
  const variants = useMemo(() => ({
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
        delay: isMobile ? 0 : index * 0.05
      }  
    }
  }), [isMobile, index]);

  return (
    <motion.div
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative min-h-[140px] h-auto p-4 border transition-colors duration-200 cursor-default group overflow-hidden tech-card
        ${isHovered ? 'bg-[#A69F8D] border-[#A69F8D] text-[#130e05]' : 'bg-[#130e05]/40 border-[#A69F8D]/30 text-[#A69F8D] hover:border-[#A69F8D]/80'}
      `}
    >
      {/* Particle Canvas Layer - Disabled on mobile for performance */}
      {!isMobile && <ParticleCanvas isHovered={isHovered} color={isHovered ? "#130e05" : "#A69F8D"} />}

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

function ParticleCanvas({ isHovered, color }: { isHovered: boolean; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; size: number; speedY: number; life: number; maxLife: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Resize canvas to match parent
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      
      // Spawn logic
      const spawnRate = isHovered ? 0.4 : 0.05;
      if (Math.random() < spawnRate) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height, // Spawn anywhere
          size: Math.random() * 2 + 1,      // Small squares
          speedY: Math.random() * 0.5 + 0.2,
          life: 1,
          maxLife: 1,
        });
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.y -= p.speedY; // Float up
        p.life -= 0.01; // Fade out
        
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life * 0.6; 
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, color]); // Dependencies dictate when the loop restarts, but particlesRef persists

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
