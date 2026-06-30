import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/data/projects";
import { fetchAllProjects } from "@/lib/projects-api";
import { useSettings } from "@/hooks/use-settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio / Name — Graphic Designer" },
      { name: "description", content: "Independent graphic design portfolio." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: all = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchAllProjects });
  const { home } = useSettings();
  const featured = all.slice(0, 4);

  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 pb-20 pt-16 md:px-12 md:pb-32 md:pt-24">
          <div className="col-span-12 md:col-span-9">
            <p className="text-xs uppercase tracking-widest text-ink-soft">{home.eyebrow}</p>
            <h1 className="mt-6 font-display text-[12vw] uppercase leading-[0.85] md:text-[8vw] whitespace-pre-line">
              {home.headline}
            </h1>
          </div>
          <div className="col-span-12 mt-10 flex flex-col justify-end md:col-span-3 md:mt-0">
            <p className="text-base text-ink-soft md:text-right">{home.intro}</p>
            <div className="mt-6 md:text-right">
              <Link to="/work" className="link-underline text-sm uppercase tracking-widest">
                See all work →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-12 flex items-baseline justify-between border-b border-ink/15 pb-4">
          <h2 className="font-display text-xl uppercase">{home.featuredLabel}</h2>
          <span className="text-xs uppercase tracking-widest text-ink-soft">{featured.length} pieces</span>
        </div>

        {featured.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No work uploaded yet.{" "}
            <Link to="/auth" className="link-underline">Sign in</Link> to add your first project.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2">
            {featured.map((p, i) => (
              <Link
                key={p.id}
                to="/work/$category/$slug"
                params={{ category: p.category, slug: p.slug }}
                className="group block"
              >
                <div className="overflow-hidden bg-paper-soft aspect-[4/5]">
                  {p.cover_url && (
                    <img
                      src={p.cover_url}
                      alt={p.title}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between text-sm">
                  <span className="font-display text-base uppercase">{p.title}</span>
                  <span className="text-xs uppercase tracking-widest text-ink-soft">
                    {p.year} — {p.category.replace("-", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <p className="text-xs uppercase tracking-widest text-ink-soft">Browse by discipline</p>
          <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-12">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.id}
                to="/work/$category"
                params={{ category: c.id }}
                className="group block border-t border-ink pt-6"
              >
                <span className="text-xs uppercase tracking-widest text-ink-soft">0{i + 1}</span>
                <h3 className="mt-3 font-display text-3xl uppercase group-hover:italic">{c.label}</h3>
                <p className="mt-3 text-sm text-ink-soft">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
