"use client";

export function canUseOffscreenCanvas(canvas: HTMLCanvasElement | null): boolean {
  return (
    typeof window !== "undefined" &&
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined" &&
    !!canvas &&
    typeof canvas.transferControlToOffscreen === "function"
  );
}
