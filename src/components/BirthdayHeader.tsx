"use client";
import { Cake, Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export function BirthdayHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const toggleTheme = () => {
    try {
      const root = document.documentElement;
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // no-op
    }
  };
  return (
    <header className="sticky top-0 z-30 overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/15">
      {/* Fluid gradient blobs behind the glass header */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-12 -left-16 w-40 h-40 rounded-full bg-pink-500/30 blur-2xl"
        animate={{ x: [0, 12, -6, 0], y: [0, 6, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-1/3 w-48 h-48 rounded-full bg-purple-500/25 blur-2xl"
        animate={{ x: [0, -10, 8, 0], y: [0, -8, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-cyan-400/20 blur-2xl"
        animate={{ scale: [0.95, 1.05, 0.98, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Cake className="w-6 h-6  text-pink-500" />
              <span className="font-cursive text-2xl text-pink-600">
                Happy Birthday
              </span>
            </div>
          </Link>

          <nav className=" hidden sm:flex  gap-30 text-sm font-semibold items-center-safe">
            <Link
              href="/home"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/memories"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors"
            >
              Memories
            </Link>

            <Link
              href="/messages"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 w-10 h-10 justify-center rounded-md border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition"
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>

            {/* Mobile menu button */}
            <button
              aria-label="Open Menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        <motion.div
          id="mobile-nav"
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          className="sm:hidden overflow-hidden"
        >
          <div className="mt-2 mb-4 rounded-2xl border border-white/20 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg">
            <nav className="flex flex-col p-3 text-sm font-semibold">
              <Link
                href="/home"
                onClick={close}
                className="px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-white/70 dark:hover:bg-white/20 transition"
              >
                Home
              </Link>
              <Link
                href="/memories"
                onClick={close}
                className="px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-white/70 dark:hover:bg-white/20 transition"
              >
                Memories
              </Link>
              <Link
                href="/messages"
                onClick={close}
                className="px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-white/70 dark:hover:bg-white/20 transition inline-flex items-center gap-2"
              >
                Messages
              </Link>
            </nav>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
