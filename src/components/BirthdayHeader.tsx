import { Cake, Sun, Moon, MessageCircle } from "lucide-react";
import Link from "next/link";

export function BirthdayHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-white/40 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Cake className="w-6 h-6 text-pink-400" />
            <span className="font-cursive text-2xl text-pink-400">
              Happy Day
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
            <a
              href="#home"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#memories"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors"
            >
              Memories
            </a>
            <a
              href="#future"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors"
            >
              Future
            </a>
            <Link
              href="/messages"
              className="text-gray-700 dark:text-gray-200 hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="theme-toggle"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/50 dark:border-white/20 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 transition"
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
