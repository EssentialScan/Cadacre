"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Word-by-word slide-up reveal. FIXED: no overflow-hidden clip, uses y in px
 * not % so words are always in the document flow and in-view detection works.
 */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={`inline ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          className="inline-block mr-[0.25em] last:mr-0"
          aria-hidden
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.65, ease: EASE, delay: delay + wi * stagger }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/** Directional fade-slide in. */
export function SlideIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const initial =
    direction === "left"
      ? { x: -32, opacity: 0 }
      : direction === "right"
        ? { x: 32, opacity: 0 }
        : { y: 24, opacity: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Scale-up reveal for cards and panels. */
export function ScaleReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.96, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parallax scroll — children shift vertically at a fraction of scroll speed. */
export function ParallaxShift({
  children,
  className = "",
  speed = 0.15,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

export { Counter } from "./Counter";
