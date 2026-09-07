"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage: "linear-gradient(rgba(15,118,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,1) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
      }}
      animate={shouldReduceMotion ? {} : {
        y: [0, -10, 0]
      }}
      transition={{
        duration: 50,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}
