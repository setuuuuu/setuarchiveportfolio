import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/portrait.jpg";
import { useSettings } from "@/hooks/use-settings";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studio / Name" },
      { name: "description", content: "Bio and approach." },
    ],
  }),
  component: About,
});

function About() {
  const { about } = useSettings();
  const paragraphs = about.body.split(/\n\s*\n|\n/).filter(Boolean);

  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
          <p className="text-xs uppercase tracking-widest text-ink-soft">{about.heading}</p>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.85] md:text-[9vw]">
            {about.heading}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 md:col-span-5">
            <figure className="bg-paper-soft">
              <img
                src={portrait}
                alt="Portrait of the designer"
                width={1024}
                height={1280}
                loading="lazy"
                className="block w-full grayscale"
              />
            </figure>
            <figcaption className="mt-3 text-xs uppercase tracking-widest text-ink-soft">
              {about.sideNote}
            </figcaption>
          </div>

          <div className="col-span-12 space-y-6 text-base leading-relaxed md:col-span-7">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>
    </div>
  );
}
