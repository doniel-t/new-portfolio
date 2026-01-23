"use client";

import React, { useState, useEffect } from "react";

type TerminalLineProps = {
  text: string;
  delay?: number;
  typingSpeed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
};

function TerminalLine({
  text,
  delay = 0,
  typingSpeed = 30,
  onComplete,
  showCursor = false,
  className = "",
}: TerminalLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [displayedText, text, typingSpeed, hasStarted, onComplete]);

  if (!hasStarted) {
    return null;
  }

  return (
    <div className={`font-mono text-sm ${className}`}>
      <span className="text-foreground/90">{displayedText}</span>
      {(isTyping || showCursor) && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-foreground/80 animate-pulse" />
      )}
    </div>
  );
}

export default TerminalLine;
