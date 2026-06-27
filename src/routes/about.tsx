import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studio / Name" },
      { name: "description", content: "Bio, approach, tools and selected clients." },
      { property: "og:title", content: "About — Studio / Name" },
      { property: "og:description", content: "Bio, approach, tools and selected clients." },
    ],
  }),
  component: About,
});

const SKILLS = ["Typography", "Cover Art", "Editorial Design", "Identity", "Print Production", "Art Direction"];
const TOOLS = ["Glyphs", "InDesign", "Illustrator", "Photoshop", "Risograph", "Letterpress"];
const CLIENTS = ["Independent Record Labels", "Small Presses", "Cultural Institutions", "Independent Magazines"];

function About() {
  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
          <p className="text-xs uppercase tracking-widest text-ink-soft">About</p>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.85] md:text-[9vw]">
            Designer.<br />Hands first,<br />screen second.
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
              At the desk, 2024.
            </figcaption>
          </div>

          <div className="col-span-12 space-y-6 text-base leading-relaxed md:col-span-7">
            <p>
              I'm an independent graphic designer working in print and digital. My practice
              moves between typography, cover art and editorial — projects where letterforms,
              paper and ink are the material.
            </p>
            <p>
              I work slowly, by hand where possible. Each project starts as sketches and
              proofs before anything touches a screen. The result is design that feels made,
              not generated.
            </p>
            <p>
              I take on a small number of commissions each year. If your project has space for
              care and a long view, get in touch.
            </p>

            <div className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">Disciplines</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {SKILLS.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">Tools</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {TOOLS.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">Clients</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {CLIENTS.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
