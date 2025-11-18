"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

type AboutChatProps = {
  active?: boolean;
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
    skewY: 2,
    filter: "blur(2px)",
    clipPath: "inset(0 100% 0 0 round 6px)", // hidden with 0% width, reveals L→R
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    skewY: 0,
    filter: "blur(0)",
    clipPath: "inset(0 0% 0 0 round 6px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Small helpers for reference-inspired tiles
function Tile({ title, children, active }: { title: string; children: React.ReactNode; active: boolean }) {
  return (
    <div className="relative inline-block w-full sm:w-auto rounded-[6px] border border-muted/60 bg-muted px-5 py-3.5 sm:px-6 sm:py-4 shadow-sm tile-grid overflow-hidden">
      {active && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ width: 0, x: 0, opacity: 0.7 }}
          animate={{ width: "100%", x: "100%", opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
  const active = Math.round(total * fill);
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-2.5 rounded-[2px] border border-foreground/20 ${i < active ? "bg-foreground/80" : "bg-[color:rgba(19,14,5,0.18)]"}`} />
      ))}
    </div>
  );
}

/**
 * Left-aligned, Nier Automata-inspired chat feed used in the About section.
 */
export default function AboutChat({ active = false }: AboutChatProps) {
  return (
    <motion.ol
      aria-label="About chat"
      className="relative mt-6 max-w-prose lg:max-w-[38rem] text-muted space-y-5 sm:space-y-6"
      variants={container}
      initial="hidden"
      animate={active ? "show" : "hidden"}
    >
      {/* Left timeline rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px] left-rail"
        style={{ transform: "translateX(-12px)" }}
      />

      <motion.li variants={item}>
        <Tile title="PROFILE" active={active}>
          <p className="text-sm leading-relaxed text-foreground">
            I’m a front‑end engineer crafting calm, performant interfaces with a soft sci‑fi aesthetic.
          </p>
        </Tile>
      </motion.li>

      <motion.li variants={item}>
        <Tile title="STACK" active={active}>
          <div className="flex flex-wrap gap-2">
            {['Next.js','TypeScript','Tailwind','Framer Motion','WebGL'].map((t) => (
              <Chip key={t} text={t} />
            ))}
          </div>
        </Tile>
      </motion.li>

      <motion.li variants={item}>
        <Tile title="ETHOS" active={active}>
          <div className="space-y-2.5">
            <Meter label="Clarity" value={88} />
            <Meter label="Tactile" value={82} />
            <Meter label="Performance" value={91} />
          </div>
        </Tile>
      </motion.li>

      <motion.li variants={item}>
        <Tile title="RESULT" active={active}>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <span className="font-mono text-[12px] tracking-wider">+22% conversion</span>
            <span className="opacity-40">|</span>
            <span className="font-mono text-[12px] tracking-wider">~1.2s LCP</span>
          </div>
        </Tile>
      </motion.li>

      <motion.li variants={item}>
        <Tile title="SIDE QUESTS" active={active}>
          <Matrix cols={12} rows={4} fill={0.58} />
          <p className="mt-2 text-xs text-foreground/70">Shaders · generative art · rapid prototyping</p>
        </Tile>
      </motion.li>

      <motion.li variants={item}>
        <Tile title="STATUS" active={active}>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="dot-led" /> Available for freelance & collaborations
          </div>
        </Tile>
      </motion.li>
    </motion.ol>
  );
}
