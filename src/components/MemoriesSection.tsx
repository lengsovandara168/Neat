"use client";

import { useState } from "react";
import { Camera, Heart, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { PhotoCarousel } from "./PhotoCarousel";
import { CircularGallery } from "@/components/ui/circular-gallery";
import { motion } from "framer-motion";

interface Photo {
  src: string;
  alt: string;
}

interface MemoriesSectionProps {
  photos: Photo[];
}

export function MemoriesSection({ photos }: MemoriesSectionProps) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const openCarousel = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  // Convert photos to gallery items
  const galleryItems = photos.slice(0, 6).map((photo, index) => ({
    id: index + 1,
    src: photo.src,
    title: photo.alt || `Memory ${index + 1}`,
    description: `Cherished moment #${index + 1}`,
  }));

  return (
    <>
      <section
        id="memories"
        className="relative min-h-screen py-20 overflow-hidden"
      >
        {/* Fluid gradient blobs background */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-20 left-10 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, 20, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"
          animate={{ x: [0, -40, 20, 0], y: [0, -25, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/15 blur-3xl"
          animate={{ scale: [0.9, 1.15, 0.95, 1.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glass header */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-2xl mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated gradient behind glass */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-pink-500/30 blur-2xl"
              animate={{ x: [0, 15, -10, 0], y: [0, 10, -15, 0] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-purple-500/25 blur-2xl"
              animate={{ x: [0, -12, 8, 0], y: [0, -10, 12, 0] }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 px-8 py-12 text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
                <Sparkles className="w-6 h-6 text-purple-400" />
                <Star className="w-7 h-7 text-cyan-400" fill="currentColor" />
              </motion.div>

              <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Precious Memories
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Every moment is a beautiful chapter in the story of your life
              </p>
            </div>

            {/* Glass sheen overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/5 to-transparent" />
          </motion.div>

          {/* Circular Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CircularGallery items={galleryItems} radius={280} />
          </motion.div>

          {/* Traditional photo grid below */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                More Memories
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click to view fullscreen
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {photos.slice(6).map((p, i) => (
                <figure
                  key={i}
                  className="group relative overflow-hidden rounded-xl bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 cursor-pointer"
                  onClick={() => openCarousel(i + 6)}
                >
                  <div className="relative aspect-4/5 w-full">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <figcaption className="sr-only">{p.alt}</figcaption>
                </figure>
              ))}
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <div className="absolute top-40 left-20 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart
                className="w-12 h-12 text-pink-400/30"
                fill="currentColor"
              />
            </motion.div>
          </div>

          <div className="absolute bottom-40 right-20 pointer-events-none">
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -15, 15, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Star
                className="w-10 h-10 text-cyan-400/30"
                fill="currentColor"
              />
            </motion.div>
          </div>

          <div className="absolute top-1/2 right-32 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-8 h-8 text-purple-400/30" />
            </motion.div>
          </div>
        </div>
      </section>

      <PhotoCarousel
        photos={photos}
        isOpen={isCarouselOpen}
        initialIndex={selectedPhotoIndex}
        onCloseAction={closeCarousel}
      />
    </>
  );
}
