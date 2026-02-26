import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://census-game.vercel.app"),
  title: "CENSUS - Daily US Census Data Quiz",
  description:
    "A daily quiz game using real US Census data. Guess the ancestry from a heatmap or find a city from its demographics. One puzzle per day, 6 guesses.",
  openGraph: {
    title: "CENSUS - Daily US Census Data Quiz",
    description:
      "Can you guess the ancestry from a US heatmap? Or find a city from its demographics? Play the daily Census quiz!",
    type: "website",
    url: "https://census-game.vercel.app",
    siteName: "CENSUS",
  },
  twitter: {
    card: "summary_large_image",
    title: "CENSUS - Daily US Census Data Quiz",
    description:
      "A Wordle-style daily quiz using real US Census data. How well do you know America?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} font-mono antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
