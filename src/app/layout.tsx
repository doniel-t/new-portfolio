import type { Metadata } from "next";
import { Geist, Geist_Mono, Staatliches } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const staatliches = Staatliches({
  variable: "--font-staatliches",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danieltheils.dev";
const metadataBase = siteUrl.startsWith("http")
  ? new URL(siteUrl)
  : new URL(`https://${siteUrl}`);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Daniel Theils Portfolio",
    template: "%s | Daniel Theils Portfolio",
  },
  description:
    "I like building unique stuff",
  applicationName: "Daniel Theils Portfolio",
  category: "technology",
  keywords: [
    "Daniel Theils",
    "Daniel Theils Portfolio",
    "German full-stack developer",
    "UI design",
    "Web development",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Daniel Theils" }],
  creator: "Daniel Theils",
  publisher: "Daniel Theils",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    title: "Daniel Theils Portfolio",
    description:
      "I like building unique stuff",
    siteName: "Daniel Theils Portfolio",
    images: [
      {
        url: "/me-dithered.png",
        alt: "Portrait of Daniel Theils, German full-stack developer and UI design enthusiast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Theils Portfolio",
    description:
      "I like building unique stuff",
    images: ["/me-dithered.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${staatliches.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
