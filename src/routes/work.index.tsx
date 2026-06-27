import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, getProjects } from "@/data/projects";

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
          const items = getProjects(c.id);
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
                {preview && (
                  <div className="overflow-hidden bg-paper-soft">
                    <img
                      src={preview.cover}
                      alt={preview.title}
                      width={1024}
                      height={1280}
                      loading="lazy"
                      className="block w-full transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
