"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Me", href: "#work" },
  { label: "Work", href: "#projects" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Contact", href: "#contact" },
];

// Dark section IDs where navbar should invert colors
const DARK_SECTIONS = ["work", "installed_chips", "contact", "projects"];

// Pixel grid configuration
const PIXEL_SIZE = 6; // px - fixed square size
const PIXEL_ANIMATION_DURATION = 350; // ms

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  if (href === "#home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const element = document.getElementById(href.slice(1));
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Check for reduced motion preference (cached at module level for performance)
const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

// Canvas-based pixel transition overlay - much more performant than DOM elements
function PixelTransitionOverlay({
  isRevealing,
  pixelColor,
  onComplete,
  onShowContent,
}: {
  isRevealing: boolean;
  pixelColor: string;
  onComplete: () => void;
  onShowContent?: () => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>(0);
  const hasCalledShowContent = React.useRef(false);
  const hasCalledComplete = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reset callback flags
    hasCalledShowContent.current = false;
    hasCalledComplete.current = false;

    // Get actual size and set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // For reduced motion, just do a simple fade
    if (prefersReducedMotion) {
      canvas.style.transition = "opacity 150ms ease-out";
      canvas.style.opacity = isRevealing ? "1" : "0";
      if (isRevealing) {
        ctx.fillStyle = pixelColor;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
      setTimeout(() => {
        if (isRevealing && onShowContent) onShowContent();
      }, 100);
      setTimeout(onComplete, 200);
      return;
    }

    const cols = Math.ceil(rect.width / PIXEL_SIZE);
    const rows = Math.ceil(rect.height / PIXEL_SIZE);
    const totalPixels = cols * rows;

    // Create shuffled indices array once
    const indices: number[] = Array.from({ length: totalPixels }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Track pixel visibility state (Uint8 for memory efficiency)
    const pixelState = new Uint8Array(totalPixels);
    if (!isRevealing) {
      pixelState.fill(1); // Start all visible if hiding
    }

    const startTime = performance.now();

    // Single animation loop using requestAnimationFrame
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / PIXEL_ANIMATION_DURATION, 1);

      // Calculate how many pixels should be revealed/hidden by now
      const targetPixelCount = Math.floor(progress * totalPixels);

      // Update pixel states in batch
      for (let i = 0; i < targetPixelCount; i++) {
        const pixelIndex = indices[i];
        pixelState[pixelIndex] = isRevealing ? 1 : 0;
      }

      // Clear and redraw canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = pixelColor;

      for (let i = 0; i < totalPixels; i++) {
        if (pixelState[i]) {
          const x = (i % cols) * PIXEL_SIZE;
          const y = Math.floor(i / cols) * PIXEL_SIZE;
          ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        }
      }

      // Trigger callbacks at appropriate times
      if (progress >= 0.8 && !hasCalledShowContent.current && isRevealing && onShowContent) {
        hasCalledShowContent.current = true;
        onShowContent();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (!hasCalledComplete.current) {
        hasCalledComplete.current = true;
        // Small delay after animation completes
        setTimeout(onComplete, 50);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRevealing, pixelColor, onComplete, onShowContent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [shouldShow, setShouldShow] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isOnDarkBg, setIsOnDarkBg] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const prevShouldShowRef = React.useRef(false);

  // Desktop menu is expanded when hovered or clicked open
  const isExpanded = isHovered || isOpen;

  // Track active section and visibility on scroll
  React.useEffect(() => {
    const sections = ["contact", "hobbies", "work", "installed_chips", "projects"];

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Determine if navbar should be shown
      const newShouldShow = scrollY > 100;
      setShouldShow(newShouldShow);

      // Check if at top
      if (scrollY < 100) {
        setActiveSection("home");
        setIsOnDarkBg(false);
        return;
      }

      // Check each section for active state and dark background
      let foundDark = false;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveSection(sectionId === "installed_chips" ? "work" : sectionId);
          }
          // Check if navbar overlaps with this section (navbar is at top)
          if (rect.top <= 50 && rect.bottom > 0) {
            if (DARK_SECTIONS.includes(sectionId)) {
              foundDark = true;
            }
          }
        }
      }
      setIsOnDarkBg(foundDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle pixel transition animation
  React.useEffect(() => {
    if (shouldShow !== prevShouldShowRef.current) {
      prevShouldShowRef.current = shouldShow;

      if (shouldShow && !isVisible) {
        // Start reveal animation
        setIsVisible(true);
        setIsAnimating(true);
        setShowContent(false);
      } else if (!shouldShow && isVisible) {
        // Start hide animation
        setShowContent(false);
        setIsAnimating(true);
      }
    }
  }, [shouldShow, isVisible]);

  const handleAnimationComplete = React.useCallback(() => {
    setIsAnimating(false);
    if (!shouldShow) {
      setIsVisible(false);
    } else {
      setShowContent(true);
    }
  }, [shouldShow]);

  const handleShowContent = React.useCallback(() => {
    setShowContent(true);
  }, []);

  // Color classes based on background
  const bgColor = isOnDarkBg ? "bg-[#d4cfc4]" : "bg-[#0d0b08]";
  const pixelColor = isOnDarkBg ? "#d4cfc4" : "#0d0b08";
  const borderColor = isOnDarkBg ? "border-foreground/30" : "border-foreground/20";
  const textColor = isOnDarkBg ? "text-[#0d0b08]" : "text-white";
  const textColorMuted = isOnDarkBg ? "text-[#0d0b08]/50" : "text-white/50";
  const accentBg = isOnDarkBg ? "bg-[#0d0b08]" : "bg-white";
  const accentBgMuted = isOnDarkBg ? "bg-[#0d0b08]/20" : "bg-white/20";
  const accentBgHover = isOnDarkBg ? "bg-[#0d0b08]/40" : "bg-white/40";
  const activeBg = isOnDarkBg ? "bg-[#0d0b08]/10" : "bg-white/10";
  const hoverBg = isOnDarkBg ? "hover:bg-[#0d0b08]/5" : "hover:bg-white/5";
  const separatorBg = isOnDarkBg ? "bg-[#0d0b08]/10" : "bg-white/10";
  const cornerBorder = isOnDarkBg ? "border-[#0d0b08]/40" : "border-white/40";
  const activeBorder = isOnDarkBg ? "border-[#0d0b08]/60" : "border-white/60";
  const shadowColor = isOnDarkBg
    ? "shadow-[4px_4px_0px_0px_rgba(212,207,196,0.4)]"
    : "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]";

  return (
    <>
      {/* Desktop Navbar - Burger menu that expands left */}
      {isVisible && (
        <nav
          className="fixed top-0 right-4 z-50 hidden md:flex items-stretch"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Expanded nav links - slides in from right */}
          <AnimatePresence>
            {isExpanded && showContent && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden border-2 border-r-0 ${bgColor} ${borderColor} ${shadowColor} transition-colors duration-300`}
              >
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: isOnDarkBg
                      ? "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)"
                      : "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                  }}
                />

                {/* Corner accents */}
                <div
                  className={`absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 ${cornerBorder} transition-colors duration-300`}
                />

                {/* Nav items */}
                <div className="relative flex items-center whitespace-nowrap">
                  {NAV_ITEMS.map((item, index) => {
                    const isActive =
                      activeSection === item.href.slice(1) ||
                      (item.href === "#home" && activeSection === "home") ||
                      (item.href === "#work" && activeSection === "work");

                    return (
                      <React.Fragment key={item.label}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            handleSmoothScroll(e, item.href);
                            setIsOpen(false);
                          }}
                          className={`relative group px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                            isActive
                              ? `${textColor} ${activeBg}`
                              : `${textColorMuted} hover:${textColor} ${hoverBg}`
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="navbar-active"
                              className={`absolute inset-0 ${activeBg} border-b-2 ${activeBorder} transition-colors duration-300`}
                              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}

                          {/* Label */}
                          <span className="relative z-10 flex items-center gap-2">
                            <span
                              className={`w-[5px] h-[5px] transition-all duration-300 ${
                                isActive ? accentBg : `${accentBgMuted} group-hover:${accentBgHover}`
                              }`}
                            />
                            {item.label}
                          </span>
                        </a>

                        {/* Separator */}
                        {index < NAV_ITEMS.length - 1 && (
                          <div className={`w-px h-4 ${separatorBg} transition-colors duration-300`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Decorative element on left */}
                <div
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border ${cornerBorder} transition-colors duration-300`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Burger button */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative w-12 h-full min-h-[44px] border-2 ${!showContent ? "bg-transparent border-transparent shadow-none" : `${bgColor} ${borderColor} ${shadowColor}`} flex items-center justify-center transition-colors duration-300`}
              aria-label="Toggle menu"
            >
              {/* Pixel transition overlay */}
              {isAnimating && (
                <PixelTransitionOverlay
                  isRevealing={shouldShow}
                  pixelColor={pixelColor}
                  onComplete={handleAnimationComplete}
                  onShowContent={handleShowContent}
                />
              )}

              {/* Only render content when showContent is true */}
              {showContent && (
                <>
                  {/* Corner accents - only bottom */}
                  <div
                    className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b ${cornerBorder} transition-colors duration-300`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b ${cornerBorder} transition-colors duration-300`}
                  />

                  {/* Hamburger icon */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 origin-center ${
                        isOpen ? "rotate-45 translate-y-2" : ""
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 ${
                        isOpen ? "opacity-0" : ""
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 origin-center ${
                        isOpen ? "-rotate-45 -translate-y-2" : ""
                      }`}
                    />
                  </div>
                </>
              )}
            </button>

            {/* Decorative element on right */}
            {showContent && (
              <div
                className={`absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 ${accentBgMuted} transition-colors duration-300`}
              />
            )}
          </div>
        </nav>
      )}

      {/* Mobile Menu Button */}
      {isVisible && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-0 right-4 z-50 md:hidden w-12 h-12 border-2 ${!showContent ? "bg-transparent border-transparent shadow-none" : `${bgColor} ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]`} flex items-center justify-center transition-colors duration-300`}
          aria-label="Toggle menu"
        >
          {/* Pixel transition overlay for mobile button */}
          {isAnimating && (
            <PixelTransitionOverlay
              isRevealing={shouldShow}
              pixelColor={pixelColor}
              onComplete={handleAnimationComplete}
              onShowContent={handleShowContent}
            />
          )}

          {/* Only render content when showContent is true */}
          {showContent && (
            <>
              {/* Corner accents - only bottom */}
              <div
                className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b ${cornerBorder} transition-colors duration-300`}
              />
              <div
                className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b ${cornerBorder} transition-colors duration-300`}
              />

              {/* Hamburger icon */}
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 ${accentBg} transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </>
          )}
        </button>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-64 bg-[#0d0b08] border-l-2 border-foreground/20 z-40 md:hidden"
          >
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-white/30" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-white/30" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-white/30" />

            {/* Header */}
            <div className="pt-20 px-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-white/60 animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                  Navigation
                </span>
              </div>

              {/* Nav items */}
              <div className="space-y-1">
                {NAV_ITEMS.map((item, index) => {
                  const isActive =
                    activeSection === item.href.slice(1) ||
                    (item.href === "#home" && activeSection === "home") ||
                    (item.href === "#work" && activeSection === "work");

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        handleSmoothScroll(e, item.href);
                        setIsOpen(false);
                      }}
                      className={`relative group flex items-center gap-3 px-3 py-3 font-mono text-[12px] tracking-[0.15em] uppercase transition-all duration-300 ${
                        isActive
                          ? "text-white bg-white/10 border-l-2 border-white"
                          : "text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                      }`}
                    >
                      <span className="text-[9px] text-white/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`w-[5px] h-[5px] ${isActive ? "bg-white" : "bg-white/20"}`} />
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* Bottom decoration */}
              <div className="mt-8 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-white/20 tracking-wider">
                    NAV_SYS v1.0
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-white/30" />
                    <span className="w-1 h-1 bg-white/20" />
                    <span className="w-1 h-1 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
