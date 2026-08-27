"use client";

import { motion } from "framer-motion";

export function DrawRule({
  className = "",
  delay = 0,
  duration = 0.8,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`h-px w-full origin-left bg-faded-rule ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}
