import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "project-live",
    title: "PROJECT_LIVE",
    image: "/placeholder-project.jpg",
    liveUrl: "https://ingolstadt.live",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    description:
      "A modern web application featuring real-time data synchronization and advanced UI animations. Built with performance and accessibility in mind.",
    challenges:
      "Implementing efficient state management for real-time updates while maintaining smooth 60fps animations across all devices.",
    year: "2024-today",
  },
  {
    id: "project-emsi",
    title: "PROJECT_EMS",
    image: "/placeholder-project.jpg",
    liveUrl: "https://ems.ingostadt.live",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "tRPC"],
    description:
      "Full-stack application with type-safe APIs and optimized database queries. Features authentication, role-based access control, and data visualization dashboards.",
    challenges:
      "Designing a scalable database schema and implementing efficient query patterns for complex data relationships.",
    year: "2024-today",
  },
  {
    id: "project-dnd",
    title: "PROJECT_DND",
    image: "/dnd-voting.png",
    repoUrl: "https://github.com/username/project-gamma",
    liveUrl: "https://dnd-voting.vercel.app",
    techStack: ["Three.js", "GLSL", "WebGL", "React Three Fiber"],
    description:
      "Interactive 3D experience with custom shaders and procedural animations. Pushes the boundaries of web-based graphics with optimized rendering pipelines.",
    challenges:
      "Writing performant GLSL shaders and managing GPU memory efficiently for complex particle systems and post-processing effects.",
    year: "2023",
  },
  {
    id: "project-delta",
    title: "PROJECT_UWU_BOT",
    image: "/uwu-bot.png",
    repoUrl: "https://github.com/username/project-delta",
    liveUrl: "https://project-delta.demo",
    techStack: ["Node.js", "Express", "Redis", "Docker"],
    description:
      "High-performance backend service handling millions of requests with sub-100ms response times. Features intelligent caching and horizontal scaling capabilities.",
    challenges:
      "Implementing distributed caching strategies and designing fault-tolerant microservices architecture.",
    year: "2023",
  },
  {
    id: "project-epsilon",
    title: "PROJECT_RI_RAG",
    image: "/placeholder-project.jpg",
    repoUrl: "https://github.com/username/project-epsilon",
    techStack: ["React Native", "Expo", "Firebase", "TypeScript"],
    description:
      "Cross-platform mobile application with offline-first architecture and real-time synchronization. Delivers native-like performance on both iOS and Android.",
    challenges:
      "Building robust offline support with conflict resolution and optimizing bundle size for fast app startup.",
    year: "2022",
  },
];
