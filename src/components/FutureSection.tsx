"use client";

import { Star, MessageCircle, Cake } from "lucide-react";
import Link from "next/link";
import { AnimatedGradientText } from "./ui/animated-gradient-text";
import { TextReveal } from "./ui/text-reveal";
import { ShimmerButton } from "./ui/shimmer-button";

export function FutureSection() {
  return (
    <section id="future" className="story-section">
      <div className="story-content">
        <h2 className="font-cursive text-5xl mb-6 flex items-center justify-center gap-3">
          <Star className="w-10 h-10 text-teal-500" />
          <AnimatedGradientText className="text-3xl font-cursive text-center">
            To the Future!
          </AnimatedGradientText>
        </h2>

        <TextReveal
          text="May the next chapter be your best one yet, filled with new adventures, dreams come true, and endless happiness."
          className="text-lg text-gray-600 mb-4 justify-center"
        />

        <p className="text-lg text-gray-600 mb-6">
          The world is brighter with you in it. Cheers to another incredible
          year!
        </p>

        <div className="flex flex-col sm:flex-row place-items-center gap-4 mb-8 ">
          <Link href="/cake">
            <ShimmerButton
              shimmerColor="#ec4899"
              background="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
              className="font-semibold "
            >
              <Cake className="w-5 h-5 mr-2" />
              Blow the Candles 🎂
            </ShimmerButton>
          </Link>

          <Link href="/messages">
            <ShimmerButton
              shimmerColor="#14b8a6"
              background="linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)"
              className="font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Read Birthday Messages
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
