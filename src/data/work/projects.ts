import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "project-live",
    slug: "ingolstadt-live",
    title: "PROJECT_LIVE",
    image: "/placeholder-project.jpg",
    liveUrl: "https://ingolstadt.live",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    description:
      "A modern web application featuring real-time data synchronization and advanced UI animations. Built with performance and accessibility in mind.",
    challenges:
      "Implementing efficient state management for real-time updates while maintaining smooth 60fps animations across all devices.",
    blogContent: `Ingolstadt Live started as a side project born out of frustration. I was looking for a single place to find what was happening around the city — events, news, local updates — and nothing really fit the bill. So I decided to build it myself.

The core idea was simple: aggregate local event data and present it in a clean, real-time interface. But as with most "simple" ideas, the devil was in the details. The first major challenge was data synchronization. I needed the UI to reflect changes instantly without hammering the server with polling requests. I settled on a WebSocket-based architecture with a fallback to Server-Sent Events for browsers that didn't play nicely.

On the frontend, I went with React and TypeScript — a combination I've grown to trust for anything beyond a trivial UI. Tailwind CSS handled the styling, and Framer Motion brought the interface to life with smooth transitions between states. The trick was keeping animations at 60fps even on lower-end devices. I spent a solid week profiling render cycles and eliminating unnecessary re-renders using React.memo and useCallback strategically.

One particularly tricky problem was the event card layout. I wanted a masonry-style grid that reflows smoothly when new events appear. CSS Grid alone wasn't cutting it, so I wrote a custom layout engine that calculates positions and animates cards into place using Framer Motion's layout animations. The result feels fluid and organic, almost like the cards are breathing.

State management was another area where I iterated several times. I started with Redux, moved to Zustand for its simplicity, and eventually landed on a hybrid approach using React Context for global state and Zustand for the real-time event stream. This gave me the best of both worlds: predictable state updates for UI state and high-throughput handling for the incoming event data.

The accessibility work was something I'm particularly proud of. Every interactive element is keyboard-navigable, screen reader announcements fire for new events, and the color palette passes WCAG AA contrast ratios. It's not glamorous work, but it matters.

Looking back, this project taught me more about performance optimization than any tutorial ever could. When you're dealing with real-time data and complex animations simultaneously, every millisecond counts. The app now handles hundreds of concurrent updates while maintaining buttery smooth animations — and that feels pretty good.`,
    year: "2024-today",
  },
  {
    id: "project-emsi",
    slug: "ems-platform",
    title: "PROJECT_EMS",
    image: "/placeholder-project.jpg",
    liveUrl: "https://ems.ingostadt.live",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "tRPC"],
    description:
      "Full-stack application with type-safe APIs and optimized database queries. Features authentication, role-based access control, and data visualization dashboards.",
    challenges:
      "Designing a scalable database schema and implementing efficient query patterns for complex data relationships.",
    blogContent: `The EMS Platform began as an internal tool request that quickly grew into one of the most architecturally interesting projects I've worked on. The brief was straightforward: build a system to manage events, track participants, and generate reports. The reality was anything but straightforward.

I chose Next.js as the foundation because it gave me server-side rendering for the dashboard pages (critical for SEO on the public-facing event listings) and API routes for the backend logic. But the real game-changer was pairing it with tRPC. If you haven't used tRPC, imagine writing a function on the server and calling it from the client with full TypeScript autocompletion and type safety — no API schema to maintain, no code generation step, no runtime type mismatches. It's borderline magical.

The database layer was where things got genuinely complex. I went with PostgreSQL through Prisma, and the schema evolved through about fifteen migrations before I was satisfied. The core challenge was modeling the relationship between events, sessions, speakers, and attendees. An attendee could register for multiple events, each event had multiple sessions, sessions could have multiple speakers, and speakers could span multiple events. Classic many-to-many relationships, but with the added complexity of role-based access control layered on top.

Speaking of RBAC — I implemented a permission system with four tiers: admin, organizer, moderator, and attendee. Each role has granular permissions that can be overridden at the event level. An organizer for Event A might only be an attendee for Event B. Getting this right required a custom middleware layer that checks permissions on every tRPC procedure call. I wrote a helper called \`requirePermission\` that takes a permission key and returns a tRPC middleware, making the auth checks declarative and easy to reason about.

The data visualization dashboards were the most fun part. I used Recharts for the graphs and built a custom query builder that lets organizers slice attendance data by date range, session, demographic tags, and more. The tricky bit was making these queries performant. Raw SQL with Prisma's \`$queryRaw\` was necessary for some of the more complex aggregations — Prisma's query builder is excellent for CRUD but struggles with window functions and CTEs.

One optimization I'm proud of: the dashboard initially took 3-4 seconds to load because it was running six separate database queries. I consolidated them into a single query using PostgreSQL's JSON aggregation functions, bringing the load time down to under 400ms. Small wins like that compound into a noticeably snappier experience.

The authentication system uses NextAuth.js with both credential-based and OAuth providers. Session management leverages JWTs stored in HTTP-only cookies, with a refresh token rotation strategy to balance security and user experience. I added rate limiting on the auth endpoints using an in-memory store backed by Redis in production.

This project reinforced my belief that type safety across the full stack isn't just a nice-to-have — it's a force multiplier. The number of bugs caught at compile time rather than in production was remarkable. tRPC and Prisma together create a development experience where the compiler is your first line of defense, and that changes how confidently you can ship code.`,
    year: "2024-today",
  },
  {
    id: "project-dnd",
    slug: "dnd-voting",
    title: "PROJECT_DND",
    image: "/dnd-voting.png",
    repoUrl: "https://github.com/username/project-gamma",
    liveUrl: "https://dnd-voting.vercel.app",
    techStack: ["Three.js", "GLSL", "WebGL", "React Three Fiber"],
    description:
      "Interactive 3D experience with custom shaders and procedural animations. Pushes the boundaries of web-based graphics with optimized rendering pipelines.",
    challenges:
      "Writing performant GLSL shaders and managing GPU memory efficiently for complex particle systems and post-processing effects.",
    blogContent: `This project sits at the intersection of two things I love: Dungeons & Dragons and creative coding. The idea was to build an interactive voting system for our D&D campaign — a tool where party members could vote on decisions, with the results revealed through dramatic 3D animations. Think "fantasy war room meets WebGL."

The foundation is React Three Fiber, which wraps Three.js in React's component model. This might sound like an odd pairing, but it's genuinely one of the best developer experiences for 3D web content. Instead of imperatively creating meshes and adding them to scenes, you declare them as JSX components. State changes trigger re-renders just like any React app, but the output is a GPU-accelerated 3D scene.

The visual centerpiece is a procedural particle system that represents each vote. When a player casts their vote, a burst of particles erupts from their avatar position and spirals toward the chosen option. The particles follow a custom physics simulation written entirely in GLSL vertex shaders — no CPU-side particle updates, which means we can handle tens of thousands of particles without breaking a sweat.

Writing the GLSL was the hardest part of this project, and also the most rewarding. The vertex shader uses a combination of simplex noise and curl noise to create organic-looking particle trajectories. Each particle has a unique seed derived from its index, which feeds into the noise function to ensure no two particles follow the same path. The fragment shader applies a custom color ramp based on the vote option, with additive blending to create that glowy, ethereal look.

One challenge I didn't anticipate was GPU memory management. Each voting round creates a new particle system, and if you're not careful, you end up leaking GPU buffers. I implemented a pool-based system that pre-allocates a fixed number of particle buffers and recycles them between rounds. The geometry attributes (position, velocity, seed) are updated in place rather than creating new BufferGeometry instances.

The post-processing pipeline adds bloom, chromatic aberration, and a subtle film grain effect. I used Three.js's EffectComposer with custom passes. The bloom effect uses a dual-kawase blur algorithm which is significantly faster than the traditional gaussian blur approach — important when you're already pushing the GPU with thousands of particles.

Performance profiling revealed that the biggest bottleneck wasn't the particles or the post-processing — it was the React reconciliation overhead from re-rendering the UI overlay during animations. I solved this by splitting the app into two React roots: one for the Three.js canvas (which rarely re-renders) and one for the UI overlay. Communication between them happens through a shared Zustand store, keeping the 3D rendering loop completely isolated from UI updates.

The D&D group loves it. There's something deeply satisfying about watching your vote manifest as a swirling vortex of magical particles converging on your chosen option. It turns a simple "raise your hand" moment into a cinematic event. And honestly, that's what creative coding is all about — taking mundane interactions and making them feel extraordinary.`,
    year: "2023",
  },
  {
    id: "project-dnd-notes",
    slug: "dnd-notes",
    title: "PROJECT_DND_NOTES",
    image: "/placeholder-project.jpg",
    techStack: ["Next.js", "Supabase", "pgvector", "RAG"],
    description:
      "A cross-device note-taking app for Dungeons & Dragons campaigns, backed by Supabase sync and a RAG chat layer for querying campaign lore, NPCs, places, and session history.",
    challenges:
      "Designing a clean sync model across devices while keeping retrieval fast, grounded, and useful for messy campaign notes.",
    blogContent: `DND Notes started from a familiar tabletop problem: campaign knowledge spreads everywhere. Session notes live in one document, NPC names hide in a phone note, location details get buried in chat, and by the next session everyone remembers a slightly different version of the truth.

The goal was to build a focused note-taking app that works across devices and makes that pile of campaign context searchable in a more natural way. Supabase handles authentication, database storage, and real-time sync, so notes written on desktop are available on mobile without needing a manual export ritual before game night.

The RAG layer turns the notebook into something closer to a campaign assistant. Notes are chunked, embedded, and stored with enough metadata to keep retrieval grounded by campaign, session, character, and topic. The chat experience can answer questions like "what did we learn about the old chapel?" or "which NPC owed us a favor?" while still pointing back to the notes that informed the answer.

The hardest part was not the chat UI itself. It was deciding how notes should be structured so retrieval stays useful when the source material is messy. D&D notes are full of half-remembered names, crossed-out plans, jokes that became canon, and lore that only matters three sessions later. I built the data model around small, linkable note fragments instead of long documents, which makes retrieval more precise and keeps edits lightweight.

This project is less about replacing the human table memory and more about supporting it. The app keeps the facts close enough that players can stay in the story instead of hunting through old notes mid-session.`,
    year: "2024-today",
  },
  {
    id: "project-delta",
    slug: "uwu-bot",
    title: "PROJECT_UWU_BOT",
    image: "/uwu-bot.png",
    repoUrl: "https://github.com/doniel-t/uwu-botv2",
    techStack: ["Node.js", "Discord.js", "Ai-SDK", "Postgres"],
    description:
      "It started out as a joke in our Discord server during university and became a useful tool for my friendgroup. The latest version added a Vector DB and LLM chat feature where it remembers everyones messages and personality on my discord server. It is mostly used to roast us via the \"@uwu-bot roast Daniel about his sleeping habits.\"",
    challenges:
      "-",
    blogContent: `

UwU Bot started as a joke during my first semester at university.

At the time, I had just reached the dangerous point every beginner programmer eventually reaches: “Hey, I can code!” Since my friend group and I were really into anime, I decided to create a Discord bot command that could “uwufy” a sentence.

For example:

> “Hello, how are you today?”

> “Hewwo, how awe you today? :3”

That was the beginning. But over time, UwU Bot slowly turned into a playground.

A friend from university and I worked on the repository together and kept adding small, stupid commands that connected to the games and services we used: League of Legends, osu!, and various third-party APIs. It became the project that made me genuinely comfortable with programming.

We added a fake currency betting system, a food recipe suggester, Hangman, and even a fully working 2048 game. At some point, the project had grown enough that we decided to rewrite the whole thing in TypeScript. That rewrite became UwU Bot v2.

With v2, we tried to apply everything we had learned during our first few semesters of university and from our private programming projects. The main idea was to create an opinionated, unified command system that made adding new commands easier and more consistent.

And honestly, it worked pretty well.

Looking back, I probably would not build it with the same class-based approach today. I would likely keep it much simpler, using plain objects with handler functions and command types. But at the time, it felt like a proper, well-structured system, and it taught me a lot.

After graduation, development sadly slowed down quite a bit. But then LLMs became more accessible, and suddenly I found a new use case for the bot.

I wanted UwU Bot to feel less like a tool and more like a “real” member of our Discord server.

To make that happen, I added a vector database running on my VPS, along with a hook that embeds every message. I also built a system that tracks message context for each user, allowing the bot to learn about people’s personalities and respond to them more appropriately.

That sounds useful, right?

Well, mostly we use it to roast each other.

But it also works surprisingly well as a search interface for old Discord messages and shared context. It can remember inside jokes, bring up past conversations, and generally make the server feel more alive.

UwU Bot has given us countless laughs over the years. What started as a dumb anime joke became one of the projects that taught me the most about programming, collaboration, rewriting code, APIs, TypeScript, and now even LLMs.

It is stupid, messy, and weirdly useful.`,
    year: "2021-today",
  },
  {
    id: "project-epsilon",
    slug: "ri-rag",
    title: "PROJECT_RI_RAG",
    image: "/placeholder-project.jpg",
    repoUrl: "https://github.com/username/project-epsilon",
    techStack: ["React Native", "Expo", "Firebase", "TypeScript"],
    description:
      "Cross-platform mobile application with offline-first architecture and real-time synchronization. Delivers native-like performance on both iOS and Android.",
    challenges:
      "Building robust offline support with conflict resolution and optimizing bundle size for fast app startup.",
    blogContent: `RI-RAG (Retrieval-Informed, Retrieval-Augmented Generation) started as my exploration into making AI assistants actually useful for domain-specific knowledge. The mobile app serves as a personal knowledge base that lets you feed it documents, notes, and web pages, then ask questions and get accurate answers grounded in your own data.

The choice to build this as a mobile app was deliberate. I wanted the knowledge base to be accessible anywhere — during commutes, in meetings, while reading. React Native with Expo was the obvious choice for cross-platform development without maintaining two codebases. TypeScript was non-negotiable; the type system caught countless issues during the complex data pipeline work.

The offline-first architecture was the defining technical challenge. The app needs to work seamlessly without an internet connection — you should be able to query your knowledge base on an airplane. I implemented a local vector store using SQLite (via expo-sqlite) that stores document embeddings alongside the raw text chunks. When you add a document, it's chunked, embedded locally using a quantized ONNX model, and stored in SQLite with the vectors indexed for fast similarity search.

Synchronization between the local database and Firebase was where things got genuinely complex. I used a CRDT-inspired approach for conflict resolution. Each document has a vector clock that tracks modifications across devices. When the app comes online, it syncs with Firestore, and conflicts are resolved using a "last-write-wins" strategy for metadata and a merge strategy for annotations and highlights. The sync engine runs in a background task using Expo's TaskManager, so your data stays fresh even when the app isn't in the foreground.

The embedding pipeline deserves its own paragraph. Running ML models on mobile is tricky. I experimented with several approaches: calling an API (defeats the offline purpose), running TensorFlow Lite (too heavy), and finally settled on a custom ONNX Runtime integration. The model is a distilled sentence transformer, quantized to INT8, which brings it down to ~30MB. Embedding a paragraph takes about 200ms on a modern phone — not instant, but acceptable for background processing.

Firebase handles authentication, cloud storage for document backups, and Firestore for the sync layer. I used Firebase's offline persistence as a secondary cache, but the primary offline store is always the local SQLite database. This dual-store approach means the app is fast (local reads) and reliable (cloud backup) without either system being a single point of failure.

Bundle size optimization was an ongoing battle. React Native bundles can balloon quickly, especially with ML dependencies. I used Metro's tree-shaking aggressively, lazy-loaded the ONNX runtime (it's only needed when processing new documents), and code-split the UI into route-based chunks. The initial bundle is under 4MB, with the ML module loaded on demand.

The search interface uses a hybrid retrieval approach: first, a vector similarity search finds the top-k most relevant chunks, then a re-ranking step using BM25 scoring on the original text refines the results. This hybrid approach consistently outperforms either method alone, especially for queries that mix semantic meaning with specific keywords.

Building this app changed how I think about mobile development. The constraints of mobile — limited memory, intermittent connectivity, battery concerns — force you to be thoughtful about every architectural decision. There's no room for the "just throw more resources at it" mentality that backend development sometimes enables. Every byte of memory and every CPU cycle matters, and that discipline makes you a better engineer.`,
    year: "2022",
  },
];
