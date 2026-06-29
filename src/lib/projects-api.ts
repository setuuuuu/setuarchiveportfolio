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

// Bucket is private (workspace blocks public buckets). Use a 10-year signed URL
// so admin uploads render anywhere without per-request signing.
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function signedImageUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from("work").createSignedUrl(path, TEN_YEARS);
  if (error || !data) throw error ?? new Error("Could not sign URL");
  return data.signedUrl;
}

export async function uploadProjectFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("work").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return signedImageUrl(path);
}
