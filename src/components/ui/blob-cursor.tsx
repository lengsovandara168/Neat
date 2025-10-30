"use client";

import { useEffect, useRef } from "react";

// Use a requestAnimationFrame loop and transforms (GPU) to reduce layout thrash
export const BlobCursor = () => {
  const blobRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    let running = true;

    const update = () => {
      if (!running) return;
      const { x, y } = target.current;
      // use translate3d to avoid layout and ensure GPU compositing
      blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafRef.current = requestAnimationFrame(update);
    };

    const handlePointerMove = (e: PointerEvent) => {
      // only track mouse pointers (skip touch) to save CPU on mobile
      if (e.pointerType && e.pointerType !== "mouse") return;
      // center the blob on cursor while using translate to avoid layout
      target.current.x = e.clientX - blob.offsetWidth / 2;
      target.current.y = e.clientY - blob.offsetHeight / 2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    rafRef.current = requestAnimationFrame(update);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      aria-hidden
      className="fixed -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-400 opacity-30 blur-3xl pointer-events-none"
      style={{ left: "50%", top: "50%", transform: "translate3d(-50%, -50%, 0)" }}
    />
  );
};
