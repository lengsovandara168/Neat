"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedGradientText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      className={cn(
        "inline-block bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-300% animate-gradient",
        className
      )}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
};
