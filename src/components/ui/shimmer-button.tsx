"use client";

import { cn } from "@/lib/utils";

export const ShimmerButton = ({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  borderRadius = "0.5rem",
  shimmerDuration = "2s",
  background = "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  [key: string]: unknown;
}) => {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          background,
        } as React.CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white [background-clip:padding-box,border-box,border-box] bg-origin-border [border:calc(var(--cut)*1)_solid_transparent]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className
      )}
      {...props}
    >
      {/* shimmer */}
      <div
        className={cn(
          "absolute inset-0 overflow-visible @container-[size]",
          "before:absolute before:inset-0 before:h-[100cqh] before:animate-shimmer before:aspect-[1] before:rounded-none before:[mask:linear-gradient(white,transparent_50%)] before:content-['']",
          "before:bg-[conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] before:[translate:0_0]"
        )}
      />
      {children}
      {/* Highlight */}
      <div
        className={cn(
          "absolute inset-px rounded-[calc(var(--radius)-1px)] bg-linear-to-b from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        )}
      />
    </button>
  );
};
