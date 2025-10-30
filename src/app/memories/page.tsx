"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircularGallery } from "@/components/ui/circular-gallery";
import {
  Heart,
  Sparkles,
  Star,
  ArrowLeft,
  Camera,
  Grid3x3,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/photos/memories/image_1.jpg",
  },
  {
    id: 2,
    src: "/photos/memories/image_2.jpg",
  },
  {
    id: 3,
    src: "/photos/memories/image_3.jpg",
  },
  {
    id: 4,
    src: "/photos/memories/image_4.jpg",
  },
  {
    id: 5,
    src: "/photos/memories/image_5.jpg",
  },
  {
    id: 6,
    src: "/photos/memories/image_6.jpg",
  },
  {
    id: 7,
    src: "/photos/memories/image_7.jpg",
  },
  {
    id: 8,
    src: "/photos/memories/image_8.jpg",
  },
  {
    id: 9,
    src: "/photos/memories/image_9.jpg",
  },
];

export default function MemoriesPage() {
  const [viewMode, setViewMode] = useState<"circular" | "grid">("circular");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 overflow-hidden">
      {/* Fluid gradient blobs background */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-20 left-10 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, -25, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/15 blur-3xl"
        animate={{ scale: [0.9, 1.15, 0.95, 1.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back Home</span>
        </Link>
      </div>

      {/* View mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex gap-2 p-1 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg">
          <button
            onClick={() => setViewMode("circular")}
            className={`p-2 rounded-full transition-all ${
              viewMode === "circular"
                ? "bg-pink-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/30"
            }`}
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-full transition-all ${
              viewMode === "grid"
                ? "bg-pink-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/30"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Glass header */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-2xl mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Memories
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                A beautiful collection of precious moments and cherished
                memories
              </p>
            </div>

            {/* Glass sheen overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/5 to-transparent" />
          </motion.div>

          {/* Gallery Views */}
          <AnimatePresence mode="wait">
            {viewMode === "circular" ? (
              <motion.div
                key="circular"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <CircularGallery items={GALLERY_ITEMS} radius={300} />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {GALLERY_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="relative aspect-3/4 w-full">
                      <Image
                        src={item.src}
                        alt="memory photo"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative floating elements */}
          <div className="fixed top-40 left-20 pointer-events-none hidden lg:block">
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

          <div className="fixed bottom-40 right-20 pointer-events-none hidden lg:block">
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

          <div className="fixed top-1/2 right-32 pointer-events-none hidden lg:block">
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
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden">
                <Image
                  src={GALLERY_ITEMS[selectedImage].src}
                  alt="alt"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl transition-all"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
