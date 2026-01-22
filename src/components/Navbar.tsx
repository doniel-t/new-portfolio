"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Me", href: "#work" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// Dark section IDs where navbar should invert colors
const DARK_SECTIONS = ["work", "installed_chips", "contact"];

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

// Pixel transition overlay component
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = React.useState<{ visible: boolean; x: number; y: number }[]>([]);
  const [gridInfo, setGridInfo] = React.useState<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

  // Calculate grid on mount
  React.useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cols = Math.ceil(rect.width / PIXEL_SIZE);
    const rows = Math.ceil(rect.height / PIXEL_SIZE);

    setGridInfo({ cols, rows });

    const totalPixels = cols * rows;
    const initialPixels = Array.from({ length: totalPixels }, (_, i) => ({
      visible: !isRevealing, // Start hidden if revealing, visible if hiding
      x: (i % cols) * PIXEL_SIZE,
      y: Math.floor(i / cols) * PIXEL_SIZE,
    }));

    setPixels(initialPixels);
  }, [isRevealing]);

  // Animate pixels
  React.useEffect(() => {
    if (pixels.length === 0) return;

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const totalPixels = pixels.length;
    const indices = Array.from({ length: totalPixels }, (_, i) => i);

    // Shuffle indices for random order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const staggerDelay = PIXEL_ANIMATION_DURATION / totalPixels;

    indices.forEach((pixelIndex, i) => {
      const timeout = setTimeout(() => {
        setPixels((prev) => {
          const next = [...prev];
          if (next[pixelIndex]) {
            next[pixelIndex] = { ...next[pixelIndex], visible: isRevealing };
          }
          return next;
        });
      }, i * staggerDelay);
      timeoutsRef.current.push(timeout);
    });

    // Show content at 80% of reveal animation
    if (isRevealing && onShowContent) {
      const showContentTimeout = setTimeout(onShowContent, PIXEL_ANIMATION_DURATION * 0.8);
      timeoutsRef.current.push(showContentTimeout);
    }

    const completeTimeout = setTimeout(onComplete, PIXEL_ANIMATION_DURATION + 150);
    timeoutsRef.current.push(completeTimeout);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [pixels.length, isRevealing, onComplete]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {pixels.map((pixel, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pixel.x,
            top: pixel.y,
            width: PIXEL_SIZE,
            height: PIXEL_SIZE,
            backgroundColor: pixelColor,
            opacity: pixel.visible ? 1 : 0,
            transition: "opacity 100ms ease-out",
          }}
        />
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [shouldShow, setShouldShow] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isOnDarkBg, setIsOnDarkBg] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const prevShouldShowRef = React.useRef(false);

  // Track active section and visibility on scroll
  React.useEffect(() => {
    const sections = ["contact", "hobbies", "work", "installed_chips"];

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
      {/* Desktop Navbar */}
      {isVisible && (
        <nav className="fixed top-0 right-[10%] z-50 hidden md:block">
          <div className="relative">
            {/* Main container with NieR styling */}
            <div
              className={`relative border-2 ${!showContent ? "bg-transparent border-transparent shadow-none" : `${bgColor} ${borderColor} ${shadowColor}`} transition-colors duration-300`}
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
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      backgroundImage: isOnDarkBg
                        ? "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)"
                        : "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                    }}
                  />

                  {/* Corner accents - only bottom ones since top touches edge */}
                  <div
                    className={`absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 ${cornerBorder} transition-colors duration-300`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 ${cornerBorder} transition-colors duration-300`}
                  />

                  {/* Nav items */}
                  <div className="relative flex items-center">
                    {NAV_ITEMS.map((item, index) => {
                      const isActive =
                        activeSection === item.href.slice(1) ||
                        (item.href === "#home" && activeSection === "home") ||
                        (item.href === "#work" && activeSection === "work");

                      return (
                        <React.Fragment key={item.label}>
                          <a
                            href={item.href}
                            onClick={(e) => handleSmoothScroll(e, item.href)}
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
                </>
              )}

              {/* Invisible spacer to maintain size when content hidden */}
              {!showContent && (
                <div className="relative flex items-center invisible">
                  {NAV_ITEMS.map((item, index) => (
                    <React.Fragment key={item.label}>
                      <span className="px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase">
                        <span className="flex items-center gap-2">
                          <span className="w-[5px] h-[5px]" />
                          {item.label}
                        </span>
                      </span>
                      {index < NAV_ITEMS.length - 1 && <div className="w-px h-4" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Decorative elements - only show when content visible */}
            {showContent && (
              <>
                <div
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border ${cornerBorder} transition-colors duration-300`}
                />
                <div
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 ${accentBgMuted} transition-colors duration-300`}
                />
              </>
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
