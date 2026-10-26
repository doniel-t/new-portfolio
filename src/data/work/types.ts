export type Project = {
  id: string;
  slug: string;
  title: string;
  image: string;
  /** Optional 1:1 card image; expanded project views use image. */
  thumbnailImage?: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  description: string;
  previewDescription?: string;
  challenges: string;
  blogContent: string;
  year: string;
};
