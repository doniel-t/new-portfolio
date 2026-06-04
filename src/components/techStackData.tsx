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
import {
  TECH_STACK_CATEGORIES_DATA,
  type TechIconKey,
  type TechStackDataItem,
} from "@/data/about/tech-stack";

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

const ICONS: Record<TechIconKey, React.ReactNode> = {
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

function withIcon(item: TechStackDataItem): TechItem {
  return {
    cost: item.cost,
    description: item.description,
    icon: ICONS[item.iconKey],
    name: item.name,
  };
}

export const TECH_STACK_CATEGORIES: TechCategoryDef[] = TECH_STACK_CATEGORIES_DATA.map(
  (category) => ({
    ...category,
    items: category.items.map(withIcon),
  })
);

export const TECH_STACK_ITEMS = TECH_STACK_CATEGORIES.flatMap((category) => category.items);
export const TECH_STACK_TOTAL_MEMORY = TECH_STACK_ITEMS.reduce((acc, item) => acc + item.cost, 0);
