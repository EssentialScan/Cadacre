"use client";

import { useEffect, useRef, useState } from "react";
import { AmbientTheme, themes } from "./ambient.config";
import { AmbientField } from "./AmbientField";
import { AmbientGrid } from "./AmbientGrid";
import { AmbientContours } from "./AmbientContours";
import { useInView } from "framer-motion";

interface AmbientSectionProps {
  theme: AmbientTheme;
}

export function AmbientSection({ theme }: AmbientSectionProps) {
  const config = themes[theme];
  const ref = useRef<HTMLDivElement>(null);
  
  // Pause rendering complex elements when entirely out of view to save CPU.
  // We use a wide margin so it starts rendering before scrolling into view.
  const isInView = useInView(ref, { margin: "200px" });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle mouse parallax for desktop
  useEffect(() => {
    if (!isInView) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Very subtle movement: max 3-6px
      const x = (e.clientX / window.innerWidth - 0.5) * 8; 
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInView]);

  return (
    <div 
      ref={ref} 
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        transition: "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)"
      }}
    >
      {isInView && (
        <>
          {config.fields.map((field, i) => (
            <AmbientField key={i} config={field} />
          ))}
          {config.showGrid && <AmbientGrid />}
          {config.showContours && <AmbientContours />}
        </>
      )}
    </div>
  );
}
