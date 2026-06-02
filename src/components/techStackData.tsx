import React from "react";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiGithubactions,
  SiGitlab,
  SiGo,
  SiNextdotjs,
  SiNginx,
  SiPayloadcms,
  SiPodman,
  SiPostgresql,
  SiPython,
  SiReact,
  SiStrapi,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export type TechItem = {
  name: string;
  cost: number;
  icon: React.ReactNode;
  description: string;
};

export type TechCategoryDef = {
  key: string;
  label: string;
  tag: string;
  items: TechItem[];
};

const ICONS = {
  nextjs: <SiNextdotjs size={24} />,
  react: <SiReact size={24} />,
  typescript: <SiTypescript size={24} />,
  tailwind: <SiTailwindcss size={24} />,
  go: <SiGo size={24} />,
  python: <SiPython size={24} />,
  postgres: <SiPostgresql size={24} />,
  strapi: <SiStrapi size={24} />,
  payload: <SiPayloadcms size={24} />,
  docker: <SiDocker size={24} />,
  podman: <SiPodman size={24} />,
  nginx: <SiNginx size={24} />,
  git: <SiGit size={24} />,
  github: <SiGithubactions size={24} />,
  gitlab: <SiGitlab size={24} />,
  figma: <SiFigma size={24} />,
};

export const TECH_STACK_CATEGORIES: TechCategoryDef[] = [
  {
    key: "frontend",
    label: "FRONTEND",
    tag: "SYS.UI",
    items: [
      { name: "Next.js", cost: 12, icon: ICONS.nextjs, description: "Server-side Rendering" },
      { name: "React", cost: 10, icon: ICONS.react, description: "UI Components" },
      { name: "TypeScript", cost: 8, icon: ICONS.typescript, description: "Type Safety" },
      { name: "Tailwind", cost: 6, icon: ICONS.tailwind, description: "Utility-first" },
    ],
  },
  {
    key: "backend",
    label: "BACKEND",
    tag: "SYS.CORE",
    items: [
      { name: "Go", cost: 14, icon: ICONS.go, description: "High Performance" },
      { name: "Python", cost: 10, icon: ICONS.python, description: "Automation & AI" },
      { name: "Postgres", cost: 11, icon: ICONS.postgres, description: "Relational DB" },
      { name: "Nginx", cost: 8, icon: ICONS.nginx, description: "Reverse Proxy" },
    ],
  },
  {
    key: "cms",
    label: "CMS",
    tag: "SYS.DATA",
    items: [
      { name: "Strapi", cost: 9, icon: ICONS.strapi, description: "Headless CMS" },
      { name: "Payload", cost: 9, icon: ICONS.payload, description: "Code-first CMS" },
    ],
  },
  {
    key: "tooling",
    label: "TOOLING",
    tag: "SYS.OPS",
    items: [
      { name: "Docker", cost: 15, icon: ICONS.docker, description: "Containerization" },
      { name: "Podman", cost: 12, icon: ICONS.podman, description: "Daemonless" },
      { name: "Git", cost: 4, icon: ICONS.git, description: "Version Control" },
      { name: "GitHub Actions", cost: 13, icon: ICONS.github, description: "Automation Workflows" },
      { name: "GitLab CI", cost: 13, icon: ICONS.gitlab, description: "DevOps Pipelines" },
      { name: "Figma", cost: 7, icon: ICONS.figma, description: "UI/UX Design" },
    ],
  },
];

export const TECH_STACK_ITEMS = TECH_STACK_CATEGORIES.flatMap((category) => category.items);
export const TECH_STACK_TOTAL_MEMORY = TECH_STACK_ITEMS.reduce((acc, item) => acc + item.cost, 0);
