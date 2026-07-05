
## Goal

1. Undo the `BananaCut` animation everywhere.
2. Add an optional `cover_video_url` alongside the existing cover image on projects. Admin can upload both. On the site, the cover image is always shown; clicking it plays the uploaded video inline (image acts as poster/play button). No video → nothing changes, just the image.

## Changes

### Database
- Migration: `ALTER TABLE public.projects ADD COLUMN cover_video_url text NOT NULL DEFAULT ''`.

### Storage / upload helper
- `src/lib/projects-api.ts`: reuse existing `uploadProjectFile` (bucket `work` already accepts any file). No changes needed beyond that; MIME preserved from `file.type`, so mp4/webm work.

### Admin page (`src/routes/_authenticated/admin.tsx`)
- Next to the existing "Cover image" file input for each project, add a "Cover video (optional)" file input.
- On upload, call `uploadProjectFile` and save the returned signed URL into `projects.cover_video_url`.
- Show current video filename + a "Remove video" button that clears the field.

### New component `src/components/CoverMedia.tsx`
- Props: `imageUrl: string`, `videoUrl?: string`, `alt: string`, plus optional `className` / `imgClassName` for layout parity with current `<img>` usages.
- Always renders the `<img>` as the visible cover.
- If `videoUrl` is present: overlay a subtle play button; on click, swap in a `<video controls autoPlay playsInline>` in the same box. A close/×  button returns to the image.
- No autoplay, no hover-play — click is required, matching the request.
- If `videoUrl` is empty: renders just the image (no overlay, no click behavior).

### Replace `BananaCut` usages
Files: `src/routes/index.tsx`, `src/routes/work.index.tsx`, `src/routes/work.$category.index.tsx`, `src/routes/work.$category.$slug.tsx`.
- Remove `BananaCut` imports and the `cover_url ? <img> : <BananaCut />` fallback.
- If `cover_url` is empty, render an empty `bg-paper-soft` box (previous pre-banana behavior).
- On grid tiles: render `<CoverMedia imageUrl={p.cover_url} videoUrl={p.cover_video_url} alt={p.title} />`.
- On the project detail hero: same, with the 16/9 wrapper.
- Delete `src/components/BananaCut.tsx`.

### Types
- `src/data/projects.ts`: add `cover_video_url: string` to `Project`.
- `src/integrations/supabase/types.ts` is regenerated after the migration runs.

## Notes for the user
- Cover image stays the default view everywhere. The video is optional and only plays when clicked.
- Uploads go into the existing private `work` bucket via a long-lived signed URL, same as images.
