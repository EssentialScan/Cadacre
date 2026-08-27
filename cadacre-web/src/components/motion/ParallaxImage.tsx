"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function ParallaxImage({
  src,
  alt,
  className,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[10%] -bottom-[10%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "100vw"}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
