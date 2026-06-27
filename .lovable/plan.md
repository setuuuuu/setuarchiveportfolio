
# Minimal Editorial Portfolio

A quiet, print-inspired portfolio in Paper & Ink tones with Archivo Black display type and Hind body — no AI gloss, no gradients, no purple. Heavy use of whitespace, thin rules, and unapologetic black headlines against off-white paper.

## Routes

```
/                 Home / Intro
/work             Work index (links to the 3 categories)
/work/typography  Typography projects
/work/cover-art   Cover art projects
/work/designs     Other design work
/about            Bio, skills, tools
/contact          Email + socials + simple form
```

Each route gets its own `head()` with unique title, description, and OG tags.

## Page intent

- **Home** — Oversized Archivo Black wordmark with your name, a one-line discipline statement, and 3–4 featured pieces in an asymmetric grid. Footer with email + socials.
- **Work index** — Three large category tiles (Typography / Cover Art / Designs) as editorial blocks with a representative image and project count.
- **Category pages** — Clean masonry/uniform grid of project thumbnails. Click opens a project detail view.
- **Project detail** — Large hero image, title, year, brief, then a vertical stack of full-bleed images. Prev/next at the bottom.
- **About** — Two-column editorial layout: portrait + bio on the left, skills/tools/clients list on the right.
- **Contact** — Big "Let's work together" headline, email as a link, socials, and a minimal form (name, email, message).

## Design language

- Palette tokens (oklch in `src/styles.css`): paper `#f5f3ee`, paper-soft `#e8e4dd`, ink `#0d0d0d`, ink-soft `#2d2d2d`.
- Fonts via `@fontsource/archivo-black` and `@fontsource/hind` installed with bun and imported in styles. No Google Fonts CDN.
- Tight black hairline borders (1px ink), generous margins, no rounded corners (radius near 0), no shadows, no gradients.
- Subtle motion only: image fade-in on scroll, underline-on-hover for links. No parallax, no fancy reveals.

## Data

Projects live in a typed TS file (`src/data/projects.ts`) keyed by category, with title, year, blurb, cover, gallery. You'll send work and we'll wire it in. Placeholder content for now — easy to replace per project.

## Technical notes

- TanStack Start file routes under `src/routes/`: `index.tsx`, `work.tsx` (layout w/ `<Outlet/>`), `work.index.tsx`, `work.typography.tsx`, `work.cover-art.tsx`, `work.designs.tsx`, `work.$category.$slug.tsx` (project detail), `about.tsx`, `contact.tsx`.
- Shared `Header` and `Footer` components rendered in `__root.tsx`.
- Tailwind v4 tokens defined in `src/styles.css` under `@theme inline` mapped from `:root` oklch vars.
- Contact form posts to a `createServerFn` that for now just validates and returns success (no email send until you connect a provider).
- All images are placeholders/imports under `src/assets/` — you'll replace them with your real work.
