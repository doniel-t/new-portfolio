import type { HobbyCard } from "./types";

export const HOBBIES: HobbyCard[] = [
  {
    title: "Anime & Manga",
    items: ["Chainsaw Man", "Evangelion", "Steins;Gate"],
    image: "/anime-bg3.png",
    description:
      "I like things that are unique and challenge the audiences mind and japanese media hits exactly that itch in my brain.",
    expandedText:
      "Anime and manga are a creative outlet that constantly fuels my curiosity. I love stories weird enough to make me spend hours researching niche topics, staring at the ceiling thinking through wild theories, or diving into online discussions with people just as invested as I am.",
    stats: [
      { label: "Watching Since", value: "2012" },
      { label: "Favorite Genre", value: "Seinen" },
      { label: "Anilist Score Avg", value: "7.94" },
    ],
    quote: '"Thank you, Chainsaw Man!"',
  },
  {
    title: "Video Games",
    items: ["Elden Ring", "Hollow Knight", "League of Legends", "Valorant", "NieR: Automata", "Clair Obscure: Expidtion 33"],
    image: "/elden-ring-cover-art.webp",
    description:
      "I gravitate towards games with a competitive edge and punishing difficulty. However story games with a banger Soundtrack and a cool narrative are hard to beat!",
    expandedText:
      "Video Games as a medium are so interesting. It ranges from having a good time with your friends to having a perspective shifting experience. Seeing the 'Thank you for playing!' at the end of the credits never fail to tear me up!",
    stats: [
      { label: "Hours in Souls", value: "600+" },
      { label: "LoL Rank Peak", value: "Diamond" },
    ],
    quote: '"I have too many video game songs in my playlist!"',
  },
  {
    title: "Cycling",
    items: ["Urban exploration", "Night rides", "Nature"],
    image: "/bike-bento-bg.png",
    description:
      "Riding the bike is a way for me to connect to nature. I use my gravel bike to ride alongside country roads near my home. Its the perfect way to unwind and challenge my body.",
    expandedText:
      "Cycling gives me the same focus loop that coding does, just without a screen. I map routes around quiet streets, river paths, and open stretches where I can keep a steady cadence. Night rides are my favorite because the city feels different when it is almost empty. If I am stuck on a problem, a ride usually helps me come back with a cleaner approach.",
    stats: [
      { label: "Weekly Avg", value: "~80km" },
      { label: "Favorite Time", value: "2-4 AM" },
    ],
    quote: '"Life is movement"'
  },
  {
    title: "Digital Art",
    items: ["Character design", "Environment art", "Fan art"],
    image: "/art-bg4.png",
    description:
      "Painting is something that really hooks me. Once im in the flow, my music is blasting in my headphones and im in the mood i can go on for hours. It's a hobby that i have picked up in covid and seeing my improvement over time is one of the most rewarding things ever.",
    expandedText:
      "I mostly sketch characters and play around with colors, then iterate with fast value studies before adding detail. The process is slower and more chaotic than coding, and that is exactly why I like it. In a way painting is still problem solving but with much more friction and no correct answer, which is the perfect contrast for me.",
    stats: [
      { label: "Tool of Choice", value: "Clip Studio Paint" },
      { label: "Tablet", value: "Huion Camvas Pro 19" },
      { label: "Favourite Artist", value: "Tatsuki Fujimoto" },
    ],
    quote: '"The blank canvas scares me"'
  },
  {
    title: "Dungeons & Dragons",
    shortTitle: "DnD",
    items: ["Roleplay", "Character building"],
    image: "/dnd-bg.png",
    description:
      "I only played DnD for 2 years but in those years I fell in love with it. Collaborative story telling and consistent in-person meetups with my friends are what made it so enjoyable. A clutch nat 20 is fun, but seeing the face of a friend who rolled a 1 and made something stupid is the best feeling ever.",
    expandedText:
      "DnD is more than just roleplaying and throwing dice. I love creating characters and I could think hours upon hours about them. I tend to create chaos in the group and force uncomfortable situations. Its perfect to annoy my friends. Besides that I love exploring the story that the DM tries to tell. Its especially fun when mysteries arise and the players brainstorm what could happen. We're always wrong but its still awesome to talk about it!",
    stats: [
      { label: "Campaigns played", value: "1" },
      { label: "Oneshots played", value: "4" },
      { label: "Favorite Class", value: "Bard" },
    ],
    quote: '"Moth incident"',
  },
];
