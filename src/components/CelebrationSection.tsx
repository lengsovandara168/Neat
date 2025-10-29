"use client";

import { Gift, Wine, Cake, Music } from "lucide-react";
import { TextReveal } from "./ui/text-reveal";
import { ShimmerButton } from "./ui/shimmer-button";

export function CelebrationSection() {
  return (
    <section id="celebration" className="story-section">
      <div className="story-content">
        <h2 className="font-cursive text-5xl text-green-500 mb-6 flex items-center justify-center gap-3">
          <Gift className="w-10 h-10" />
          The Celebration!
        </h2>

        <TextReveal
          text="Today is all about YOU! Your kindness, your laugh, your amazing spirit."
          className="text-lg text-gray-600 mb-4 justify-center"
        />

        <p className="text-lg text-gray-600 mb-6">
          We&apos;re raising a glass (or a piece of cake!) to the wonderful
          person you are. Let the celebrations begin!
        </p>

        <div className="flex justify-center mb-6">
          <ShimmerButton
            shimmerColor="#10b981"
            background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          >
            <Gift className="w-5 h-5 mr-2" />
            Celebrate Now!
          </ShimmerButton>
        </div>

        <div className="flex justify-center gap-8 mt-8">
          <Wine className="w-12 h-12 text-rose-400 hover:scale-110 transition-transform" />
          <Cake className="w-12 h-12 text-pink-400 hover:scale-110 transition-transform" />
          <Music className="w-12 h-12 text-purple-400 hover:scale-110 transition-transform" />
        </div>
      </div>
    </section>
  );
}
