"use client";

import { Heart, Sparkles as SparklesIcon, Camera } from "lucide-react";
import Image from "next/image";
import { Spotlight } from "./ui/spotlight";
import { SparklesCore } from "./ui/sparkles";
import { Button as MovingBorderButton } from "./ui/moving-border";

interface HeroSectionProps {
  name: string;
  photoSrc: string;
  message: string;
}

export function HeroSection({ name, photoSrc, message }: HeroSectionProps) {
  return (
    <section id="home" className="story-section relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="pink" />

      {/* Sparkles background */}
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#ff69b4"
        />
      </div>

      <div className="story-content relative z-10">
        <h1 className="font-cursive text-4xl sm:text-5xl md:text-7xl font-bold text-pink-500 mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap leading-tight">
          {/* <SparklesIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-500 animate-pulse shrink-0" /> */}
          <span className="text-center">Happy Birthday, {name}!</span>
          {/* <SparklesIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-400 animate-pulse shrink-0" /> */}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-6 flex items-center justify-center gap-2 flex-wrap">
          To an Amazing Person
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 fill-pink-500 animate-pulse" />
        </p>

        {/* Profile photo */}
        <div className="mx-auto mb-8 flex items-center justify-center">
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full ring-4 ring-pink-300/50 shadow-lg">
            <Image
              src={photoSrc}
              alt={`Portrait of ${name}`}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Message card */}
        <div className="my-6 sm:my-8">
          <div className="bg-linear-to-r from-purple-400 to-pink-400 p-4 sm:p-6 rounded-lg shadow-lg text-white">
            <p className="text-white text-base sm:text-lg font-semibold">
              &ldquo;{message}&rdquo;
            </p>
          </div>
        </div>

        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          We&apos;re so glad to celebrate this special day with you. Here&apos;s
          to another fantastic year of adventures and amazing memories!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
          <a
            href="/memories"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition w-full sm:w-auto touch-manipulation"
          >
            <Camera className="w-5 h-5" />
            See memories
          </a>
        </div>
      </div>
    </section>
  );
}
