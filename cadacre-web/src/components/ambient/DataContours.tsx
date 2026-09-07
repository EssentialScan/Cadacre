"use client";

import { motion, useReducedMotion, MotionValue } from "framer-motion";

export function DataContours({ yOffset }: { yOffset?: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();

  // A very subtle topographic/analytical contour map over the right side
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-[2] flex justify-end items-center"
      style={{ y: yOffset }}
    >
      <svg 
        className="w-[800px] h-[800px] opacity-[0.08] -mr-32" 
        viewBox="0 0 800 800" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M 600,100 C 700,200 700,400 500,500 C 300,600 400,750 600,800" 
          stroke="#0F766E" 
          strokeWidth="1.5" 
          strokeDasharray="4 8"
          animate={shouldReduceMotion ? {} : { strokeDashoffset: [0, -100] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 650,50 C 750,150 780,350 600,450 C 420,550 500,700 700,750" 
          stroke="#0F766E" 
          strokeWidth="1" 
          strokeDasharray="4 12"
          animate={shouldReduceMotion ? {} : { strokeDashoffset: [0, -100] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 700,0 C 800,100 850,300 700,400 C 550,500 600,650 800,700" 
          stroke="#0F766E" 
          strokeWidth="1" 
          animate={shouldReduceMotion ? {} : { strokeDashoffset: [0, -100] }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
}
