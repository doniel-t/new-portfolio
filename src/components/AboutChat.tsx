"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

type AboutChatProps = {
  active?: boolean;
};

// NieR Automata-inspired bento card component
function BentoCard({ 
  title, 
  children, 
  active,
  className = ""
}: { 
  title: string; 
  children: React.ReactNode; 
  active: boolean;
  className?: string;
}) {
  const isMobile = useIsMobile();
  return (
    <div className={`relative h-full rounded-[6px] border border-muted/60 bg-muted px-5 py-4 shadow-sm tile-grid overflow-hidden ${className}`}>
      {active && !isMobile && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ width: 0, x: 0, opacity: 0.7 }}
          animate={{ width: "100%", x: "100%", opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
        />
      )}
      <div className="mb-2 font-mono text-[11px] tracking-wider uppercase text-foreground/80 flex items-center gap-2">
        <span className="inline-block h-[10px] w-[10px] rounded-[2px] bg-foreground/70" />
        <span>{title}</span>
        <span className="ml-auto text-foreground/40">▮▯</span>
      </div>
      {children}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-[88px] font-mono text-[11px] tracking-wider uppercase text-foreground/70">{label}</span>
      <div className="h-[7px] flex-1 rounded-[3px] bg-[color:rgba(19,14,5,0.22)] border border-foreground/20">
        <div className="h-full rounded-[2px] bg-foreground/80" style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right font-mono text-[11px] text-foreground/70">{value}%</span>
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-[4px] border border-foreground/20 bg-[color:rgba(19,14,5,0.12)] px-2 py-1 font-mono text-[11px] tracking-wide text-foreground/80">{text}</span>
  );
}

function Matrix({ cols = 10, rows = 4, fill = 0.45 }: { cols?: number; rows?: number; fill?: number }) {
  const total = cols * rows;
  const activeCount = Math.round(total * fill);
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-2.5 rounded-[2px] border border-foreground/20 ${i < activeCount ? "bg-foreground/80" : "bg-[color:rgba(19,14,5,0.18)]"}`} />
      ))}
    </div>
  );
}

/**
 * NieR Automata-inspired bento grid layout for About section info cards.
 */
export default function AboutChat({ active = false }: AboutChatProps) {
  const isMobile = useIsMobile();

  const container: Variants = useMemo(() => ({
    hidden: {},
    show: {
      transition: { staggerChildren: isMobile ? 0 : 0.08, delayChildren: isMobile ? 0 : 0.05 },
    },
  }), [isMobile]);

  const item: Variants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: isMobile ? 0 : 16,
      x: isMobile ? 0 : -8,
      scale: isMobile ? 1 : 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { 
        duration: isMobile ? 0.3 : 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      },
    },
  }), [isMobile]);

  return (
    <motion.div
      aria-label="About info"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-muted"
      variants={container}
      initial="hidden"
      animate={active ? "show" : "hidden"}
    >
      {/* Profile - spans 2 cols */}
      <motion.div variants={item} className="col-span-2" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="PROFILE" active={active}>
          <p className="text-sm leading-relaxed text-foreground">
            I&apos;m a front‑end engineer crafting calm, performant interfaces with a soft sci‑fi aesthetic.
          </p>
        </BentoCard>
      </motion.div>

      {/* Status - spans 2 cols */}
      <motion.div variants={item} className="col-span-2" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="STATUS" active={active}>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="dot-led" /> Available for freelance & collaborations
          </div>
        </BentoCard>
      </motion.div>

      {/* Results - spans 2 cols */}
      <motion.div variants={item} className="col-span-2" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="RESULTS" active={active}>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <span className="font-mono text-[12px] tracking-wider">+22% conversion</span>
            <span className="opacity-40">|</span>
            <span className="font-mono text-[12px] tracking-wider">~1.2s LCP</span>
          </div>
        </BentoCard>
      </motion.div>

      {/* Stack - spans 3 cols on lg, 2 on md */}
      <motion.div variants={item} className="col-span-2 md:col-span-2 lg:col-span-3" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="STACK" active={active}>
          <div className="flex flex-wrap gap-2">
            {['Next.js','TypeScript','Tailwind','Framer Motion','WebGL'].map((t) => (
              <Chip key={t} text={t} />
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* Ethos - spans 3 cols on lg, 2 on md */}
      <motion.div variants={item} className="col-span-2 md:col-span-2 lg:col-span-3" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="ETHOS" active={active}>
          <div className="space-y-2.5">
            <Meter label="Clarity" value={88} />
            <Meter label="Tactile" value={82} />
            <Meter label="Performance" value={91} />
          </div>
        </BentoCard>
      </motion.div>

      {/* Side Quests - spans full width */}
      <motion.div variants={item} className="col-span-2 md:col-span-4 lg:col-span-6" style={{ willChange: 'transform, opacity' }}>
        <BentoCard title="SIDE QUESTS" active={active}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <Matrix cols={12} rows={4} fill={0.58} />
            </div>
            <p className="text-xs text-foreground/70 sm:max-w-[200px]">Shaders · generative art · rapid prototyping</p>
          </div>
        </BentoCard>
      </motion.div>
    </motion.div>
  );
}
