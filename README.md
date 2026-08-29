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

`public/profile-{1200,1600,2400,4000}.webp` are generated from
`design/profile-master.png`. The crop is done in CSS, not baked into the file,
so it can be retuned without re-exporting:

```ts
const CROP = { x: 800, y: 295, w: 2400, h: 3000 }; // source px of the 4000x6000 frame
```

Those are real pixel coordinates in the master. Landmarks are noted in the
comment above them (pupils sit at y≈1295, which is what puts the eyes on the
upper rule-of-thirds line). The container derives its aspect ratio from `w/h`,
so the frame can never disagree with the crop.

`design/` is gitignored, so the masters live only on the machine that made
them. Keep a copy. The files there are:

| file | what it is |
| --- | --- |
| `IMG_5784.jpg` | untouched 4000x6000 camera frame, the only real detail there is |
| `profile-enhanced.png` | the colour grade to match, 1023x1537 |
| `profile.png`, `profile-arsip.png` | older grades, kept for reference, not used |
| `profile-master.png` | grade plus detail, what the site ships from |
| `regrade.py` | rebuilds `profile-master.png` and re-exports the four webp files |

Run `python design/regrade.py` after changing either input.

Every graded version of this photo has been a small image scaled up. Laplacian
variance on a 600x600 face patch reads 305.2 on the camera original and 3.8 on
`profile.png`, and `profile-enhanced.png` is 1023x1537 to start with. The site
needs 2400 real pixels across the visible crop, so none of them can be shipped
directly.

So `regrade.py` keeps every pixel of the camera frame and borrows only the
grade, as a smooth per-channel gain map: the ratio of the two images' content
blurred at sigma 32. That carries tone, white balance and saturation without
carrying any detail. It is a gain map rather than a per-pixel merge because the
enhanced file is warped against the camera frame, with matching offsets
drifting from dy=-8 at the face to dy=+2 at the floor. No single alignment
fixes that, and a per-pixel merge would ghost. Blurred at sigma 32, an eight
pixel shift does not matter.

Result: face-patch detail 241.6 against the camera's 305.2, and mean saturation
30.7 against the enhanced file's 30.5.

Four widths, picked by the browser from the `srcset` on the `<img>`. The crop
uses 60% of the width, so a 2400w file puts 1440 real pixels behind a ~440px
panel. A 1x laptop downloads 145 KB, a 2x laptop 217 KB, a 3x phone 380 KB, and
the full 4000x6000 frame (791 KB) is there for anything beyond that.

Do not export from `profile.png` or `profile-enhanced.png` directly. They look
like masters and are not.

`sizes` on that `<img>` is the element's layout width, which is 166.67% of its
panel because the panel is what crops it. If the hero grid ratio or gap change,
`sizes` has to change with them.

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
