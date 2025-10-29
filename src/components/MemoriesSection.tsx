"use client";

import { useState } from "react";
import { Camera, Plane, Smile } from "lucide-react";
import Image from "next/image";
import { PhotoCarousel } from "./PhotoCarousel";

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

  return (
    <>
      <section id="memories" className="story-section">
        <div className="story-content">
          <h2 className="font-cursive text-5xl text-purple-500 mb-6 flex items-center justify-center gap-3">
            <Camera className="w-10 h-10" />A Look Back...
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            From hilarious moments to big milestones, it&apos;s been an amazing journey together.
          </p>

          {/* Photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {photos.map((p, i) => (
              <figure
                key={i}
                className="group relative overflow-hidden rounded-xl bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 cursor-pointer"
                onClick={() => openCarousel(i)}
              >
                <div className="relative aspect-4/5 w-full">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={i < 3}
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

          {/* Decorative icons */}
          <div className="flex justify-center gap-8 mt-8">
            <Camera className="w-12 h-12 text-blue-400 hover:scale-110 transition-transform" />
            <Plane className="w-12 h-12 text-sky-400 hover:scale-110 transition-transform" />
            <Smile className="w-12 h-12 text-amber-400 hover:scale-110 transition-transform" />
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
