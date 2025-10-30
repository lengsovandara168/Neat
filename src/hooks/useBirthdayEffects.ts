"use client";

import { useEffect } from "react";

export function useConfetti() {
  useEffect(() => {
    const confettiContainer = document.getElementById("confetti-container");
    if (!confettiContainer) return;

    const confettiCount = 100;
    const colors = [
      "#ff4e4e",
      "#4effa1",
      "#4ebfff",
      "#fffa4e",
      "#ff4efd",
      "#a14eff",
    ];

    // Initial confetti stream
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      const duration = Math.random() * 3 + 4;
      const delay = Math.random() * 5;
      confetti.style.animationDuration = duration + "s";
      confetti.style.animationDelay = delay + "s";
      const size = Math.random() * 5 + 5;
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.opacity = String(Math.random() * 0.5 + 0.5);
      confettiContainer.appendChild(confetti);
    }

    // Confetti burst function
    const confettiBurst = (
      count = 60,
      x = window.innerWidth / 2,
      spread = 160
    ) => {
      for (let i = 0; i < count; i++) {
        const c = document.createElement("div");
        c.classList.add("confetti");
        c.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        const offset = (Math.random() - 0.5) * spread;
        c.style.left = x + offset + "px";
        c.style.top = "0px";
        const duration = Math.random() * 2 + 2.5;
        c.style.animationDuration = duration + "s";
        const size = Math.random() * 6 + 6;
        c.style.width = size + "px";
        c.style.height = size + "px";
        c.style.opacity = String(Math.random() * 0.5 + 0.5);
        confettiContainer.appendChild(c);
      }
    };

    // Confetti burst button handler
    const burstBtn = document.getElementById("confetti-burst");
    const handleBurst = (e: Event) => {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      confettiBurst(80, x, 220);
    };
    burstBtn?.addEventListener("click", handleBurst);

    return () => {
      burstBtn?.removeEventListener("click", handleBurst);
    };
  }, []);
}

export function useScrollAnimations() {
  useEffect(() => {
    const storySections =
      document.querySelectorAll<HTMLElement>(".story-content");
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.2 };
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
        }
      });
    };
    const scrollObserver = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    storySections.forEach((section) => scrollObserver.observe(section));

    return () => {
      storySections.forEach((section) => scrollObserver.unobserve(section));
    };
  }, []);
}

export function useThemeToggle() {
  useEffect(() => {
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const storedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    }

    const handleToggle = () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    themeToggle?.addEventListener("click", handleToggle);

    return () => {
      themeToggle?.removeEventListener("click", handleToggle);
    };
  }, []);
}
