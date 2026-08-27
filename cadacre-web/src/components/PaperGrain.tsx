export function PaperGrain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.035] mix-blend-multiply"
    >
      <filter id="cadacre-paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cadacre-paper-grain)" />
    </svg>
  );
}
