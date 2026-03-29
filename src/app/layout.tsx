import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/src/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chapter.peterbosman.be"),
  title: {
    default: "Chapter",
    template: "%s | Chapter",
  },
  description: "Chapter is a audiobook & podcast website.",
  openGraph: {
    title: "Chapter",
    description: "Chapter is a audiobook & podcast website.",
    siteName: "Chapter",
    url: "https://chapter.peterbosman.be",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chapter",
    description: "Chapter is an audiobook & podcast website.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
