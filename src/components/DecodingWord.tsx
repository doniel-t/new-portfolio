"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type DecodingWordProps = {
  word: string;
  startDelayMs?: number;
  className?: string;
  active?: boolean; // when false, animation waits until true
};

const RANDOM_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-?";

export default function DecodingWord({ word, startDelayMs = 0, className, active = true }: DecodingWordProps) {
  const [revealCount, setRevealCount] = useState(0);
  const [scrambleTick, setScrambleTick] = useState(0);
  const revealIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!active || hasStartedRef.current) return;
    
    if (isMobile) {
      // On mobile, skip animation and reveal immediately
      setRevealCount(word.length);
      hasStartedRef.current = true;
      return;
    }

    hasStartedRef.current = true;
    startTimeoutRef.current = setTimeout(() => {
      scrambleIntervalRef.current = setInterval(() => {
        setScrambleTick((t) => t + 1);
      }, 30);

      revealIntervalRef.current = setInterval(() => {
        setRevealCount((count) => {
          const next = Math.min(word.length, count + 1);
          if (next >= word.length) {
            if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
            if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
          }
          return next;
        });
      }, 90);
    }, Math.max(0, startDelayMs));

    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    };
  }, [active, startDelayMs, word.length, isMobile]);

  const displayed = useMemo(() => {
    // If animation finished or mobile, show word
    if (revealCount >= word.length || isMobile) return word;
    
    const characters = word.split("");
    const out = characters.map((ch, idx) => {
      if (idx < revealCount) return ch;
      const randomIndex = (scrambleTick + idx) % RANDOM_CHARACTERS.length;
      return RANDOM_CHARACTERS[randomIndex];
    });
    return out.join("");
  }, [word, revealCount, scrambleTick, isMobile]);

  return (
    <span aria-label={word} className={className} style={{ position: "relative", display: "inline-block" }}>
      <span aria-hidden="true" style={{ visibility: "hidden", whiteSpace: "pre" }}>{word}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, whiteSpace: "pre" }}>{displayed}</span>
    </span>
  );
}
