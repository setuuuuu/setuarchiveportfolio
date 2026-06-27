import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CATEGORIES, getCategory, getProjects, type Category } from "@/data/projects";

export const Route = createFileRoute("/work/$category/")({
  head: ({ params }) => {
    const c = getCategory(params.category);
    const title = c ? `${c.label} — Studio / Name` : "Work — Studio / Name";
    const desc = c?.description ?? "Selected work.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const c = getCategory(params.category);
    if (!c) throw notFound();
    return { category: c as { id: Category; label: string; description: string } };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
      <p className="font-display text-3xl uppercase">Unknown category</p>
      <Link to="/work" className="link-underline mt-6 inline-block text-sm uppercase tracking-widest">
        ← Back to work
      </Link>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = getProjects(category.id);

  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
            <Link to="/work" className="link-underline">Work</Link>
            <span>/</span>
            <span>{category.label}</span>
          </div>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.85] md:text-[10vw]">
            {category.label}.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-ink-soft">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No projects in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2">
            {items.map((p) => (
              <Link
                key={p.slug}
                to="/work/$category/$slug"
                params={{ category: p.category, slug: p.slug }}
                className="group block"
              >
                <div className="overflow-hidden bg-paper-soft">
                  <img
                    src={p.cover}
                    alt={p.title}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="block w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display text-lg uppercase">{p.title}</span>
                  <span className="text-xs uppercase tracking-widest text-ink-soft">{p.year}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-24 flex justify-between border-t border-ink/15 pt-8 text-xs uppercase tracking-widest">
          {CATEGORIES.filter((c) => c.id !== category.id).map((c) => (
            <Link
              key={c.id}
              to="/work/$category"
              params={{ category: c.id }}
              className="link-underline"
            >
              → {c.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
