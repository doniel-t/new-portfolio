/** One entrance timeline shared by the copy, controls, and collage layers. */
export function heroReveal(order: number, reducedMotion: boolean | null, opacity = 1) {
  return {
    initial: reducedMotion ? false as const : { opacity: 0 },
    animate: { opacity },
    transition: {
      duration: reducedMotion ? 0 : 0.65,
      delay: reducedMotion ? 0 : order * 0.11,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };
}
