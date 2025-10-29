"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingBorder({
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      width="100%"
      height="100%"
      {...otherProps}
    >
      <rect
        fill="none"
        width="100%"
        height="100%"
        rx={rx}
        ry={ry}
        strokeWidth="2"
        className="stroke-pink-400/50"
      />
      <motion.rect
        fill="none"
        width="100%"
        height="100%"
        rx={rx}
        ry={ry}
        strokeWidth="4"
        className="stroke-pink-400"
        strokeDasharray="200 800"
        animate={{
          strokeDashoffset: [0, -1000],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}

export function Button({
  borderRadius = "1rem",
  children,
  as: Component = "button",
  containerClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "relative text-base h-12 w-full p-px overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%" />
      </div>

      <div
        className={cn(
          "relative bg-slate-900/90 border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}
