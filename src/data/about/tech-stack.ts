export type TechIconKey =
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "go"
  | "python"
  | "postgres"
  | "strapi"
  | "payload"
  | "docker"
  | "podman"
  | "nginx"
  | "git"
  | "github"
  | "gitlab"
  | "figma";

export type TechStackDataItem = {
  name: string;
  cost: number;
  iconKey: TechIconKey;
  description: string;
};

export type TechStackDataCategory = {
  key: string;
  label: string;
  tag: string;
  items: TechStackDataItem[];
};

export const TECH_STACK_CATEGORIES_DATA: TechStackDataCategory[] = [
  {
    key: "frontend",
    label: "FRONTEND",
    tag: "SYS.UI",
    items: [
      { name: "Next.js", cost: 12, iconKey: "nextjs", description: "Server-side Rendering" },
      { name: "React", cost: 10, iconKey: "react", description: "UI Components" },
      { name: "TypeScript", cost: 8, iconKey: "typescript", description: "Type Safety" },
      { name: "Tailwind", cost: 6, iconKey: "tailwind", description: "Utility-first" },
    ],
  },
  {
    key: "backend",
    label: "BACKEND",
    tag: "SYS.CORE",
    items: [
      { name: "Go", cost: 14, iconKey: "go", description: "High Performance" },
      { name: "Python", cost: 10, iconKey: "python", description: "Automation & AI" },
      { name: "Postgres", cost: 11, iconKey: "postgres", description: "Relational DB" },
      { name: "Nginx", cost: 8, iconKey: "nginx", description: "Reverse Proxy" },
    ],
  },
  {
    key: "cms",
    label: "CMS",
    tag: "SYS.DATA",
    items: [
      { name: "Strapi", cost: 9, iconKey: "strapi", description: "Headless CMS" },
      { name: "Payload", cost: 9, iconKey: "payload", description: "Code-first CMS" },
    ],
  },
  {
    key: "tooling",
    label: "TOOLING",
    tag: "SYS.OPS",
    items: [
      { name: "Docker", cost: 15, iconKey: "docker", description: "Containerization" },
      { name: "Podman", cost: 12, iconKey: "podman", description: "Daemonless" },
      { name: "Git", cost: 4, iconKey: "git", description: "Version Control" },
      { name: "GitHub Actions", cost: 13, iconKey: "github", description: "Automation Workflows" },
      { name: "GitLab CI", cost: 13, iconKey: "gitlab", description: "DevOps Pipelines" },
      { name: "Figma", cost: 7, iconKey: "figma", description: "UI/UX Design" },
    ],
  },
];
