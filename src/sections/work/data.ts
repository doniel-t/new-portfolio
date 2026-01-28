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
    id: "project-delta",
    slug: "uwu-bot",
    title: "PROJECT_UWU_BOT",
    image: "/uwu-bot.png",
    repoUrl: "https://github.com/username/project-delta",
    liveUrl: "https://project-delta.demo",
    techStack: ["Node.js", "Express", "Redis", "Docker"],
    description:
      "High-performance backend service handling millions of requests with sub-100ms response times. Features intelligent caching and horizontal scaling capabilities.",
    challenges:
      "Implementing distributed caching strategies and designing fault-tolerant microservices architecture.",
    blogContent: `UwU Bot started as a joke in our Discord server and turned into a serious exercise in backend engineering. The premise is absurd: a Discord bot that "uwu-ifies" text, replacing certain letter patterns and adding emoticons. But when your joke bot gets added to 2,000+ servers and starts handling thousands of messages per second, suddenly you need real infrastructure.

The original version was a single Node.js process running on a $5 VPS. It worked fine for our server. Then someone posted it on a bot listing site, and within a week it was in hundreds of servers. The single process started choking — message processing latency spiked from 20ms to over 2 seconds. Time to architect properly.

I rebuilt the bot using a worker-based architecture. The main process handles the Discord gateway connection (WebSocket) and distributes incoming messages to a pool of worker threads using Node's worker_threads module. Each worker runs the text transformation logic independently. This alone brought latency back down to ~50ms under load.

But the real scalability challenge came from the caching layer. The bot has configurable settings per server (prefix, enabled channels, intensity level, custom replacements), and looking these up for every single message was hammering the database. Enter Redis. I implemented a write-through cache where settings are loaded from PostgreSQL on first access and cached in Redis with a 5-minute TTL. Cache invalidation happens via a pub/sub channel — when a server admin changes a setting, a message is published and all bot instances update their local cache.

Docker was essential for the deployment story. I created a multi-stage Dockerfile that produces a lean production image (~80MB). The bot runs as a Docker Compose stack: the bot service (with auto-scaling replicas), Redis, PostgreSQL, and a small admin API for the web dashboard. Deployment is a single \`docker compose up -d --scale bot=3\` command.

The most interesting engineering challenge was rate limiting. Discord has strict rate limits on API calls, and different endpoints have different limits. I built a token bucket rate limiter backed by Redis that's shared across all bot instances. Before making any Discord API call, the bot checks the bucket for that endpoint. If the bucket is empty, the request is queued and retried with exponential backoff. This completely eliminated the 429 (rate limit) errors that were causing message drops.

Monitoring was another area I invested in heavily. Each bot instance exports Prometheus metrics: message processing latency (p50, p95, p99), cache hit rates, Redis connection pool utilization, and Discord gateway heartbeat intervals. A Grafana dashboard gives me a real-time view of the system's health. I even set up PagerDuty alerts for when p99 latency exceeds 200ms or cache hit rate drops below 80%.

The text transformation itself is more sophisticated than you might expect. It's not just regex replacements — there's a context-aware parser that avoids transforming URLs, code blocks, and mentions. The "intensity" setting controls how aggressively the transformation is applied, from subtle letter replacements at level 1 to full uwu-speak with kaomoji at level 5. Each level has its own transformation pipeline, and they're composable so new transformations can be added without touching existing ones.

The whole thing runs on three $10 VPS instances and handles peak loads of ~5,000 messages/second with p99 latency under 100ms. Not bad for a joke bot. The project taught me that scaling isn't about big servers — it's about smart architecture, good caching, and knowing where your bottlenecks are before they become problems.`,
    year: "2023",
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
