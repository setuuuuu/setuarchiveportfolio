import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCategory, type Category } from "@/data/projects";
import {
  fetchProjectBySlug,
  fetchProjectsByCategory,
  fetchProjectImages,
} from "@/lib/projects-api";
import { BananaCut } from "@/components/BananaCut";

export const Route = createFileRoute("/work/$category/$slug")({
  head: ({ params }) => {
    const c = getCategory(params.category);
    const title = c ? `${c.label} Project — Studio / Name` : "Project — Studio / Name";
    return {
      meta: [
        { title },
        { name: "description", content: "Project detail." },
        { property: "og:title", content: title },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { category, slug } = Route.useParams();
  const cat = getCategory(category);

  const projectQ = useQuery({
    queryKey: ["project", category, slug],
    queryFn: () => fetchProjectBySlug(category as Category, slug),
  });

  const siblingsQ = useQuery({
    queryKey: ["projects", category],
    queryFn: () => fetchProjectsByCategory(category as Category),
  });

  const imagesQ = useQuery({
    queryKey: ["project-images", projectQ.data?.id],
    queryFn: () => fetchProjectImages(projectQ.data!.id),
    enabled: !!projectQ.data?.id,
  });

  if (projectQ.isLoading) {
    return <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 text-sm text-ink-soft">Loading…</div>;
  }

  const project = projectQ.data;
  if (!project || !cat) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <p className="font-display text-3xl uppercase">Project not found</p>
        <Link to="/work" className="link-underline mt-6 inline-block text-sm uppercase tracking-widest">
          ← Back to work
        </Link>
      </div>
    );
  }

  const siblings = siblingsQ.data ?? [];
  const idx = siblings.findIndex((s) => s.slug === project.slug);
  const prev = siblings.length ? siblings[(idx - 1 + siblings.length) % siblings.length] : null;
  const next = siblings.length ? siblings[(idx + 1) % siblings.length] : null;
  const images = imagesQ.data ?? [];

  return (
    <article>
      <header className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
            <Link to="/work" className="link-underline">Work</Link>
            <span>/</span>
            <Link to="/work/$category" params={{ category: project.category }} className="link-underline">
              {cat.label}
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

        {images.map((img, i) => (
          <figure key={img.id} className="bg-paper-soft">
            <img
              src={img.url}
              alt={img.caption || `${project.title} — image ${i + 1}`}
              loading="lazy"
              className="block w-full"
            />
            {(img.caption || img.note) && (
              <figcaption className="caption-bg mt-0 grid gap-2 p-4 md:grid-cols-12 md:gap-6 md:p-6">
                {img.caption && (
                  <p className="font-medium md:col-span-4" style={{ fontSize: `${img.caption_size || 14}px` }}>{img.caption}</p>
                )}
                {img.note && (
                  <p className="text-ink-soft md:col-span-8" style={{ fontSize: `${img.note_size || 14}px` }}>{img.note}</p>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </section>

      {prev && next && (
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
      )}
    </article>
  );
}
