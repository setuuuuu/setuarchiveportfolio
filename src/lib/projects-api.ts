import { supabase } from "@/integrations/supabase/client";
import type { Category, Project, ProjectImage } from "@/data/projects";

export async function fetchAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchProjectsByCategory(category: Category): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchProjectBySlug(category: Category, slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Project) ?? null;
}

export async function fetchProjectImages(projectId: string): Promise<ProjectImage[]> {
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectImage[];
}

export function publicImageUrl(path: string): string {
  return supabase.storage.from("work").getPublicUrl(path).data.publicUrl;
}
