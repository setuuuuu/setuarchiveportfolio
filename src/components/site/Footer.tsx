export function Footer() {
  return (
    <footer className="mt-32 border-t border-ink/90 bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl uppercase">Studio / Name</p>
            <p className="mt-2 text-sm text-ink-soft">Independent graphic designer. Available for select commissions.</p>
          </div>
          <div className="text-sm">
            <p className="uppercase tracking-widest text-ink-soft">Elsewhere</p>
            <ul className="mt-3 space-y-1">
              <li><a className="link-underline" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a className="link-underline" href="https://are.na" target="_blank" rel="noreferrer">Are.na</a></li>
              <li><a className="link-underline" href="https://behance.net" target="_blank" rel="noreferrer">Behance</a></li>
            </ul>
          </div>
          <div className="text-sm md:text-right">
            <p className="uppercase tracking-widest text-ink-soft">Contact</p>
            <a className="link-underline mt-3 inline-block" href="mailto:hello@studio.name">hello@studio.name</a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-ink/15 pt-6 text-xs uppercase tracking-widest text-ink-soft md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Studio / Name</span>
          <span>Set in Archivo Black & Hind</span>
        </div>
      </div>
    </footer>
  );
}
