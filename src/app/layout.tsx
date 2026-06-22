import type { Metadata } from "next";
import { Geist, Geist_Mono, Staatliches } from "next/font/google";
import "./globals.css";
import InitialLoadTransition from "@/components/InitialLoadTransition";
import { SITE_METADATA_CONTENT } from "@/data/site/metadata";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_METADATA_CONTENT.url;
const metadataBase = siteUrl.startsWith("http")
  ? new URL(siteUrl)
  : new URL(`https://${siteUrl}`);

export const metadata: Metadata = {
  metadataBase,
  title: SITE_METADATA_CONTENT.title,
  description: SITE_METADATA_CONTENT.description,
  applicationName: SITE_METADATA_CONTENT.applicationName,
  category: SITE_METADATA_CONTENT.category,
  keywords: [...SITE_METADATA_CONTENT.keywords],
  authors: [{ name: SITE_METADATA_CONTENT.authorName }],
  creator: SITE_METADATA_CONTENT.authorName,
  publisher: SITE_METADATA_CONTENT.authorName,
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
    type: SITE_METADATA_CONTENT.openGraph.type,
    locale: SITE_METADATA_CONTENT.openGraph.locale,
    url: "/",
    title: SITE_METADATA_CONTENT.title.default,
    description: SITE_METADATA_CONTENT.description,
    siteName: SITE_METADATA_CONTENT.openGraph.siteName,
    images: [
      {
        url: SITE_METADATA_CONTENT.openGraph.image.url,
        alt: SITE_METADATA_CONTENT.openGraph.image.alt,
      },
    ],
  },
  twitter: {
    card: SITE_METADATA_CONTENT.twitter.card,
    title: SITE_METADATA_CONTENT.title.default,
    description: SITE_METADATA_CONTENT.description,
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
        {/* <InitialLoadTransition /> */}
        {children}
      </body>
    </html>
  );
}
