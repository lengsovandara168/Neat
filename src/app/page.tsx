"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Component, MousePointer } from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950 flex items-center justify-center px-6 py-20 text-center">
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/40 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <Component className="w-4 h-4 text-pink-500" />
            Welcome to Moni Neath&#39;s Birthday <br />
            31 oct {currentYear}
            <Component className="w-4 h-4 text-pink-500" />
          </div>

          <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            A little surprise just for you
          </h1>

          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Step inside to see messages, memories, and a special celebration.
          </p>

          {/* Cinematic hero image */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full aspect-21/9 sm:aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              <Image
                src="/photos/hero/image_1.jpg"
                alt="A dreamy cinematic scene to set the mood"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                className="object-cover"
                priority={false}
                quality={90}
              />
              {/* Cinematic overlays */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
              {/* Subtle vignette */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 dark:ring-white/10 rounded-2xl" />
            </div>
          </motion.div>

          <motion.div
            className="mt-10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Enter the Birthday Page
              <MousePointer className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
