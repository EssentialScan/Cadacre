"use client";

import { motion, MotionValue } from "framer-motion";

export function DataGrid({ yOffset }: { yOffset?: MotionValue<number> }) {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-[2]"
      style={{ y: yOffset }}
    >
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundSize: "80px 80px",
          backgroundImage: `
            linear-gradient(rgba(15,118,110,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,118,110,0.05) 1px, transparent 1px)
          `,
        }}
      />
    </motion.div>
  );
}
