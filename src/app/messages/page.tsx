"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";

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
    title: "🎉 Happy Birthday, Monineath! 🎂",
    message:
      "Just  wish you the happiest birthday and the most amazing day. You’re such a genuine, kind, and inspiring person, and I’m really grateful to call you my friend. As a little gift, I built this website just for you to celebrate you and hopefully bring a smile to your face. May this year bring you so much happiness, beautiful memories, and all the success you deserve. Enjoy your special day! ",
    author: "From Leng Sovandara",
    color: "from-fuchsia-500 via-pink-500 to-rose-500",
    icon: (
      <Star className="w-7 h-7 text-white-300 drop-shadow-[0_0_6px_rgba(255,255,0,0.6)] animate-pulse" />
    ),
  },

  {
    id: 2,
    title: "",
    message: "Happy Birthday",
    author: "From Chea Menghour",
    color: "from-fuchsia-400 via-pink-400 to-orange-400",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "To more laughs and memories",
    message:
      "Happy Birthday, Neath!! Welcome to the 20 gang. I wish you happiness, health, and wealth. I just want to say how amazing you are as a friend and how thankful I am to have you by my side. You are the most cheerful person ever; I just want to say that no matter where you go and what you do, just be the fullest version of yourself. Go on with your dream; do your best. I believe you will accomplish it. Love you <3 Hugs & Kisses ",
    author: "From Nida💋",
    color: "from-indigo-400 via-sky-400 to-cyan-400",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "To more laughs and memories",
    message:
      "Happiest birthday to you Neath!!!❤️😚🎂 I wish you all the best and that you achieve everything you want in life. I hope you’ll find someone who’ll love and cherish you for you. May the upcoming years treat you warmly and beautifully",
    author: "From Dalin❤️",
    color: "from-indigo-400 via-sky-400 to-cyan-400",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "To more laughs and memories",
    message:
      "Wish for neath: From the bottom of my heart, thank you Neath for being born into this world, thank you for being such a lovely person who always makes me laugh, I hope you will forever have this cute side of you. Hope you know that you’ll always be kmeng toch in my eyes always (in a good way ofc) I love you 🫶🏻",
    author: "From MeyLy",
    color: "from-indigo-400 via-sky-400 to-cyan-400",
    icon: <Heart className="w-6 h-6" />,
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
        <p className="text-2xl text-pink-600 font-bold dark:text-pink-300">
          for Mok Chanmonineath
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
