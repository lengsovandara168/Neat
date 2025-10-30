"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WebGLGalleryProps {
  images: { src: string; title: string; description: string }[];
  onImageClick?: (index: number) => void;
}

export function WebGLGallery({ images, onImageClick }: WebGLGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<number | null>(null);

  // Auto-rotate when not hovering
  useEffect(() => {
    if (!isHovering) {
      autoRotateRef.current = window.setInterval(() => {
        setRotation((prev) => prev - 0.2);
      }, 30);
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    }

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isHovering]);

  const radius = 400;
  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    if (onImageClick) onImageClick(index);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[700px] perspective-[1000px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        setRotation(x * 60);
      }}
    >
      {/* 3D Carousel Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative preserve-3d"
          style={{
            width: "200px",
            height: "300px",
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            transition: isHovering ? "none" : "transform 0.1s linear",
          }}
        >
          {images.map((image, index) => {
            const angle = (360 / images.length) * index;
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={index}
                className="absolute cursor-pointer"
                style={{
                  width: "200px",
                  height: "300px",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
                onClick={() => handleImageClick(index)}
                whileHover={{ scale: 1.05 }}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 dark:border-white/20">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Image Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center max-w-md bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-bold mb-2 bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {images[activeIndex].title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {images[activeIndex].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        <motion.button
          onClick={() => {
            const newIndex = (activeIndex - 1 + images.length) % images.length;
            setActiveIndex(newIndex);
            setRotation(rotation + (360 / images.length));
          }}
          className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          onClick={() => {
            const newIndex = (activeIndex + 1) % images.length;
            setActiveIndex(newIndex);
            setRotation(rotation - (360 / images.length));
          }}
          className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Indicator dots */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              const diff = index - activeIndex;
              setRotation(rotation - diff * (360 / images.length));
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? "bg-pink-400 w-6"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Instruction */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-sm text-gray-600 dark:text-gray-400 pointer-events-none">
        <p>Move mouse to rotate • Click images to select</p>
      </div>
    </div>
  );
}
