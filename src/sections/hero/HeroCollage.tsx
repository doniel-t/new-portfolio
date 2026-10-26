"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroReveal } from "./heroMotion";

/** Misregistered photo fragments, print screens, and pasted paper scraps. */
export default function HeroCollage() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="hero-print" aria-hidden="true">
      <motion.div className="print-mesh" {...heroReveal(10, reducedMotion, 0.7)} />
      <motion.div className="print-paper" {...heroReveal(11, reducedMotion)} />
      <motion.div className="print-photo-echo" {...heroReveal(12, reducedMotion)}>
        <Image src="/hero-portrait-focus-v3.png" alt="" fill sizes="180px" className="print-portrait" />
      </motion.div>
      <motion.div className="print-photo" {...heroReveal(13, reducedMotion)}>
        <Image
          src="/hero-portrait-focus-v3.png"
          alt=""
          fill
          priority
          sizes="(max-width: 700px) 80vw, (max-width: 1100px) 43vw, 540px"
          className="print-portrait"
        />
        <motion.span className="portrait-corner-note" {...heroReveal(14, reducedMotion)}>A closer look.</motion.span>
        <motion.span className="portrait-quote" {...heroReveal(15, reducedMotion)}>It’s in the details.<br />Always in the details.</motion.span>
      </motion.div>
      <motion.div className="print-halftone" {...heroReveal(16, reducedMotion)} />
      <motion.span className="print-cutout-label" {...heroReveal(17, reducedMotion)}>FULLSTACK<br />ENGINEER</motion.span>
      <div className="print-crosses">
        <motion.span {...heroReveal(18, reducedMotion)} />
        <motion.span {...heroReveal(19, reducedMotion)} />
        <motion.span {...heroReveal(20, reducedMotion)} />
      </div>
      <motion.svg {...heroReveal(21, reducedMotion)} className="print-spark print-spark-large" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z" />
      </motion.svg>
      <motion.svg {...heroReveal(22, reducedMotion)} className="print-spark print-spark-small" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z" />
      </motion.svg>
      <motion.span className="print-caption" {...heroReveal(23, reducedMotion)}>A different perspective.</motion.span>
    </div>
  );
}
