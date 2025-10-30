"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Photo {
  src: string;
  alt: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
  isOpen: boolean;
  initialIndex: number;
  onCloseAction: () => void;
}

export function PhotoCarousel({
  photos,
  isOpen,
  initialIndex,
  onCloseAction,
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Lock body scroll when carousel is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("carousel-open");
    } else {
      document.body.classList.remove("carousel-open");
    }
    return () => {
      document.body.classList.remove("carousel-open");
    };
  }, [isOpen]);

  // Auto-advance carousel
  useEffect(() => {
    if (!isOpen || !isAutoPlaying || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 3500); // Change slide every 3.5 seconds

    return () => clearInterval(timer);
  }, [isOpen, isAutoPlaying, photos.length]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setIsAutoPlaying(false); // Pause autoplay when user interacts
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false); // Pause autoplay when user interacts
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onCloseAction();
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onCloseAction}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-label="Photo carousel"
    >
      {/* Close button */}
      <button
        onClick={onCloseAction}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition"
        aria-label="Close carousel"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition touch-manipulation"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Photo */}
      <div
        className="relative w-full h-full max-w-5xl mx-auto px-12 sm:px-20 py-20 sm:py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-h-[70vh] sm:max-h-[80vh]">
          <Image
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Photo counter */}
        <div className="absolute top-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/50 text-white text-xs sm:text-sm font-medium">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition touch-manipulation"
        aria-label="Next photo"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Thumbnails */}
      <div className="absolute bottom-4 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2 scrollbar-hide">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition touch-manipulation ${
              index === currentIndex
                ? "border-pink-400 scale-110"
                : "border-white/30 active:border-white/60"
            }`}
            aria-label={`Go to photo ${index + 1}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
