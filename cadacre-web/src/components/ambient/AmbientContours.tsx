"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientContours() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025] flex items-center justify-center">
      <motion.svg 
        width="200%" 
        height="200%" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMid slice"
        className="stroke-[#0F766E] fill-none"
        style={{ strokeWidth: 1 }}
      >
        <motion.path
          d="M 100 500 Q 250 300 500 500 T 900 500"
          animate={shouldReduceMotion ? {} : {
            strokeDashoffset: [0, 1000]
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          strokeDasharray="20 10"
        />
        <motion.path
          d="M 150 600 Q 300 400 550 600 T 950 600"
          animate={shouldReduceMotion ? {} : {
            strokeDashoffset: [0, -1000]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          strokeDasharray="30 15"
        />
        <motion.path
          d="M 50 400 Q 200 200 450 400 T 850 400"
          animate={shouldReduceMotion ? {} : {
            strokeDashoffset: [1000, 0]
          }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          strokeDasharray="40 20"
        />
      </motion.svg>
    </div>
  );
}
