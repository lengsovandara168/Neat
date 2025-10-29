import { Heart } from "lucide-react";

export function BirthdayFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4">
        <p className="flex items-center justify-center gap-2">
          Made with{" "}
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 inline" /> and
          Wishing you the happiest birthday.
        </p>
        <p className="mt-2">© {currentYear}</p>
      </div>
    </footer>
  );
}
