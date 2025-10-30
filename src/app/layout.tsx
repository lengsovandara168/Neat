import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BirthdayHeader } from "@/components/BirthdayHeader";
import { BirthdayFooter } from "@/components/BirthdayFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Happy Birthday, Mok Chanmonineath!",
  description:
    "A delightful birthday greeting with memories, celebration, and future wishes for Mok Chanmonineath.",
  icons: {
    icon: [{ url: "/photos/image_profile.jpg", type: "image/jpeg" }],
    apple: [
      {
        url: "/photos/image_profile.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
    shortcut: "/photos/image_profile.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Happy Birthday!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ff9a9e" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setInitialTheme = `
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = stored ? stored === 'dark' : prefersDark;
      var root = document.documentElement;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } catch (e) {}
  `;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {setInitialTheme}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BirthdayHeader />
        {children}
        <BirthdayFooter />
      </body>
    </html>
  );
}
