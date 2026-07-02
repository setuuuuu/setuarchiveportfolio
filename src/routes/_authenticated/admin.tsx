import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllProjects,
  fetchProjectImages,
  uploadProjectFile,
} from "@/lib/projects-api";
import { CATEGORIES, type Category, type Project } from "@/data/projects";
import {
  DEFAULT_SETTINGS,
  fetchSettings,
  updateSetting,
  type SiteSettings,
} from "@/lib/settings-api";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Studio / Name" }] }),
  component: AdminPage,
});

type Tab = "projects" | "content" | "theme";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("projects");

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

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
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
      <header className="flex flex-wrap items-baseline justify-between gap-6 border-b border-ink/90 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-soft">Admin</p>
          <h1 className="mt-2 font-display text-5xl uppercase">Your site</h1>
        </div>
        <button onClick={signOut} className="text-xs uppercase tracking-widest link-underline">
          Sign out
        </button>
      </header>

      <nav className="mt-8 flex gap-8 border-b border-ink/15 pb-3 text-xs uppercase tracking-widest">
        {(["projects", "content", "theme"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`link-underline ${tab === t ? "font-semibold" : "text-ink-soft"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        {tab === "projects" && <ProjectsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "theme" && <ThemeTab />}
      </div>
    </div>
  );
}

/* ----------------------------- Projects Tab ----------------------------- */

function ProjectsTab() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showNew, setShowNew] = useState(false);
  const { data: projects = [], refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchAllProjects,
  });

  async function deleteProject(p: Project) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) return alert(error.message);
    setSelected(null);
    refetch();
  }

  async function setRank(index: number, newRank: number) {
    const target = Math.max(1, Math.min(projects.length, newRank)) - 1;
    if (target === index) return;
    const arr = projects.slice();
    const [moved] = arr.splice(index, 1);
    arr.splice(target, 0, moved);
    await Promise.all(
      arr.map((p, i) =>
        p.sort_order === i
          ? Promise.resolve()
          : supabase.from("projects").update({ sort_order: i }).eq("id", p.id),
      ),
    );
    refetch();
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
      <aside>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-widest text-ink-soft">
            {projects.length} projects
          </h2>
          <button
            onClick={() => { setSelected(null); setShowNew(true); }}
            className="text-xs uppercase tracking-widest link-underline"
          >
            + New
          </button>
        </div>
        <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
          {projects.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={projects.length}
                aria-label="Rank"
                defaultValue={i + 1}
                key={`${p.id}-${i}`}
                onBlur={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (n && n !== i + 1) setRank(i, n);
                }}
                className="w-12 border border-ink/20 bg-transparent px-2 py-1 text-center text-sm"
              />
              <button
                onClick={() => { setSelected(p); setShowNew(false); }}
                className={`flex flex-1 items-center justify-between py-3 text-left ${
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
          {projects.length === 0 && <li className="py-6 text-sm text-ink-soft">No projects yet.</li>}
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
          <p className="text-sm text-ink-soft">Select a project to edit, or create a new one.</p>
        )}
      </section>
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
      if (cover) coverUrl = await uploadProjectFile(cover);
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
      <Field label="Cover image (any size)">
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
    setBusy(true); setErr(null);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ title, category, year, blurb, slug, cover_url: coverUrl })
        .eq("id", project.id);
      if (error) throw error;
      onChange();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  async function changeCover(file: File) {
    setBusy(true);
    try {
      const url = await uploadProjectFile(file);
      setCoverUrl(url);
      await supabase.from("projects").update({ cover_url: url }).eq("id", project.id);
      onChange();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  async function addImages(files: FileList) {
    setBusy(true);
    try {
      const startOrder = images.length;
      const rows = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadProjectFile(files[i]);
        rows.push({ project_id: project.id, url, sort_order: startOrder + i });
      }
      const { error } = await supabase.from("project_images").insert(rows);
      if (error) throw error;
      refetchImages();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  async function removeImage(id: string) {
    const { error } = await supabase.from("project_images").delete().eq("id", id);
    if (error) return alert(error.message);
    refetchImages();
  }

  async function updateImageMeta(id: string, patch: { caption?: string; note?: string; caption_size?: number; note_size?: number }) {
    const { error } = await supabase.from("project_images").update(patch).eq("id", id);
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
        <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
          {images.map((img) => (
            <div key={img.id} className="space-y-2 border border-ink/15 p-3">
              <div className="relative">
                <img src={img.url} alt="" className="block w-full h-auto" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-1 top-1 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-paper"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className={inputCls + " flex-1"}
                  placeholder="Title / description (optional)"
                  defaultValue={img.caption ?? ""}
                  onBlur={(e) => { if (e.target.value !== (img.caption ?? "")) updateImageMeta(img.id, { caption: e.target.value }); }}
                />
                <label className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink-soft">
                  Size
                  <input
                    type="number" min={8} max={72}
                    className="w-14 border-b border-ink bg-transparent py-1 text-sm outline-none"
                    defaultValue={img.caption_size ?? 14}
                    onBlur={(e) => { const n = parseInt(e.target.value, 10); if (n && n !== img.caption_size) updateImageMeta(img.id, { caption_size: n }); }}
                  />
                </label>
              </div>
              <div className="flex items-start gap-2">
                <textarea
                  className={inputCls + " flex-1"}
                  rows={2}
                  placeholder="Thought process (optional)"
                  defaultValue={img.note ?? ""}
                  onBlur={(e) => { if (e.target.value !== (img.note ?? "")) updateImageMeta(img.id, { note: e.target.value }); }}
                />
                <label className="flex items-center gap-1 pt-2 text-[10px] uppercase tracking-widest text-ink-soft">
                  Size
                  <input
                    type="number" min={8} max={72}
                    className="w-14 border-b border-ink bg-transparent py-1 text-sm outline-none"
                    defaultValue={img.note_size ?? 14}
                    onBlur={(e) => { const n = parseInt(e.target.value, 10); if (n && n !== img.note_size) updateImageMeta(img.id, { note_size: n }); }}
                  />
                </label>
              </div>
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

/* ----------------------------- Content Tab ----------------------------- */

function ContentTab() {
  const qc = useQueryClient();
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
  });
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // sync when first loaded
  useEffect(() => { setDraft(settings); }, [settings]);

  async function saveSection<K extends keyof SiteSettings>(key: K) {
    setBusy(key); setMsg(null);
    try {
      await updateSetting(key, draft[key]);
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      setMsg(`Saved ${key}.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to save");
    } finally { setBusy(null); }
  }

  function patch<K extends keyof SiteSettings>(key: K, value: Partial<SiteSettings[K]>) {
    setDraft((d) => ({ ...d, [key]: { ...(d[key] as object), ...value } as SiteSettings[K] }));
  }

  return (
    <div className="space-y-12">
      {msg && <p className="text-sm text-ink-soft">{msg}</p>}

      <Section title="Site identity">
        <Field label="Site name">
          <input className={inputCls} value={draft.site.name}
            onChange={(e) => patch("site", { name: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <input className={inputCls} value={draft.site.tagline}
            onChange={(e) => patch("site", { tagline: e.target.value })} />
        </Field>
        <SaveBtn busy={busy === "site"} onClick={() => saveSection("site")} />
      </Section>

      <Section title="Home">
        <Field label="Eyebrow (small text above headline)">
          <input className={inputCls} value={draft.home.eyebrow}
            onChange={(e) => patch("home", { eyebrow: e.target.value })} />
        </Field>
        <Field label="Headline (use line breaks for multi-line)">
          <textarea className={inputCls} rows={3} value={draft.home.headline}
            onChange={(e) => patch("home", { headline: e.target.value })} />
        </Field>
        <Field label="Intro paragraph">
          <textarea className={inputCls} rows={3} value={draft.home.intro}
            onChange={(e) => patch("home", { intro: e.target.value })} />
        </Field>
        <Field label="Selected work label">
          <input className={inputCls} value={draft.home.featuredLabel}
            onChange={(e) => patch("home", { featuredLabel: e.target.value })} />
        </Field>
        <SaveBtn busy={busy === "home"} onClick={() => saveSection("home")} />
      </Section>

      <Section title="About">
        <Field label="Heading">
          <input className={inputCls} value={draft.about.heading}
            onChange={(e) => patch("about", { heading: e.target.value })} />
        </Field>
        <Field label="Body (line break = paragraph break)">
          <textarea className={inputCls} rows={8} value={draft.about.body}
            onChange={(e) => patch("about", { body: e.target.value })} />
        </Field>
        <Field label="Side note">
          <input className={inputCls} value={draft.about.sideNote}
            onChange={(e) => patch("about", { sideNote: e.target.value })} />
        </Field>
        <Field label="Portrait image">
          {draft.about.portraitUrl && (
            <img src={draft.about.portraitUrl} alt="portrait" className="mb-3 max-h-48 border border-ink/15" />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const url = await uploadProjectFile(f);
                  patch("about", { portraitUrl: url });
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Upload failed");
                }
                e.target.value = "";
              }}
            />
            {draft.about.portraitUrl && (
              <button type="button" onClick={() => patch("about", { portraitUrl: "" })}
                className="text-xs uppercase tracking-widest text-red-700 link-underline">
                Remove
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-soft">Leave empty to hide the portrait on the About page.</p>
        </Field>
        <SaveBtn busy={busy === "about"} onClick={() => saveSection("about")} />
      </Section>

      <Section title="Contact">
        <Field label="Heading">
          <input className={inputCls} value={draft.contact.heading}
            onChange={(e) => patch("contact", { heading: e.target.value })} />
        </Field>
        <Field label="Intro">
          <textarea className={inputCls} rows={3} value={draft.contact.intro}
            onChange={(e) => patch("contact", { intro: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className={inputCls} value={draft.contact.email}
            onChange={(e) => patch("contact", { email: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className={inputCls} value={draft.contact.location}
            onChange={(e) => patch("contact", { location: e.target.value })} />
        </Field>
        <SaveBtn busy={busy === "contact"} onClick={() => saveSection("contact")} />
      </Section>

      <Section title="Footer">
        <Field label="Footer line">
          <input className={inputCls} value={draft.footer.line}
            onChange={(e) => patch("footer", { line: e.target.value })} />
        </Field>
        <SaveBtn busy={busy === "footer"} onClick={() => saveSection("footer")} />
      </Section>
    </div>
  );
}

/* ----------------------------- Theme Tab ----------------------------- */

function ThemeTab() {
  const qc = useQueryClient();
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
  });
  const [theme, setTheme] = useState(settings.theme);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { setTheme(settings.theme); }, [settings.theme]);

  async function save() {
    setBusy(true); setMsg(null);
    try {
      await updateSetting("theme", theme);
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      setMsg("Theme saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  function reset() {
    setTheme(DEFAULT_SETTINGS.theme);
  }

  return (
    <div className="space-y-10">
      <p className="text-sm text-ink-soft max-w-2xl">
        Change colors live. Paper is the background, Ink is the foreground / primary text,
        Ink Soft is the muted/secondary text, Accent is reserved for highlights.
      </p>

      <div className="grid gap-8 md:grid-cols-2 max-w-2xl">
        <ColorField label="Paper (background)" value={theme.paper}
          onChange={(v) => setTheme({ ...theme, paper: v })} />
        <ColorField label="Ink (foreground)" value={theme.ink}
          onChange={(v) => setTheme({ ...theme, ink: v })} />
        <ColorField label="Ink Soft (muted text)" value={theme.inkSoft}
          onChange={(v) => setTheme({ ...theme, inkSoft: v })} />
        <ColorField label="Accent" value={theme.accent}
          onChange={(v) => setTheme({ ...theme, accent: v })} />
        <ColorField label="Caption background" value={theme.captionBg}
          onChange={(v) => setTheme({ ...theme, captionBg: v })} />
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-ink-soft">Nav text size (Index / Work / About / Contact)</span>
          <div className="mt-2 flex items-center gap-3">
            <input type="number" min={10} max={40} value={theme.navSize ?? 14}
              onChange={(e) => setTheme({ ...theme, navSize: parseInt(e.target.value, 10) || 14 })}
              className="w-20 border-b border-ink bg-transparent py-2 outline-none" />
            <span className="text-xs text-ink-soft">px</span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-ink-soft">Category label size (Typography / Cover Art / Designs)</span>
          <div className="mt-2 flex items-center gap-3">
            <input type="number" min={16} max={200} value={theme.categorySize ?? 60}
              onChange={(e) => setTheme({ ...theme, categorySize: parseInt(e.target.value, 10) || 60 })}
              className="w-20 border-b border-ink bg-transparent py-2 outline-none" />
            <span className="text-xs text-ink-soft">px</span>
          </div>
        </label>
      </div>

      <div className="border border-ink/15 p-8" style={{ background: theme.paper, color: theme.ink }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: theme.inkSoft }}>Preview</p>
        <p className="mt-3 font-display text-4xl uppercase">Aa — The quick brown fox</p>
        <p className="mt-3 text-sm" style={{ color: theme.inkSoft }}>
          Smaller muted text rendered with the chosen palette.
        </p>
        <span className="mt-4 inline-block border px-4 py-2 text-xs uppercase tracking-widest"
          style={{ borderColor: theme.ink, background: theme.accent, color: theme.paper }}>
          Accent button
        </span>
      </div>

      {msg && <p className="text-sm text-ink-soft">{msg}</p>}

      <div className="flex gap-4">
        <button onClick={save} disabled={busy}
          className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper disabled:opacity-50">
          {busy ? "Saving…" : "Save theme"}
        </button>
        <button onClick={reset} type="button"
          className="border border-ink px-6 py-3 text-xs uppercase tracking-widest">
          Reset to default
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- Shared ----------------------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-ink p-6 md:p-8 space-y-5">
      <h3 className="font-display text-2xl uppercase">{title}</h3>
      {children}
    </section>
  );
}

function SaveBtn({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={busy}
      className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper disabled:opacity-50">
      {busy ? "Saving…" : "Save"}
    </button>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink-soft">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer border border-ink/15 bg-transparent p-0" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="block flex-1 border-b border-ink bg-transparent py-2 font-mono text-sm outline-none" />
      </div>
    </label>
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
