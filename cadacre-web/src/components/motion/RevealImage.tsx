"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function RevealImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "50vw"}
        className="object-cover"
      />
    </motion.div>
  );
}
