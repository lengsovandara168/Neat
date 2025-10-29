"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FloatingMessageButton() {
  return (
    <Link href="/messages">
      <motion.div
        className="fixed bottom-8 right-8 z-50 sm:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 bg-pink-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Button */}
          <div className="relative bg-linear-to-r from-pink-500 to-purple-500 p-4 rounded-full shadow-2xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          
          {/* Badge */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            6
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
