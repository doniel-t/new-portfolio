"use client";

import HashLoader from "react-spinners/HashLoader";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1000;
const DISSOLVE_MS = 1325;
const VIDEO_REVEAL_MS = 1325;
const LOADER_COLOR = "#A69F8D";
const WEBM_VP9_TYPE = 'video/webm; codecs="vp9"';

type TransitionVideoAsset = {
  src: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
};

const TRANSITION_VIDEO_ASSETS: TransitionVideoAsset[] = [
  {
    src: "/load-transition/dissolve-landscape-720.webm",
    width: 720,
    height: 450,
    orientation: "landscape",
  },
  {
    src: "/load-transition/dissolve-landscape-1440.webm",
    width: 1440,
    height: 900,
    orientation: "landscape",
  },
  {
    src: "/load-transition/dissolve-landscape-2560.webm",
    width: 2560,
    height: 1600,
    orientation: "landscape",
  },
  {
    src: "/load-transition/dissolve-landscape-3840.webm",
    width: 3840,
    height: 2400,
    orientation: "landscape",
  },
  {
    src: "/load-transition/dissolve-portrait-720.webm",
    width: 720,
    height: 1280,
    orientation: "portrait",
  },
  {
    src: "/load-transition/dissolve-portrait-1440.webm",
    width: 1440,
    height: 2560,
    orientation: "portrait",
  },
  {
    src: "/load-transition/dissolve-portrait-2160.webm",
    width: 2160,
    height: 3840,
    orientation: "portrait",
  },
];

type LoadTransitionOverlayProps = {
  label?: string;
  blockPointerEvents?: boolean;
  active?: boolean;
  onCovered?: () => void;
  onDone?: () => void;
  holdMs?: number;
  revealMs?: number;
};

type TransitionPhase = "holding" | "revealing" | "fading";

function chooseTransitionVideoAsset(width: number, height: number) {
  const orientation = height > width ? "portrait" : "landscape";
  const candidates = TRANSITION_VIDEO_ASSETS.filter((asset) => asset.orientation === orientation);
  const dimension = orientation === "portrait" ? height : width;

  return (
    candidates.find((asset) => (orientation === "portrait" ? asset.height : asset.width) >= dimension) ??
    candidates[candidates.length - 1] ??
    TRANSITION_VIDEO_ASSETS[0]
  );
}

