export type HobbyCard = {
  title: string;
  items: string[];
  image: string;
  description: string;
  stats: { label: string; value: string }[];
  quote?: string;
};
