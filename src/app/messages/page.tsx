"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MessageCard {
  id: number;
  title: string;
  message: string;
  author: string;
  color: string;
  icon: React.ReactNode;
  isUserGenerated?: boolean;
}

const messages: MessageCard[] = [
  {
    id: 1,
    title: "Happy Birthday, Monineath!",
    message:
      "Hey! Just wanted to say happy birthday and hope you have an amazing day! You're such a great person and I'm really glad we're friends. Thank you for always being kind and genuine. Hope this year brings you lots of happiness, good memories, and all the success you deserve. Enjoy your special day! 🎉",
    author: "From Leng Sovandara",
    color: "from-pink-300 via-purple-500 to-rose-500",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Wishing you all the joy",
    message:
      "Happiest birthday, Neath! Your smile lights up every room. Keep being your sweet, talented self. May this year be full of good grades, cozy days, and new adventures!",
    author: "From Chea Menghour",
    color: "from-fuchsia-400 via-pink-400 to-orange-400",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "To more laughs and memories",
    message:
      "Cheers to another year of inside jokes, late-night talks, and the best food runs. Proud of you always. You got this!",
    author: "From Sean",
    color: "from-indigo-400 via-sky-400 to-cyan-400",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "You deserve the best",
    message:
      "Happy birthday! Thanks for being such a caring friend. I hope every little wish on your mind finds its way to you this year.",
    author: "From Meyly",
    color: "from-violet-500 via-purple-500 to-pink-500",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 5,
    title: "Keep shining",
    message:
      "Moni, your energy is sunshine. Keep shining bright and sharing that kindness. Wishing you peace, growth, and lots of yummy cake!",
    author: "From Dalin",
    color: "from-rose-400 via-red-400 to-amber-400",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 6,
    title: "So proud of you",
    message:
      "Another year, another level up! Proud of everything you've done and excited for everything coming next. Happiest birthday!",
    author: "From Danich",
    color: "from-emerald-400 via-teal-400 to-cyan-400",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
          <span className="bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Birthday Messages
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          wish for Mok Chanmonineath
        </p>
      </motion.div>

      {/* Message Cards Grid */}
      <div className="max-w-3xl mx-auto">
        {messages.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group"
          >
            <div className="my-5 relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-gray-700/50">
              {/* Gradient border on hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl",
                  card.color
                )}
              />

              {/* Icon */}
              <div
                className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r text-white mb-6 shadow-lg",
                  card.color
                )}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                {card.title}
              </h3>

              {/* Message */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {card.message}
              </p>

              {/* Author */}
              <div
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-base font-medium text-white bg-linear-to-r",
                  card.color
                )}
              >
                {card.author}
              </div>

              {/* Decorative corner */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
