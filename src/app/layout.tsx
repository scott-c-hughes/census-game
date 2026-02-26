import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://census-game.vercel.app"),
  title: "CENSUS",
  description: "Daily US Census Data Quiz",
  openGraph: {
    title: "CENSUS",
    description: "Daily US Census Data Quiz",
    type: "website",
    url: "https://census-game.vercel.app",
    siteName: "CENSUS",
  },
  twitter: {
    card: "summary",
    title: "CENSUS",
    description: "Daily US Census Data Quiz",
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
