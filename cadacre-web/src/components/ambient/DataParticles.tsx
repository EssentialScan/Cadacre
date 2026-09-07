"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ambientConfig } from "./ambient.config";

export function DataParticles() {
  const shouldReduceMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Generate static nodes so they don't jump around on hydration/renders
  const nodes = Array.from({ length: ambientConfig.particles.count }).map((_, i) => {
    // Bias towards right/center (avoiding extreme left where headline is)
    const x = 30 + Math.random() * 65; 
    const y = 10 + Math.random() * 80;
    const size = ambientConfig.particles.sizeMin + Math.random() * (ambientConfig.particles.sizeMax - ambientConfig.particles.sizeMin);
    
    // Animation offsets
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 10;

    return { id: i, x, y, size, duration, delay };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      
      {/* Scattered Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-[#0F766E]"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            opacity: ambientConfig.particles.baseOpacity,
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [
                    ambientConfig.particles.baseOpacity,
                    ambientConfig.particles.maxOpacity,
                    ambientConfig.particles.baseOpacity,
                  ],
                  y: [0, -5, 0],
                }
          }
          transition={{
            duration: node.duration,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* The "Data Current" - single faint line moving across */}
      {!shouldReduceMotion && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
          <motion.path
            d="M 20% 80% Q 50% 50% 80% 20%"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )}

      {/* Signature Animation: Node Connection */}
      {!shouldReduceMotion && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]">
          {/* Static thin line connecting two specific points near the map */}
          <path d="M 60% 40% L 75% 35%" fill="none" stroke="#0F766E" strokeWidth="0.5" strokeDasharray="2 4" />
          
          {/* Animated pulse traveling along the line */}
          <motion.circle
            r="1.5"
            fill="#0F766E"
            animate={{
              cx: ["60%", "75%", "75%"],
              cy: ["40%", "35%", "35%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 12,
              times: [0, 0.2, 1],
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </svg>
      )}

    </div>
  );
}
