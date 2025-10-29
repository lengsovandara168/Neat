"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-end gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 shadow-xl",
        className
      )}
    >
      {items.map((item) => (
        <FloatingDockIcon key={item.title} {...item} />
      ))}
    </div>
  );
};

const FloatingDockIcon = ({
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useMotionValue(0);
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ width }}
      className="aspect-square rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-white">{icon}</div>
    </motion.a>
  );
};
