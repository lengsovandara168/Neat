"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Seeded random generator for consistent results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const SparklesCore = (props: {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  className?: string;
}) => {
  const {
    className,
    background = "transparent",
    minSize = 1,
    maxSize = 3,
    speed = 1,
    particleColor = "#FFF",
    particleDensity = 100,
  } = props;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const particles = React.useMemo(() => {
    const particleArray = [];
    for (let i = 0; i < particleDensity; i++) {
      particleArray.push({
        id: i,
        x: seededRandom(i * 123) * 100,
        y: seededRandom(i * 456) * 100,
        size: seededRandom(i * 789) * (maxSize - minSize) + minSize,
        duration: seededRandom(i * 321) * (5 - 2) + 2,
        delay: seededRandom(i * 654) * 5,
      });
    }
    return particleArray;
  }, [particleDensity, maxSize, minSize]);

  if (!isMounted) {
    return null;
  }

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background }}
    >
      {particles.map((particle) => (
        <motion.circle
          key={particle.id}
          cx={`${particle.x}%`}
          cy={`${particle.y}%`}
          r={particle.size}
          fill={particleColor}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration / speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
};
