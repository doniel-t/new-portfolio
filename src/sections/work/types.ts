export type Project = {
  id: string;
  slug: string;
  title: string;
  image: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  description: string;
  challenges: string;
  blogContent: string;
  year: string;
};
