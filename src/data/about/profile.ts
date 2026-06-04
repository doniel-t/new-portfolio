export const ABOUT_CONTENT = {
  portrait: {
    alt: "Daniel Theil pixel portrait",
    feedLabel: "PORTRAIT_FEED",
    capturedAt: "2025.01.21",
  },
  intro: {
    label: "[01] Introduction",
    meta: "profile_index / about",
  },
  vibe: {
    label: "VIBE SIGNAL",
    emojis: [
      "=w=",
      "o_o",
      "(●ω●)",
      "⊙﹏⊙∥",
      "( •̀ ω •́ )✧",
      "¯\\_(ツ)_/¯",
      "(⌐■_■)",
      "￣へ￣",
    ],
  },
  rail: {
    eyebrow: "operator",
    name: "Daniel Theil",
  },
  profileStats: [
    { value: "7+", label: "Programming Exp" },
    { value: "2+", label: "Years Professional Exp" },
  ],
  coreStackNames: ["Next.js", "TypeScript", "Tailwind", "Go"],
  personalStats: [
    { label: "Age", value: "25", isHighlighted: false },
    { label: "Gender", value: "Male", isHighlighted: false },
    { label: "Status", value: "Open", isHighlighted: true },
    { label: "Languages", value: "GB\u00A0/\u00A0DE", isHighlighted: false },
  ],
  experience: [
    {
      role: "Fullstack Engineer",
      company: "Komma-D",
      duration: "1.5 years",
      status: "ONGOING",
      badge: "ACTIVE",
      focus: ["Multi-tenant NextJS", "DevOps", "LLM-Chatbots"],
    },
    {
      role: "Intern Software Engineer",
      company: "ASAP",
      duration: "0.5 years",
      status: "COMPLETED",
      badge: "LOGGED",
      focus: ["Image Detection", "Kotlin App"],
    },
    {
      role: "Working Student Software Engineer",
      company: "eSolutions",
      duration: "0.5 years",
      status: "COMPLETED",
      badge: "LOGGED",
      focus: ["Internal Tooling", "Go", "Angular"],
    },
  ],
  summary: {
    sectionLabel: "Profile",
    lead: "I'm a fullstack engineer creating software for the love of the game.",
    detail: "I've been coding for 7+ years and building professionally for 2+ years.",
  },
  sections: {
    coreStack: "Core stack",
    stats: "Stats",
    experience: "Experience",
    location: "Location",
  },
  location: {
    regionLabel: "Region",
    region: "Bavaria, Germany",
    localTimeLabel: "Local time",
  },
  views: {
    profile: {
      title: "Software Engineer",
      meta: "view 01 / profile",
    },
    projects: {
      title: "Recent Projects",
      sectionLabel: "Recent projects",
      description:
        "Selected work, client builds, and personal experiments folded into the profile stream.",
    },
    techStack: {
      title: "Tech Stack",
    },
  },
} as const;
