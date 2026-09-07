"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ambientConfig } from "./ambient.config";

export function AmbientGradient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {ambientConfig.gradientBlobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${blob.x} ${blob.y}, ${blob.color}, transparent ${blob.size})`,
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: blob.animation.x,
                  y: blob.animation.y,
                }
          }
          transition={{
            duration: blob.animation.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