export function LoadTransitionOverlay({
  label = "Initializing",
  blockPointerEvents = false,
  active,
  onCovered,
  onDone,
  holdMs = HOLD_MS,
  revealMs = DISSOLVE_MS,
}: LoadTransitionOverlayProps) {
  const shouldRun = active ?? true;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onCoveredRef = useRef(onCovered);
  const onDoneRef = useRef(onDone);
  const finishRef = useRef<() => void>(() => {});
  const hasStartedRevealRef = useRef(false);
  const [isVisible, setIsVisible] = useState(shouldRun);
  const [showLoader, setShowLoader] = useState(true);
  const [phase, setPhase] = useState<TransitionPhase>("holding");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoUnsupported, setVideoUnsupported] = useState(false);
  const [darkColor, setDarkColor] = useState("#0d0b08");
  const [activeAsset, setActiveAsset] = useState<TransitionVideoAsset>(TRANSITION_VIDEO_ASSETS[1]);

  onCoveredRef.current = onCovered;
  onDoneRef.current = onDone;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches);

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    const probe = document.createElement("video");
    setVideoUnsupported(!probe.canPlayType(WEBM_VP9_TYPE));
  }, []);

  useEffect(() => {
    const resolvedDark = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark")
      .trim();

    if (resolvedDark) {
      setDarkColor(resolvedDark);
    }
  }, []);

  useEffect(() => {
    if (!shouldRun) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, [shouldRun]);

  useEffect(() => {
    if (!isVisible) return;

    const syncAsset = () => {
      const nextAsset = chooseTransitionVideoAsset(window.innerWidth, window.innerHeight);
      setActiveAsset((current) => (current.src === nextAsset.src ? current : nextAsset));
    };

    syncAsset();
    window.addEventListener("resize", syncAsset, { passive: true });

    return () => window.removeEventListener("resize", syncAsset);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !shouldRun) return;

    let done = false;
    let fallbackTimeoutId = 0;
    let playbackVideo: HTMLVideoElement | null = null;
    const video = videoRef.current;

    const finishOnce = () => {
      if (done) return;
      done = true;
      hasStartedRevealRef.current = false;
      setIsVisible(false);
      setShowLoader(false);
      setPhase("holding");
      onDoneRef.current?.();
    };

    finishRef.current = finishOnce;
    hasStartedRevealRef.current = false;
    setPhase("holding");
    setShowLoader(true);
    onCoveredRef.current?.();

    if (video) {
      video.pause();
      video.playbackRate = VIDEO_REVEAL_MS / revealMs;
      try {
        video.currentTime = 0;
        video.load();
      } catch {
        // The transition can still run once metadata is available.
      }
    }

    if (reducedMotion || videoUnsupported) {
      const fadeTimeoutId = window.setTimeout(() => {
        setShowLoader(false);
        setPhase("fading");
      }, holdMs);
      const doneTimeoutId = window.setTimeout(finishOnce, holdMs + 300);

      return () => {
        done = true;
        window.clearTimeout(fadeTimeoutId);
        window.clearTimeout(doneTimeoutId);
      };
    }

    const holdTimeoutId = window.setTimeout(() => {
      const playableVideo = videoRef.current;
      setShowLoader(false);
      setPhase("revealing");

      if (!playableVideo) {
        fallbackTimeoutId = window.setTimeout(finishOnce, revealMs);
        return;
      }

      playableVideo.playbackRate = VIDEO_REVEAL_MS / revealMs;
      playbackVideo = playableVideo;
      hasStartedRevealRef.current = true;

      try {
        playableVideo.currentTime = 0;
      } catch {
        // Some browsers reject seeking before metadata is ready.
      }

      void playableVideo.play().catch(() => {
        setVideoUnsupported(true);
      });

      fallbackTimeoutId = window.setTimeout(finishOnce, revealMs + 500);
    }, holdMs);

    return () => {
      done = true;
      finishRef.current = () => {};
      hasStartedRevealRef.current = false;
      window.clearTimeout(holdTimeoutId);
      window.clearTimeout(fallbackTimeoutId);
      playbackVideo?.pause();
    };
  }, [holdMs, isVisible, reducedMotion, revealMs, shouldRun, videoUnsupported]);

  if (!isVisible) {
    return null;
  }

  const isSoftFade = phase === "fading";
  const isVideoReveal = phase === "revealing" && !reducedMotion && !videoUnsupported;

  return (
    <div
      data-load-transition-overlay
      data-load-transition-renderer={isVideoReveal ? "video" : "solid"}
      data-load-transition-video={activeAsset.src}
      className={`fixed inset-0 z-[200] ${blockPointerEvents ? "pointer-events-auto" : "pointer-events-none"} ${
        isSoftFade ? "transition-opacity duration-300 ease-out" : ""
      }`}
      style={{
        backgroundColor: isVideoReveal ? "transparent" : darkColor,
        opacity: isSoftFade ? 0 : 1,
      }}
    >
      {!reducedMotion && !videoUnsupported ? (
        <video
          key={activeAsset.src}
          ref={videoRef}
          aria-hidden
          muted
          playsInline
          preload="auto"
          width={activeAsset.width}
          height={activeAsset.height}
          onEnded={() => {
            if (hasStartedRevealRef.current) {
              finishRef.current();
            }
          }}
          onError={() => setVideoUnsupported(true)}
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{ imageRendering: "pixelated" }}
        >
          <source src={activeAsset.src} type={WEBM_VP9_TYPE} />
        </video>
      ) : null}

      <div
        aria-hidden={!showLoader}
        className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ease-out"
        style={{ opacity: showLoader ? 1 : 0 }}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-5"
          style={{ color: LOADER_COLOR }}
        >
          <HashLoader color={LOADER_COLOR} size={72} speedMultiplier={0.9} />
          <span className="font-display text-xl leading-none">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function InitialLoadTransition() {
  return <LoadTransitionOverlay />;
}
