import { Code2, DatabaseZap, Network, Sparkles, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiDiscord, SiExpo, SiFirebase, SiFramer, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPrisma, SiReact, SiSupabase, SiTailwindcss,
  SiThreedotjs, SiTrpc, SiTypescript, SiWebgl,
} from "react-icons/si";

const TOOL_ICONS: Record<string, IconType | LucideIcon> = {
  React: SiReact,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Framer Motion": SiFramer,
  "Next.js": SiNextdotjs,
  Prisma: SiPrisma,
  PostgreSQL: SiPostgresql,
  tRPC: SiTrpc,
  "Three.js": SiThreedotjs,
  GLSL: Code2,
  WebGL: SiWebgl,
  "React Three Fiber": SiReact,
  Supabase: SiSupabase,
  pgvector: DatabaseZap,
  RAG: Network,
  "Node.js": SiNodedotjs,
  "Discord.js": SiDiscord,
  "Ai-SDK": Sparkles,
  Postgres: SiPostgresql,
  "React Native": SiReact,
  Expo: SiExpo,
  Firebase: SiFirebase,
};

export default function ProjectToolIcons({ tools }: { tools: readonly string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-2 text-[#d4cdc4]" aria-label="Tools used">
      {tools.map((tool) => {
        const Icon = TOOL_ICONS[tool] ?? Code2;
        return (
          <li key={tool} title={tool}>
            <span role="img" aria-label={tool} className="flex h-6 min-w-6 items-center justify-center">
              <Icon size={18} aria-hidden="true" />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
