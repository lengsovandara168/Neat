"use client";

import { BirthdayHeader } from "@/components/BirthdayHeader";
import { HeroSection } from "@/components/HeroSection";
import { FutureSection } from "@/components/FutureSection";
import { BirthdayFooter } from "@/components/BirthdayFooter";
import { BlobCursor } from "@/components/ui/blob-cursor";
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import { TextReveal } from "@/components/ui/text-reveal";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { motion } from "framer-motion";
import { Cake, Heart, Star, Gift, Music, Camera } from "lucide-react";
import Image from "next/image";

import Carousel from "@/components/ui/carousel";

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
    src: "/photos/image_1.jpg",
  },
  {
    title: "Urban Elegance",
    button: "Discover",
    src: "/photos/image_2.jpg",
  },
  {
    title: "Natural Beauty",
    button: "View More",
    src: "/photos/image_3.jpg",
  },
  {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/image_4.jpg",
  },
    {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/image_5.jpg",
  },
    {
    title: "Dreamy Landscapes",
    button: "Explore",
    src: "/photos/image_6.jpg",
  },
];

export default function Page() {
  useConfetti();
  useScrollAnimations();
  useThemeToggle();

  return (
    <div className="relative min-h-screen text-gray-800 dark:text-gray-100">
      {/* Blob cursor effect */}
      <BlobCursor />

      <BirthdayHeader />

      <div
        id="confetti-container"
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20"
      />

      <HeroSection
        name={BIRTHDAY_PERSON.name}
        photoSrc={BIRTHDAY_PERSON.photo}
        message={BIRTHDAY_PERSON.message}
      />

      {/* Carousel */}
      <div className="relative overflow-hidden w-full h-full py-20">
        <Carousel slides={CAROUSEL_SLIDES} />
      </div>

      <FutureSection />

      <BirthdayFooter />
    </div>
  );
}
