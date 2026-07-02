import { supabase } from "@/integrations/supabase/client";

export type ThemeSettings = {
  paper: string;
  ink: string;
  inkSoft: string;
  accent: string;
  captionBg: string;
  navSize: number;
  categorySize: number;
};

export type SiteSettings = {
  site: { name: string; tagline: string };
  home: { eyebrow: string; headline: string; intro: string; featuredLabel: string };
  about: { heading: string; body: string; sideNote: string; portraitUrl: string };
  contact: { heading: string; intro: string; email: string; location: string };
  footer: { line: string };
  theme: ThemeSettings;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  site: { name: "Studio / Name", tagline: "Graphic designer · Typography, cover art & print" },
  home: {
    eyebrow: "Portfolio · 2026",
    headline: "Quiet design.\nLoud ideas.",
    intro: "Independent graphic designer working in typography, cover art, and print. Selected projects below.",
    featuredLabel: "Selected work",
  },
  about: {
    heading: "About",
    body: "I'm a graphic designer focused on typography, cover art, and editorial print.",
    sideNote: "Available for select projects.",
    portraitUrl: "",
  },
  contact: {
    heading: "Contact",
    intro: "Tell me about your project. Short notes welcome.",
    email: "hello@example.com",
    location: "Available worldwide",
  },
  footer: { line: "© 2026 — Studio / Name. All rights reserved." },
  theme: { paper: "#f5f3ee", ink: "#0d0d0d", inkSoft: "#5b5b5b", accent: "#0d0d0d", captionBg: "#e8e4dd", navSize: 14, categorySize: 60 },
};

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await (supabase as any)
    .from("site_settings")
    .select("key, value");
  if (error) throw error;
  const merged: any = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) {
    merged[row.key] = { ...(merged[row.key] ?? {}), ...(row.value ?? {}) };
  }
  return merged as SiteSettings;
}

export async function updateSetting<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K],
): Promise<void> {
  const { error } = await (supabase as any)
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}
