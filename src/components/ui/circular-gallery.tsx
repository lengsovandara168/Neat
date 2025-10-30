"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
}

interface CircularGalleryProps {
  items: GalleryItem[];
  radius?: number;
}

export function CircularGallery({ items, radius = 280 }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Avoid SSR hydration mismatches by rendering only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const angleStep = 360 / items.length;

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    setRotation((prev) => prev + angleStep);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
    setRotation((prev) => prev - angleStep);
  };

  const handleItemClick = (index: number) => {
    const diff = index - activeIndex;
    setActiveIndex(index);
    setRotation((prev) => prev - diff * angleStep);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Helper to make transforms deterministic across environments
  const round = (n: number, precision = 0) => {
    const p = Math.pow(10, precision);
    return Math.round(n * p) / p;
  };

  if (!isClient) {
    // Reserve layout space to prevent layout shift during hydration
    return (
      <div className="relative w-full h-[700px] flex items-center justify-center">
        <div className="relative w-full max-w-[600px] h-[600px]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center">
      {/* Circular gallery container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] h-[600px]"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {items.map((item, index) => {
            const angle = (index * angleStep * Math.PI) / 180;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            const isActive = index === activeIndex;
            const xRounded = round(x) - 75;
            const yRounded = round(y) - 75;

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer"
                style={{
                  left: "50%",
                  top: "50%",
                  x: xRounded,
                  y: yRounded,
                }}
                onClick={() => handleItemClick(index)}
                whileHover={{ scale: isActive ? 1 : 1.1 }}
                animate={{
                  scale: isActive ? 1.3 : 0.85,
                  zIndex: isActive ? 10 : 1,
                  opacity: isActive ? 1 : 0.6,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div
                  className="relative w-[150px] h-[150px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
                  animate={{ rotate: -rotation }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                >
                  <Image
                    src={item.src}
                    alt="alt"
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center active item details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <motion.button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? "bg-pink-400 w-6"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
