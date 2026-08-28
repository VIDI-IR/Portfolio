# Portfolio — Vidi Ilham Ramadhan

Personal portfolio site. Next.js 16 (App Router), React 19, Tailwind CSS v4.
No runtime dependencies beyond those three — every effect on the page is CSS.

```bash
pnpm dev      # http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

## Deploying with Docker

```bash
docker compose up --build          # http://localhost:3000
# or without compose:
docker build -t portfolio . && docker run -p 3000:3000 portfolio
```

The build uses `output: "standalone"` (set in `next.config.ts`), which emits a
self-contained server bundle carrying only the `node_modules` the build
actually traced. The runtime stage installs nothing — it copies that bundle and
runs `node server.js`.

Two things that are easy to get wrong and are handled in the Dockerfile:

- **`public/` and `.next/static` are not in the standalone bundle.** Next omits
  them on the assumption a CDN serves them. They are copied in explicitly; miss
  this and you get an unstyled page with a broken image.
- **`HOSTNAME=0.0.0.0` is required.** Next binds localhost by default, which
  inside a container means nothing outside it can connect.

The image runs as an unprivileged `nextjs` user, and `.dockerignore` keeps
`design/` (~34MB of masters) out of the build context.

## Where things live

| Path                          | What it is                                                     |
| ----------------------------- | -------------------------------------------------------------- |
| `app/page.tsx`                | The whole page: CV content at the top, markup below             |
| `app/layout.tsx`              | Root layout, metadata, and the inline no-flash theme script      |
| `app/globals.css`             | Design tokens + every animation, each with the reasoning kept    |
| `app/ui.ts`                   | The only class strings shared across files (focus rings)         |
| `components/site-header.tsx`  | Sticky header: skip link, nav, theme toggle, progress rule       |
| `components/theme-toggle.tsx` | The one client component — needs `"use client"` for the click    |
| `public/`                     | Only what is actually served. Currently one image.               |
| `design/`                     | Image masters. Git-ignored, **not** served or deployed.          |
| `Dockerfile` / `compose.yaml` | Production container. See Deploying above.                       |

Anything used in a single file stays inline in that file. `app/ui.ts` exists
only because those strings are genuinely used in three.

## Editing content

All CV data sits in typed arrays at the top of `app/page.tsx` — `EXPERIENCE`,
`EDUCATION`, `PROJECTS`, `SKILLS`. Adding a project means adding an object;
the markup loops over them and needs no changes.

## The hero photo

`public/profile-web.webp` is generated from the master in `design/`. The crop is
done in CSS, not baked into the file, so it can be retuned without re-exporting:

```ts
const CROP = { x: 800, y: 295, w: 2400, h: 3000 }; // source px of the 4000x6000 frame
```

Those are real pixel coordinates in the master. Landmarks are noted in the
comment above them (pupils sit at y≈1295, which is what puts the eyes on the
upper rule-of-thirds line). The container derives its aspect ratio from `w/h`,
so the frame can never disagree with the crop.

To regenerate the served image after replacing the master:

```bash
python -c "from PIL import Image; Image.open('design/profile.png').resize((1600,2400), Image.LANCZOS).save('public/profile-web.webp','WEBP',quality=80,method=6)"
```

Keep it around 1600x2400. The crop uses 60% of the width and 40% of the height,
so that yields ~960x1200 real pixels behind a ~440px display — about 2.2x, which
holds up on 2x screens without shipping a heavy file.

## Conventions worth knowing before changing things

- **Every animation is guarded twice**: `@supports` and
  `prefers-reduced-motion`. Nothing sets `opacity: 0` outside those guards, so
  browsers without scroll-driven animation get the full content, static.
  Removing a guard silently hides content for roughly one visitor in six.
- **`data-theme` on `<html>` is the source of truth for theming**, set by an
  inline script before first paint. The toggle writes to it; CSS reads it. No
  React state is involved, which is why the correct icon paints immediately.
- **Colour tokens carry their measured contrast ratios in comments.** If you
  change a colour, re-check the pair — several earlier candidates failed WCAG
  AA and were rejected on the numbers.
