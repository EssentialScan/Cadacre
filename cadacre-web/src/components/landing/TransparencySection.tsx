"use client";

import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { useState } from "react";
import { Search, Database, Fingerprint, Lock } from "lucide-react";
import { AmbientSection } from "@/components/ambient/AmbientSection";

export function TransparencySection() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Very subtle parallax for the document stack
  const stackY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Measure actual node/dot positions so the connector lines always land on the dots,
  // regardless of container width or breakpoint padding.
  const visualRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ a: string; b: string } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const container = visualRef.current;
      const n1 = node1Ref.current;
      const n2 = node2Ref.current;
      const n3 = node3Ref.current;
      if (!container || !n1 || !n2 || !n3) return;

      const cRect = container.getBoundingClientRect();
      const rel = (el: HTMLDivElement, side: "left" | "right") => {
        const r = el.getBoundingClientRect();
        return {
          x: (side === "left" ? r.left : r.right) - cRect.left,
          y: r.top + r.height / 2 - cRect.top,
        };
      };

      const p1 = rel(n1, "right");
      const p2l = rel(n2, "left");
      const p2r = rel(n2, "right");
      const p3 = rel(n3, "left");

      setPaths({
        a: `M ${p1.x} ${p1.y} C ${p1.x + 60} ${p1.y}, ${p2l.x - 60} ${p2l.y}, ${p2l.x} ${p2l.y}`,
        b: `M ${p2r.x} ${p2r.y} C ${p2r.x + 60} ${p2r.y}, ${p3.x - 60} ${p3.y}, ${p3.x} ${p3.y}`,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-transparent relative overflow-hidden border-b border-border">
      <AmbientSection theme="transparency" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        
        {/* Top: Massive Numeric Statement */}
        <div className="mb-24 text-center lg:text-left">
          <SlideIn direction="up">
            <div className="font-mono-figure font-bold tracking-tighter text-brand-blue leading-none" style={{ fontSize: "clamp(5rem, 12vw, 140px)" }}>
              65+
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-4">
              REITs mapped to the source.
            </h2>
          </SlideIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          
          <div className="flex flex-col items-start text-left order-2 lg:order-1 relative z-10 lg:pr-12">
            <SlideIn direction="up">
              <h3 className="font-display text-3xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Every number<br />has a story.
              </h3>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.1}>
              <p className="text-[18px] text-muted-foreground mb-10 leading-relaxed font-medium">
                REITCompare provides a transparent source trail for every material metric. We don't hide our methodology or expect you to trust black-box calculations.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.2}>
              <button className="text-[16px] font-semibold text-brand-blue hover:text-[#0B5F59] transition-colors flex items-center group">
                View our methodology
                <span className="ml-3 group-hover:translate-x-1.5 transition-transform">&rarr;</span>
              </button>
            </SlideIn>
          </div>

          <div className="relative w-full order-1 lg:order-2">
            <ScaleReveal delay={0.2} className="w-full">
              
              {/* Connected Data Visual */}
              <div
                ref={visualRef}
                className="relative bg-[#F7F8FA] border border-[#E5E7EB] rounded-[24px] p-8 lg:p-12 shadow-[0_24px_48px_rgba(23,32,42,0.06)] h-[500px] flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >

                {/* SVG Animated Connectors (measured from real node positions) */}
                {paths && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <motion.path
                      d={paths.a}
                      fill="transparent"
                      stroke="rgba(15,118,110,0.3)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isHovered ? 1 : 0.3 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <motion.path
                      d={paths.b}
                      fill="transparent"
                      stroke="rgba(15,118,110,0.3)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isHovered ? 1 : 0.2 }}
                      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
                    />
                  </svg>
                )}

                <div className="relative z-10 w-full max-w-sm space-y-12">

                  {/* Node 1: Metric */}
                  <motion.div
                    ref={node1Ref}
                    className="bg-white border border-border shadow-lg rounded-xl p-5 ml-0 mr-auto w-64 relative"
                    animate={{ y: isHovered ? -5 : 0 }}
                  >
                    <div className="absolute top-1/2 -right-3 w-3 h-3 bg-brand-blue rounded-full border-2 border-white shadow-sm" />
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Metric</span>
                    <h4 className="font-display font-bold text-2xl text-foreground mb-1">Gearing</h4>
                    <div className="font-mono-figure font-bold text-3xl text-brand-blue tracking-tight">28.7%</div>
                  </motion.div>

                  {/* Node 2: Source */}
                  <motion.div
                    ref={node2Ref}
                    className="bg-white border border-border shadow-lg rounded-xl p-5 mx-auto w-64 relative"
                    animate={{ y: isHovered ? -5 : 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="absolute top-1/2 -left-3 w-3 h-3 bg-brand-blue rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute top-1/2 -right-3 w-3 h-3 bg-brand-blue rounded-full border-2 border-white shadow-sm" />
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Source</span>
                    <p className="text-[14px] font-semibold text-foreground leading-snug">FY24 Half Year Report</p>
                    <p className="text-[12px] text-muted-foreground mt-1">Page 18, Note 4(a)</p>
                  </motion.div>

                  {/* Node 3: Methodology */}
                  <motion.div
                    ref={node3Ref}
                    className="bg-white border border-border shadow-lg rounded-xl p-5 ml-auto mr-0 w-64 relative"
                    animate={{ y: isHovered ? -5 : 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="absolute top-1/2 -left-3 w-3 h-3 bg-brand-blue rounded-full border-2 border-white shadow-sm" />
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Methodology</span>
                    <p className="text-[13px] text-foreground font-medium leading-relaxed">
                      Total Debt divided by Total Tangible Assets, excluding derivative valuations.
                    </p>
                  </motion.div>

                </div>
              </div>

            </ScaleReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
