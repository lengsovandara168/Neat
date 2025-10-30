"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Seeded random for consistent particles
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface ConfettiProps {
  count?: number;
}

interface ConfettiPiece {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  size: number;
  shape: "circle" | "square" | "triangle";
  spinDirection: number;
}

const COLORS = [
  "#ff6b9d", // pink
  "#c44569", // dark pink
  "#ffa502", // orange
  "#5f27cd", // purple
  "#feca57", // yellow
  "#48dbfb", // cyan
  "#ff9ff3", // light pink
  "#54a0ff", // blue
  "#00d2d3", // teal
  "#ff6348", // red
];

export default function Confetti({ count = 50 }: ConfettiProps) {
  const confettiPieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (seededRandom(i * 123) - 0.5) * Math.PI; // -90 to 90 degrees
      const velocity = seededRandom(i * 456) * 15 + 10; // 10-25 initial velocity
      
      return {
        id: i,
        color: COLORS[Math.floor(seededRandom(i * 789) * COLORS.length)],
        x: 50, // Start from center
        y: 50,
        rotation: seededRandom(i * 321) * 360,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 20, // Strong upward bias
        size: seededRandom(i * 654) * 8 + 4, // 4-12px
        shape: ["circle", "square", "triangle"][
          Math.floor(seededRandom(i * 987) * 3)
        ] as "circle" | "square" | "triangle",
        spinDirection: seededRandom(i * 111) > 0.5 ? 1 : -1,
      };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
}

function ConfettiPiece({ piece }: { piece: ConfettiPiece }) {
  const gravity = 0.5;
  const drag = 0.99;
  const duration = 3;

  // Calculate final position with physics
  const finalY = piece.y + piece.velocityY * duration * 60 + 
    (0.5 * gravity * Math.pow(duration * 60, 2));
  const finalX = piece.x + piece.velocityX * duration * 60 * drag;

  return (
    <motion.div
      className="absolute"
      style={{
        width: piece.size,
        height: piece.size,
        backgroundColor: piece.color,
        borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "triangle" ? "0" : "0",
        clipPath: piece.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
      }}
      initial={{
        x: `${piece.x}vw`,
        y: `${piece.y}vh`,
        rotate: piece.rotation,
        opacity: 1,
        scale: 0,
      }}
      animate={{
        x: `${finalX}vw`,
        y: `${finalY}vh`,
        rotate: piece.rotation + piece.spinDirection * 720, // Spin based on seed
        opacity: [1, 1, 1, 0.8, 0],
        scale: [0, 1.2, 1, 1, 0.8],
      }}
      transition={{
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for natural fall
        times: [0, 0.1, 0.3, 0.7, 1], // Keyframe timing
      }}
    />
  );
}
