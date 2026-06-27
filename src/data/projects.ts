import workType1 from "@/assets/work-type-1.jpg";
import workType2 from "@/assets/work-type-2.jpg";
import workCover1 from "@/assets/work-cover-1.jpg";
import workCover2 from "@/assets/work-cover-2.jpg";
import workDesign1 from "@/assets/work-design-1.jpg";
import workDesign2 from "@/assets/work-design-2.jpg";

export type Category = "typography" | "cover-art" | "designs";

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: Category;
  blurb: string;
  cover: string;
  gallery: string[];
};

export const CATEGORIES: { id: Category; label: string; description: string }[] = [
  { id: "typography", label: "Typography", description: "Letterforms, type specimens, custom display." },
  { id: "cover-art", label: "Cover Art", description: "Records, books, editorial covers." },
  { id: "designs", label: "Designs", description: "Posters, identity, print and editorial." },
];

export const projects: Project[] = [
  {
    slug: "fliegt-noagn",
    title: "Fliegt, Noagn",
    year: "2024",
    category: "typography",
    blurb: "An exercise in oversized condensed display letters set on uncoated stock.",
    cover: workType1,
    gallery: [workType1, workType2],
  },
  {
    slug: "specimen-no-3",
    title: "Specimen No. 3",
    year: "2024",
    category: "typography",
    blurb: "Slab serif specimen exploring weight and rhythm in a single column grid.",
    cover: workType2,
    gallery: [workType2, workType1],
  },
  {
    slug: "elvel-lp",
    title: "Elvel — LP",
    year: "2023",
    category: "cover-art",
    blurb: "Sleeve design for a self-titled debut. Black on cream, embossed mark.",
    cover: workCover1,
    gallery: [workCover1, workCover2],
  },
  {
    slug: "the-one-book",
    title: "The One",
    year: "2024",
    category: "cover-art",
    blurb: "Hardcover treatment with a single inset title block and exposed binding.",
    cover: workCover2,
    gallery: [workCover2, workCover1],
  },
  {
    slug: "two-strokes",
    title: "Two Strokes",
    year: "2024",
    category: "designs",
    blurb: "Hand-painted poster series. Two marks, one breath.",
    cover: workDesign1,
    gallery: [workDesign1, workDesign2],
  },
  {
    slug: "porait-magazine",
    title: "Porait — Issue 01",
    year: "2023",
    category: "designs",
    blurb: "Editorial spreads for an independent print quarterly.",
    cover: workDesign2,
    gallery: [workDesign2, workDesign1],
  },
];

export function getProjects(category: Category) {
  return projects.filter((p) => p.category === category);
}

export function getProject(category: Category, slug: string) {
  return projects.find((p) => p.category === category && p.slug === slug);
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
