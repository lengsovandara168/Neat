"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Star, Zap } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { FutureSection } from "@/components/FutureSection";
import dynamic from "next/dynamic";

// Lazy load heavy client-only components to reduce initial bundle
const BlobCursor = dynamic(
  () => import("@/components/ui/blob-cursor").then((m) => m.BlobCursor),
  { ssr: false }
);
const Carousel = dynamic(() => import("@/components/ui/carousel"), {
  ssr: false,
});

import {
  useConfetti,
  useScrollAnimations,
  useThemeToggle,
} from "@/hooks/useBirthdayEffects";

// Easy to customize - just change these values!
const BIRTHDAY_PERSON = {
  name: "Mok Chanmonineath",
  photo: "/photos/image_profile.jpg",
  message:
    "Wishing you a day filled with love, laughter, and all your favorite things, Monineath. May your year ahead be as wonderful as you are!",
};

// Carousel slides data
const CAROUSEL_SLIDES = [
  {
    title: "Mountain Serenity",
    button: "Explore",
    src: "/photos/hero/image_1.jpg",
  },
  {
    title: "Urban Elegance",
    button: "Discover",
    src: "/photos/hero/image_2.jpg",
  },
  {
    title: "Natural Beauty",
    button: "View More",
    src: "/photos/hero/image_3.jpg",
  },
  {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/hero/image_4.jpg",
  },
  {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/hero/image_5.jpg",
  },
  {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/hero/image_6.jpg",
  },
];

export default function Page() {
  useConfetti();
  useScrollAnimations();
  useThemeToggle();

  // Floating icons data
  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: "10%", y: "20%" },
    { Icon: Heart, delay: 0.5, x: "85%", y: "15%" },
    { Icon: Star, delay: 1, x: "15%", y: "70%" },
    { Icon: Zap, delay: 1.5, x: "90%", y: "60%" },
    { Icon: Sparkles, delay: 2, x: "50%", y: "85%" },
    { Icon: Heart, delay: 2.5, x: "25%", y: "45%" },
  ];

  return (
    <div className="relative min-h-screen text-gray-800 dark:text-gray-100 overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="fixed z-0 pointer-events-none"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon className="w-8 h-8 text-pink-400 dark:text-pink-500" />
        </motion.div>
      ))}

      <BlobCursor />

      <div
        id="confetti-container"
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20"
      />

      {/* Enhanced Hero Section with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <HeroSection
          name={BIRTHDAY_PERSON.name}
          photoSrc={BIRTHDAY_PERSON.photo}
          message={BIRTHDAY_PERSON.message}
        />
      </motion.div>

      {/* Carousel with slide-in animation */}
      <motion.div
        className="relative overflow-hidden w-full h-full py-20"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Carousel slides={CAROUSEL_SLIDES} />
      </motion.div>

      {/* Future Section with fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <FutureSection />
      </motion.div>
    </div>
  );
}
