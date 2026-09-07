export const ambientConfig = {
  // Gradients
  gradientBlobs: [
    {
      id: 1,
      x: "25%",
      y: "35%",
      color: "rgba(15,118,110,0.08)", // Increased from 0.055
      size: "42%",
      animation: { x: [0, 20, 0], y: [0, 15, 0], duration: 25 },
    },
    {
      id: 2,
      x: "80%",
      y: "30%",
      color: "rgba(53,106,230,0.05)", // Increased from 0.025
      size: "45%",
      animation: { x: [0, -25, 0], y: [0, -10, 0], duration: 28 },
    },
  ],
  
  // Particles
  particles: {
    count: 20,
    baseOpacity: 0.1, // Increased from 0.05
    maxOpacity: 0.25, // Increased from 0.15
    sizeMin: 1.5,
    sizeMax: 3.5,
  },

  // Parallax multipliers (multiplied by scrollY)
  parallax: {
    grid: 0.02,
    contours: 0.01,
    glow: 0.015,
  }
};
