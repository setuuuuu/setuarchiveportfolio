import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllProjects,
  fetchProjectImages,
  publicImageUrl,
} from "@/lib/projects-api";
import { CATEGORIES, type Category, type Project } from "@/data/projects";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Studio / Name" }] }),
  component: AdminPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("work").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return publicImageUrl(path);
}

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: row } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!row);
    });
  }, []);

  const { data: projects = [], refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchAllProjects,
  });

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
  }

  async function deleteProject(p: Project) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) {
      alert(error.message);
      return;
    }
    setSelected(null);
    refetch();
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl uppercase">Not authorized</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Your account isn't an admin. The first signup becomes admin automatically.
        </p>
        <button onClick={signOut} className="mt-8 text-xs uppercase tracking-widest link-underline">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20">
      <header className="flex items-baseline justify-between border-b border-ink/90 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-soft">Admin</p>
          <h1 className="mt-2 font-display text-5xl uppercase">Your work</h1>
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-widest">
          <button onClick={() => { setSelected(null); setShowNew(true); }} className="link-underline">
            + New project
          </button>
          <button onClick={signOut} className="link-underline">Sign out</button>
        </div>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_2fr]">
        <aside>
          <h2 className="text-xs uppercase tracking-widest text-ink-soft">
            {projects.length} projects
          </h2>
          <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => { setSelected(p); setShowNew(false); }}
                  className={`flex w-full items-center justify-between py-3 text-left ${
                    selected?.id === p.id ? "font-semibold" : ""
                  }`}
                >
                  <span className="font-display uppercase">{p.title}</span>
                  <span className="text-xs uppercase tracking-widest text-ink-soft">
                    {p.category}
                  </span>
                </button>
              </li>
            ))}
            {projects.length === 0 && (
              <li className="py-6 text-sm text-ink-soft">No projects yet.</li>
            )}
          </ul>
        </aside>

        <section>
          {showNew && <NewProjectForm onDone={() => { setShowNew(false); refetch(); }} />}
          {selected && (
            <ProjectEditor
              key={selected.id}
              project={selected}
              onDelete={() => deleteProject(selected)}
              onChange={() => refetch()}
            />
          )}
          {!showNew && !selected && (
            <p className="text-sm text-ink-soft">
              Select a project to edit, or create a new one.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function NewProjectForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("typography");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [blurb, setBlurb] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      let coverUrl = "";
      if (cover) coverUrl = await uploadFile(cover);
      const slug = slugify(title) || crypto.randomUUID().slice(0, 8);
      const { error } = await supabase.from("projects").insert({
        title, category, year, blurb, slug, cover_url: coverUrl,
      });
      if (error) throw error;
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 border border-ink p-6 md:p-8">
      <h3 className="font-display text-2xl uppercase">New project</h3>
      <Field label="Title">
        <input className={inputCls} required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Category">
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Year">
        <input className={inputCls} value={year} onChange={(e) => setYear(e.target.value)} />
      </Field>
      <Field label="Brief">
        <textarea className={inputCls} rows={3} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
      </Field>
      <Field label="Cover image">
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      </Field>
      {err && <p className="text-sm text-red-700">{err}</p>}
      <button disabled={busy} className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper disabled:opacity-50">
        {busy ? "Saving…" : "Create"}
      </button>
    </form>
  );
}

function ProjectEditor({ project, onDelete, onChange }: { project: Project; onDelete: () => void; onChange: () => void }) {
  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState<Category>(project.category);
  const [year, setYear] = useState(project.year);
  const [blurb, setBlurb] = useState(project.blurb);
  const [slug, setSlug] = useState(project.slug);
  const [coverUrl, setCoverUrl] = useState(project.cover_url);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { data: images = [], refetch: refetchImages } = useQuery({
    queryKey: ["project-images", project.id],
    queryFn: () => fetchProjectImages(project.id),
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ title, category, year, blurb, slug, cover_url: coverUrl })
        .eq("id", project.id);
      if (error) throw error;
      onChange();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function changeCover(file: File) {
    setBusy(true);
    try {
      const url = await uploadFile(file);
      setCoverUrl(url);
      await supabase.from("projects").update({ cover_url: url }).eq("id", project.id);
      onChange();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function addImages(files: FileList) {
    setBusy(true);
    try {
      const startOrder = images.length;
      const rows = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        rows.push({ project_id: project.id, url, sort_order: startOrder + i });
      }
      const { error } = await supabase.from("project_images").insert(rows);
      if (error) throw error;
      refetchImages();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeImage(id: string) {
    const { error } = await supabase.from("project_images").delete().eq("id", id);
    if (error) return alert(error.message);
    refetchImages();
  }

  return (
    <form onSubmit={save} className="space-y-6 border border-ink p-6 md:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl uppercase">{project.title}</h3>
        <button type="button" onClick={onDelete} className="text-xs uppercase tracking-widest text-red-700 link-underline">
          Delete
        </button>
      </div>

      <Field label="Title">
        <input className={inputCls} required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Slug (URL)">
        <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} />
      </Field>
      <Field label="Category">
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Year">
        <input className={inputCls} value={year} onChange={(e) => setYear(e.target.value)} />
      </Field>
      <Field label="Brief">
        <textarea className={inputCls} rows={3} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
      </Field>

      <Field label="Cover image">
        {coverUrl && <img src={coverUrl} alt="cover" className="mb-3 max-h-48 border border-ink/15" />}
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) changeCover(f); }} />
      </Field>

      <div>
        <p className="text-xs uppercase tracking-widest text-ink-soft">Gallery images ({images.length})</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.url} alt="" className="aspect-square w-full object-cover border border-ink/15" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-paper"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="mt-3"
          onChange={(e) => { if (e.target.files?.length) addImages(e.target.files); e.target.value = ""; }}
        />
      </div>

      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex gap-3">
        <button disabled={busy} className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper disabled:opacity-50">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "mt-2 block w-full border-b border-ink bg-transparent py-2 outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
