import type { HobbyCard } from "./types";

export const HOBBIES: HobbyCard[] = [
  {
    title: "Anime & Manga",
    items: ["Chainsaw Man", "Evangelion", "Steins;Gate"],
    image: "/anime-bg3.png",
    description:
      "From psychological thrillers to mind-bending sci-fi, I'm drawn to stories that challenge perception and explore the human condition. There's something about Japanese animation that captures emotion in ways live-action rarely does.",
    expandedText:
      "I keep a running watchlist and usually rotate between one heavy story and one comfort series so the pace never burns out. Manga nights are where I slow down and pay attention to paneling, composition, and pacing. A lot of my visual taste in UI comes from title cards and transition timing in anime openings. It is one of the hobbies that constantly feeds both my creativity and my patience.",
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
    expandedText:
      "I love games that reward curiosity and observation instead of only checklist progression. Souls-likes scratch the exploration itch, while competitive games sharpen decision making under pressure. I also enjoy watching long-form lore breakdowns after finishing a major title because they reveal details I missed on the first run. Most importantly, games are still my favorite way to reset after deep work sessions.",
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
      "Nothing clears the mind like a midnight ride through empty streets. It's where most of my best ideas emerge-somewhere between the rhythm of pedaling and the blur of city lights.",
    expandedText:
      "Cycling gives me the same focus loop that coding does, just without a screen. I map routes around quiet streets, river paths, and open stretches where I can keep a steady cadence. Night rides are my favorite because the city feels different when it is almost empty. If I am stuck on a problem, a ride usually helps me come back with a cleaner approach.",
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
      "A creative outlet that balances my technical work. I enjoy the meditative process of rendering-translating ideas from imagination to screen, one brush stroke at a time.",
    expandedText:
      "I mostly sketch characters and environments, then iterate with fast value studies before adding detail. The process is slower than coding, and that is exactly why I like it. It trains my eye for contrast, hierarchy, and composition, which carries over to interface design. Even short sessions help me reset my brain and return to technical work with more clarity.",
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
    expandedText:
      "Running campaigns taught me how to improvise structure without losing momentum. I usually prep key scenes, memorable NPCs, and a few flexible encounters, then let player choices shape everything else. DnD is one of the best reminders that constraints can actually make creativity stronger. It is chaotic in the best way and always leads to stories that nobody could plan alone.",
    stats: [
      { label: "Years Playing", value: "5+" },
      { label: "Preferred Role", value: "DM" },
      { label: "Favorite Class", value: "Wizard" },
    ],
    quote: '"Roll for initiative."',
  },
];
