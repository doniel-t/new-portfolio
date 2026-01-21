import type { HobbyCard } from "./types";

export const HOBBIES: HobbyCard[] = [
  {
    title: "Anime & Manga",
    items: ["Chainsaw Man", "Evangelion", "Steins;Gate"],
    image: "/anime-bg3.png",
    description:
      "From psychological thrillers to mind-bending sci-fi, I'm drawn to stories that challenge perception and explore the human condition. There's something about Japanese animation that captures emotion in ways live-action rarely does.",
    stats: [
      { label: "Watching Since", value: "2012" },
      { label: "Favorite Genre", value: "Seinen" },
      { label: "Anilist Score Avg", value: "7.94" },
    ],
    quote: '"I need to think of a good quote here."',
  },
  {
    title: "Video Games",
    items: ["Elden Ring", "Dark Souls 3", "League of Legends", "Valorant", "NieR: Automata"],
    image: "/elden-ring-cover-art.webp",
    description:
      "I gravitate towards games with deep lore, punishing difficulty, and meaningful choices. FromSoftware titles taught me patience; competitive games taught me that tilting is never the answer (still learning).",
    stats: [
      { label: "Hours in Souls", value: "1,200+" },
      { label: "LoL Rank Peak", value: "Diamond" },
      { label: "Deaths to Malenia", value: "147" },
    ],
    quote: '"A corpse should be left well alone."',
  },
  {
    title: "Cycling",
    items: ["Urban exploration", "Night rides", "Long distance"],
    image: "/bike-bento-bg.png",
    description:
      "Nothing clears the mind like a midnight ride through empty streets. It's where most of my best ideas emerge—somewhere between the rhythm of pedaling and the blur of city lights.",
    stats: [
      { label: "Weekly Avg", value: "~80km" },
      { label: "Longest Ride", value: "142km" },
      { label: "Favorite Time", value: "2-4 AM" },
    ],
  },
  {
    title: "Digital Art",
    items: ["Character design", "Environment art", "Fan art"],
    image: "/art-bg4.png",
    description:
      "A creative outlet that balances my technical work. I enjoy the meditative process of rendering—translating ideas from imagination to screen, one brush stroke at a time.",
    stats: [
      { label: "Tool of Choice", value: "Infinite Painter" },
      { label: "Tablet", value: "Android" },
      { label: "Style", value: "Anime Painting" },
    ],
  },
  {
    title: "Dungeons & Dragons",
    items: ["Roleplay", "Character building"],
    image: "/dnd-bg.png",
    description:
      "There's nothing quite like collaborative storytelling around a table. As a forever DM, I craft worlds, weave narratives, and watch players make choices I never anticipated. It's improv theater meets tactical combat meets collective imagination.",
    stats: [
      { label: "Years Playing", value: "5+" },
      { label: "Preferred Role", value: "DM" },
      { label: "Favorite Class", value: "Wizard" },
    ],
    quote: '"Roll for initiative."',
  },
];
