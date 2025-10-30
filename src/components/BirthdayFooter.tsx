import { Heart } from "lucide-react";

export function BirthdayFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-5 text-center text-sm text-white dark:text-white-400">
      <div className="max-w-7xl mx-auto px-4">
        <p className="flex items-center justify-center gap-2">
          Made with{" "}
          <Heart className="w-4 h-4 text-white fill-pink-500 inline" /> and
          Wishing you the happiest birthday.
        </p>
        <p className="mt-2">© {currentYear}</p>
        <p className="mt-1 text-xs opacity-80">
          Created by
          {" "}
          <a
            href="https://www.instagram.com/leng_sovandara/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:opacity-100"
          >
            lengsovandara
          </a>
        </p>
      </div>
    </footer>
  );
}
