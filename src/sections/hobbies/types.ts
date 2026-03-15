export type HobbyCard = {
  title: string;
  items: string[];
  image: string;
  description: string;
  expandedText: string;
  stats: { label: string; value: string }[];
  quote?: string;
};
