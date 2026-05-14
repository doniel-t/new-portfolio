"use client";

import React from "react";
import mediaAssetsJson from "./pixelDividerMediaAssets.json";

type PixelDividerAxis = "vertical" | "horizontal";
type PixelDividerDirection = "up" | "down" | "left" | "right";

export type PixelDividerMediaAsset = {
  axis: PixelDividerAxis;
  src: string;
  width: number;
  height: number;
  color: string;
  pixelSize: number;
  durationSec: number;
  travelPercent: number;
  streams: number;
  direction: PixelDividerDirection;
};

type PixelDividerMediaQuery = {
  axis: PixelDividerAxis;
  color: string;
  pixelSize: number;
  durationSec: number;
  travel: string;
  streams: number;
  direction: PixelDividerDirection;
};

type PixelDividerVideoProps = {
  assets: PixelDividerMediaAsset[];
  className: string;
  style: React.CSSProperties;
  fallback: React.ReactElement;
};

const mediaAssets = mediaAssetsJson as PixelDividerMediaAsset[];
const WEBM_VP9_TYPE = 'video/webm; codecs="vp9"';

function normalizeColor(color: string) {
  const trimmed = color.trim().toLowerCase();
  const shortHex = trimmed.match(/^#([0-9a-f]{3})$/i);

  if (shortHex) {
    return `#${shortHex[1]
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`;
  }

  return trimmed;
}

function parsePercent(value: string) {
  const match = value.match(/^(-?\d+(?:\.\d+)?)%$/);
  return match ? Math.abs(Number.parseFloat(match[1])) : null;
}

function isClose(a: number, b: number) {
  return Math.abs(a - b) < 0.02;
}

function findMatchingAssets({
  axis,
  color,
  pixelSize,
  durationSec,
  travel,
  streams,
  direction,
}: PixelDividerMediaQuery) {
  const travelPercent = parsePercent(travel);
  if (travelPercent === null) return [];

  const normalizedColor = normalizeColor(color);

  return mediaAssets
    .filter(
      (asset) =>
        asset.axis === axis &&
        normalizeColor(asset.color) === normalizedColor &&
        asset.pixelSize === pixelSize &&
        asset.streams === streams &&
        asset.direction === direction &&
        isClose(asset.durationSec, durationSec) &&
        isClose(asset.travelPercent, travelPercent),
    )
    .sort((a, b) => a.width - b.width);
}

export function getPixelDividerMediaAssets(query: PixelDividerMediaQuery) {
  return findMatchingAssets(query);
}

export function getPixelDividerMediaAsset(query: PixelDividerMediaQuery) {
  return findMatchingAssets(query)[0] ?? null;
}

function chooseAssetForWidth(assets: PixelDividerMediaAsset[], width: number) {
  const targetWidth = Math.max(1, Math.ceil(width));
  return assets.find((asset) => asset.width >= targetWidth) ?? assets[assets.length - 1];
}

function resetVideoToFirstFrame(video: HTMLVideoElement) {
  video.pause();

  const seek = () => {
    try {
      video.currentTime = 0;
    } catch {
      // Some browsers reject seeking before metadata is ready.
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    seek();
    return;
  }

  video.addEventListener("loadedmetadata", seek, { once: true });
}

export function PixelDividerVideo({ assets, className, style, fallback }: PixelDividerVideoProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [activeAsset, setActiveAsset] = React.useState(() => assets[0]);
  const [videoUnsupported, setVideoUnsupported] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [isNearViewport, setIsNearViewport] = React.useState(false);

  React.useEffect(() => {
    setActiveAsset((current) => {
      if (assets.some((asset) => asset.src === current.src)) return current;
      return assets[0];
    });
  }, [assets]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "220px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isNearViewport) return;

    const container = containerRef.current;
    if (!container) return;

    const syncAsset = () => {
      const nextAsset = chooseAssetForWidth(assets, container.clientWidth || 1);
      setActiveAsset((current) => (current.src === nextAsset.src ? current : nextAsset));
    };

    syncAsset();
    const observer = new ResizeObserver(syncAsset);
    observer.observe(container);

    return () => observer.disconnect();
  }, [assets, isNearViewport]);

  React.useEffect(() => {
    const probe = document.createElement("video");
    setVideoUnsupported(!probe.canPlayType(WEBM_VP9_TYPE));
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    if (videoUnsupported || !isNearViewport) return;

    const video = videoRef.current;
    if (!video) return;

    let disposed = false;

    const syncPlayback = () => {
      if (disposed) return;

      if (reducedMotion) {
        resetVideoToFirstFrame(video);
        return;
      }

      void video.play().catch(() => {
        setVideoUnsupported(true);
      });
    };

    syncPlayback();

    return () => {
      disposed = true;
      video.pause();
    };
  }, [activeAsset.src, isNearViewport, reducedMotion, videoUnsupported]);

  if (videoUnsupported) {
    return fallback;
  }

  return (
    <div
      ref={containerRef}
      data-pixel-divider-renderer="video"
      data-pixel-divider-axis={activeAsset.axis}
      data-pixel-divider-src={activeAsset.src}
      data-pixel-divider-width={activeAsset.width}
      className={className}
      style={style}
    >
      {isNearViewport ? (
        <video
          key={activeAsset.src}
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          width={activeAsset.width}
          height={activeAsset.height}
          onError={() => setVideoUnsupported(true)}
          className="absolute left-1/2 top-0 h-full min-w-full max-w-none -translate-x-1/2 object-cover"
          style={{ width: "auto", imageRendering: "pixelated" }}
        >
          <source src={activeAsset.src} type={WEBM_VP9_TYPE} />
        </video>
      ) : null}
    </div>
  );
}
