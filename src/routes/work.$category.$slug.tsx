import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategory, getProject, getProjects, type Category } from "@/data/projects";

export const Route = createFileRoute("/work/$category/$slug")({
  head: ({ params }) => {
    const p = getProject(params.category as Category, params.slug);
    const title = p ? `${p.title} — Studio / Name` : "Project — Studio / Name";
    const desc = p?.blurb ?? "Project detail.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p ? [{ property: "og:image", content: p.cover }, { name: "twitter:image", content: p.cover }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const c = getCategory(params.category);
    if (!c) throw notFound();
    const project = getProject(params.category as Category, params.slug);
    if (!project) throw notFound();
    const siblings = getProjects(params.category as Category);
    const idx = siblings.findIndex((s) => s.slug === project.slug);
    const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
    const next = siblings[(idx + 1) % siblings.length];
    return { project, prev, next, categoryLabel: c.label };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
      <p className="font-display text-3xl uppercase">Project not found</p>
      <Link to="/work" className="link-underline mt-6 inline-block text-sm uppercase tracking-widest">
        ← Back to work
      </Link>
    </div>
  ),
});

function ProjectDetail() {
  const { project, prev, next, categoryLabel } = Route.useLoaderData();

  return (
    <article>
      <header className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
            <Link to="/work" className="link-underline">Work</Link>
            <span>/</span>
            <Link to="/work/$category" params={{ category: project.category }} className="link-underline">
              {categoryLabel}
            </Link>
          </div>
          <h1 className="mt-6 font-display text-[12vw] uppercase leading-[0.85] md:text-[8vw]">
            {project.title}
          </h1>
          <div className="mt-8 grid grid-cols-12 gap-6 border-t border-ink/15 pt-6 text-sm">
            <div className="col-span-6 md:col-span-3">
              <p className="text-xs uppercase tracking-widest text-ink-soft">Year</p>
              <p className="mt-1">{project.year}</p>
            </div>
            <div className="col-span-6 md:col-span-3">
              <p className="text-xs uppercase tracking-widest text-ink-soft">Discipline</p>
              <p className="mt-1 capitalize">{project.category.replace("-", " ")}</p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <p className="text-xs uppercase tracking-widest text-ink-soft">Brief</p>
              <p className="mt-1 text-ink-soft">{project.blurb}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] space-y-10 px-6 py-16 md:px-12 md:py-24">
        {project.gallery.map((src: string, i: number) => (
          <figure key={i} className="bg-paper-soft">
            <img
              src={src}
              alt={`${project.title} — image ${i + 1}`}
              width={1280}
              height={1600}
              loading={i === 0 ? "eager" : "lazy"}
              className="block w-full"
            />
          </figure>
        ))}
      </section>

      <nav className="border-t border-ink/90">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-10 text-sm uppercase tracking-widest md:px-12">
          <Link
            to="/work/$category/$slug"
            params={{ category: prev.category, slug: prev.slug }}
            className="link-underline"
          >
            ← {prev.title}
          </Link>
          <Link
            to="/work/$category/$slug"
            params={{ category: next.category, slug: next.slug }}
            className="link-underline"
          >
            {next.title} →
          </Link>
        </div>
      </nav>
    </article>
  );
}
