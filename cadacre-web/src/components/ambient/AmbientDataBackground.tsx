"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { AmbientGradient } from "./AmbientGradient";
import { DataGrid } from "./DataGrid";
import { DataContours } from "./DataContours";
import { DataParticles } from "./DataParticles";
import { ambientConfig } from "./ambient.config";

export function AmbientDataBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();

  // Parallax shifts
  const gridY = useTransform(scrollY, (v) => v * ambientConfig.parallax.grid);
  const contourY = useTransform(scrollY, (v) => v * ambientConfig.parallax.contours);

  // Mouse interaction spring
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates -1 to 1 based on window size
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      
      mouseX.set(normalizedX * 10); // max 10px shift
      mouseY.set(normalizedY * 10);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  // Overall breathing effect
  const breatheScale = shouldReduceMotion ? 1 : undefined; // controlled via animate prop

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      animate={
        shouldReduceMotion 
          ? {} 
          : { scale: [0.995, 1.005, 0.995] }
      }
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        x: mouseX,
        y: mouseY,
      }}
    >
      <AmbientGradient />
      <DataGrid yOffset={gridY} />
      <DataContours yOffset={contourY} />
      <DataParticles />
    </motion.div>
  );
}
