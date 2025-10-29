"use client";

import { useEffect, useRef } from "react";

export const BlobCursor = () => {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      blob.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 4000, fill: "forwards" }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      className="fixed -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-400 opacity-30 blur-3xl pointer-events-none"
      style={{ left: "50%", top: "50%" }}
    />
  );
};
