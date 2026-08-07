# Twin Fins Coffee

Two things live here:

| Path | What it is |
| --- | --- |
| `twinfins-redesign/` | **The site.** Next.js 16 (App Router, Turbopack), React 19. |
| `index.html`, `gallery.html`, `m/`, … | Snapshot of the previous live site, kept for reference. Not deployed. |

## Local development

```bash
cd twinfins-redesign
npm install
npm run dev
```

## Deploying to Vercel

**Set the project's Root Directory to `twinfins-redesign`.** This is the one
setting that matters and there is no way to express it in a file — it is a
project setting, chosen in the import dialog or later under *Settings →
General → Root Directory*.

If it is left at the repository root, Vercel finds the old site's
`index.html` sitting there, detects "no framework", and happily deploys the
**previous** site as static HTML. The build succeeds, so nothing warns you;
you just get the wrong site.

With the root directory set, everything else is detected automatically:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Build command | `next build` |
| Install command | `npm install` |
| Output | `.next` |

From the CLI, the equivalent is:

```bash
vercel --cwd twinfins-redesign
```

### Notes

- `next.config.ts` permanently redirects `/gallery` → `/booking#gallery`; the
  gallery was folded into the booking page.
- `images.qualities` is an allow-list. A `<Image quality={n}>` whose `n` is
  not in that list falls back and logs a warning at build time — add the
  value to the list rather than ignoring it.
- No environment variables are required to build or run.
