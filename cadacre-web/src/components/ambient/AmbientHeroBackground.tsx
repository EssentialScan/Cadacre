"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * AmbientHeroBackground
 * 
 * A self-contained, multi-layered atmospheric gradient background.
 * Renders behind the hero content with pointer-events: none.
 * 
 * Layers:
 *   1. Base #F7F8FA
 *   2. Three large, very soft radial gradients (slowly drifting)
 *   3. Moving white "light field" 
 *   4. Faint architectural grid
 *   5. Subtle SVG contour lines (right side only)
 * 
 * All animation respects prefers-reduced-motion.
 * Mouse interaction is disabled on touch devices.
 */
export function AmbientHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();

  // Parallax: grid shifts very slightly on scroll
  const gridY = useTransform(scrollY, (v) => v * 0.02);
  const contourY = useTransform(scrollY, (v) => v * 0.01);

  // Mouse springs (low stiffness, high damping = gentle, settling response)
  const mouseX = useSpring(0, { stiffness: 30, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 25 });

  // Detect touch device
  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Mouse tracking (desktop only)
  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(nx * 4);   // max ±4px
      mouseY.set(ny * 4);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, shouldReduceMotion, isMobile]);

  // Scroll-based fade-out: hero leaving → background fades
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const isAnimating = !shouldReduceMotion;

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: fadeOpacity }}
      aria-hidden
    >
      {/* ─── Layer 1: Base colour ─── */}
      <div className="absolute inset-0 bg-[#F7F8FA]" />

      {/* ─── Layer 2: Ambient gradients ─── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: mouseX, y: mouseY }}
      >
        {/* Gradient A — soft teal, upper-left */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 35%, rgba(15,118,110,0.045), transparent 42%)",
          }}
          animate={
            isAnimating
              ? { x: [0, 30, 0], y: [0, 20, 0] }
              : {}
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient B — subtle blue, upper-right */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 20%, rgba(53,106,230,0.025), transparent 45%)",
          }}
          animate={
            isAnimating
              ? { x: [0, -25, 0], y: [0, -15, 0] }
              : {}
          }
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient C — faint teal, lower-right */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 65% 80%, rgba(15,118,110,0.025), transparent 40%)",
          }}
          animate={
            isAnimating
              ? { x: [0, 15, 0], y: [0, -25, 0] }
              : {}
          }
          transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ─── Layer 3: Moving white light field ─── */}
      {isAnimating && (
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.55), transparent 60%)",
            top: "10%",
            right: "-10%",
            filter: "blur(80px)",
          }}
          animate={{ x: [-40, 40, -40], y: [20, -20, 20] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ─── Layer 4: Architectural grid ─── */}
      <motion.div className="absolute inset-0" style={{ y: gridY }}>
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.018,
            backgroundSize: "80px 80px",
            backgroundImage: `
              linear-gradient(#0F766E 1px, transparent 1px),
              linear-gradient(90deg, #0F766E 1px, transparent 1px)
            `,
          }}
        />
      </motion.div>

      {/* ─── Layer 5: Contour lines (right side) ─── */}
      <motion.div
        className="absolute inset-0 flex justify-end items-center"
        style={{ y: contourY }}
      >
        <svg
          className="w-[700px] h-[700px] -mr-20 opacity-[0.04]"
          viewBox="0 0 700 700"
          fill="none"
        >
          <motion.path
            d="M 500 80 C 620 180 640 380 460 480 C 280 580 360 700 560 740"
            stroke="#0F766E"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            animate={isAnimating ? { strokeDashoffset: [0, -120] } : {}}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 560 40 C 680 140 700 340 540 440 C 380 540 440 680 640 720"
            stroke="#0F766E"
            strokeWidth="0.8"
            strokeDasharray="4 14"
            animate={isAnimating ? { strokeDashoffset: [0, -100] } : {}}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 620 10 C 700 110 720 280 600 380 C 480 480 520 620 700 660"
            stroke="#0F766E"
            strokeWidth="0.6"
            strokeDasharray="3 16"
            animate={isAnimating ? { strokeDashoffset: [0, -80] } : {}}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
