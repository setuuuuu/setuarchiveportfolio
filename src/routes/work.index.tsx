import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/data/projects";
import { fetchAllProjects } from "@/lib/projects-api";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Studio / Name" },
      { name: "description", content: "Typography, cover art and design projects." },
      { property: "og:title", content: "Work — Studio / Name" },
      { property: "og:description", content: "Typography, cover art and design projects." },
    ],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const { data: all = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchAllProjects });

  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
          <p className="text-xs uppercase tracking-widest text-ink-soft">Index — Work</p>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.85] md:text-[10vw]">
            Work,<br />by discipline.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
        {CATEGORIES.map((c, idx) => {
          const items = all.filter((p) => p.category === c.id);
          const preview = items[0];
          return (
            <Link
              key={c.id}
              to="/work/$category"
              params={{ category: c.id }}
              className="group grid grid-cols-12 items-center gap-6 border-b border-ink/15 py-10 last:border-b-0 md:py-16"
            >
              <div className="col-span-12 md:col-span-1">
                <span className="text-xs uppercase tracking-widest text-ink-soft">0{idx + 1}</span>
              </div>
              <div className="col-span-12 md:col-span-5">
                <h2 className="font-display text-5xl uppercase md:text-7xl group-hover:italic">{c.label}</h2>
                <p className="mt-3 max-w-md text-sm text-ink-soft">{c.description}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-ink-soft">{items.length} projects</p>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="overflow-hidden bg-paper-soft aspect-[4/3]">
                  {preview?.cover_url && (
                    <img
                      src={preview.cover_url}
                      alt={preview.title}
                      loading="lazy"
                      className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
