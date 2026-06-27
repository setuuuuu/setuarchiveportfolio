import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Studio / Name" },
      { name: "description", content: "Get in touch for commissions, collaborations and questions." },
      { property: "og:title", content: "Contact — Studio / Name" },
      { property: "og:description", content: "Get in touch for commissions, collaborations and questions." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [state, setState] = useState<"idle" | "sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sent");
  }

  return (
    <div>
      <section className="border-b border-ink/90">
        <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
          <p className="text-xs uppercase tracking-widest text-ink-soft">Contact</p>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.85] md:text-[10vw]">
            Let's work<br />together.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 md:col-span-5">
            <p className="text-xs uppercase tracking-widest text-ink-soft">Direct</p>
            <a href="mailto:hello@studio.name" className="link-underline mt-3 block font-display text-3xl uppercase md:text-4xl">
              hello@studio.name
            </a>

            <div className="mt-12 space-y-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">Studio</p>
                <p className="mt-2">By appointment.<br />Berlin / Worldwide.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">Elsewhere</p>
                <ul className="mt-2 space-y-1">
                  <li><a className="link-underline" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                  <li><a className="link-underline" href="https://are.na" target="_blank" rel="noreferrer">Are.na</a></li>
                  <li><a className="link-underline" href="https://behance.net" target="_blank" rel="noreferrer">Behance</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            {state === "sent" ? (
              <div className="border-t border-ink py-12">
                <p className="font-display text-2xl uppercase">Message received.</p>
                <p className="mt-3 text-sm text-ink-soft">
                  Thank you — I'll get back to you within a week.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <Field id="name" label="Name" />
                <Field id="email" label="Email" type="email" />
                <Field id="subject" label="Subject" />
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-ink-soft">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="mt-2 block w-full resize-none border-0 border-b border-ink bg-transparent py-2 text-base outline-none focus:border-b-2"
                  />
                </div>
                <button
                  type="submit"
                  className="border border-ink px-8 py-4 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ id, label, type = "text" }: { id: string; label: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className="mt-2 block w-full border-0 border-b border-ink bg-transparent py-2 text-base outline-none focus:border-b-2"
      />
    </div>
  );
}
