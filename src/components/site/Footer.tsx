import { useSettings } from "@/hooks/use-settings";

export function Footer() {
  const { site, contact, footer } = useSettings();
  return (
    <footer className="mt-32 border-t border-ink/90 bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl uppercase">{site.name}</p>
            <p className="mt-2 text-sm text-ink-soft">{site.tagline}</p>
          </div>
          <div className="text-sm">
            <p className="uppercase tracking-widest text-ink-soft">Location</p>
            <p className="mt-3">{contact.location}</p>
          </div>
          <div className="text-sm md:text-right">
            <p className="uppercase tracking-widest text-ink-soft">Contact</p>
            <a className="link-underline mt-3 inline-block" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-ink/15 pt-6 text-xs uppercase tracking-widest text-ink-soft md:flex-row md:justify-between">
          <span>{footer.line}</span>
          <span>Set in Archivo Black &amp; Hind</span>
        </div>
      </div>
    </footer>
  );
}
