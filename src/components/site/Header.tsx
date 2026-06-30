import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";

const NAV = [
  { to: "/", label: "Index" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { site } = useSettings();

  return (
    <header className="border-b border-ink/90 bg-paper">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        <Link
          to="/"
          className="font-display text-lg uppercase tracking-tight"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>
        <nav className="hidden gap-10 text-sm uppercase tracking-widest md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "link-underline font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-xs uppercase tracking-widest"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/90 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to} className="border-b border-ink/15 last:border-b-0">
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-sm uppercase tracking-widest"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
