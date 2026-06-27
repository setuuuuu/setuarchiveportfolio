export type Category = "typography" | "cover-art" | "designs";

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: Category;
  blurb: string;
  cover_url: string;
  sort_order: number;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  sort_order: number;
};

export const CATEGORIES: { id: Category; label: string; description: string }[] = [
  { id: "typography", label: "Typography", description: "Letterforms, type specimens, custom display." },
  { id: "cover-art", label: "Cover Art", description: "Records, books, editorial covers." },
  { id: "designs", label: "Designs", description: "Posters, identity, print and editorial." },
];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
