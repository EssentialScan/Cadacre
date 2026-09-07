"use client";

import { motion, useReducedMotion, Transition } from "framer-motion";
import { FieldConfig } from "./ambient.config";

interface AmbientFieldProps {
  config: FieldConfig;
  className?: string;
}

export function AmbientField({ config, className = "" }: AmbientFieldProps) {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is preferred, use the first value of the animation arrays
  // to render a static, beautiful gradient.
  const animate = shouldReduceMotion ? {
    opacity: config.opacity[0],
    x: config.x[0],
    y: config.y[0],
  } : {
    opacity: config.opacity,
    x: config.x,
    y: config.y,
  };

  const transition: Transition = shouldReduceMotion ? {} : {
    duration: config.duration,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.25, 0.5, 0.75, 1],
  };

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none w-[120vw] h-[120vh] -left-[10vw] -top-[10vh] origin-center ${className}`}
      style={{
        backgroundImage: config.gradient,
      }}
      initial={{
        opacity: 0, // Fade in gently
        x: config.x[0],
        y: config.y[0]
      }}
      animate={animate}
      transition={transition}
    />
  );
}
