export const SITE_METADATA_CONTENT = {
  url: "https://daniel-theil.dev",
  title: {
    default: "Daniel Theils Portfolio",
    template: "%s | Daniel Theils Portfolio",
  },
  description: "I like building unique stuff",
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
  authorName: "Daniel Theils",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Daniel Theils Portfolio",
    image: {
      url: "/me-dithered.png",
      alt: "Portrait of Daniel Theils, German full-stack developer and UI design enthusiast",
    },
  },
  twitter: {
    card: "summary_large_image",
  },
} as const;
