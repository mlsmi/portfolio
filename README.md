# meelismikiver.com portfolio

Personal portfolio of Meelis Mikiver ([@mlsmi](https://github.com/mlsmi)):
a single-page, mission-control-styled site built with Next.js 16 (App
Router), React 19, TypeScript and Tailwind CSS v4. Everything prerenders;
the GitHub activity section revalidates daily (ISR) and `/api/contact` is
the one dynamic route.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit
npm test           # unit tests for the GitHub stat derivations
npm run capture    # re-capture live-site screenshots into public/projects/
npm run smoke      # post-build smoke check: npx tsx scripts/smoke.ts [url]
```

## GitHub activity data

`lib/github/fetch.ts` never throws. Source order:

1. **GitHub GraphQL** when `GITHUB_TOKEN` is set (optional; no scopes needed
   for what the public profile already shows).
2. **Public contributions API** (`github-contributions-api.jogruber.de`),
   which mirrors the public profile. The profile includes private
   contributions, so no token is required for the full picture.
3. **`lib/github/fallback.json`**, a committed snapshot, so the page builds
   and revalidates even with every network path down. Refresh it with:
   `curl -s 'https://github-contributions-api.jogruber.de/v4/mlsmi?y=last' > lib/github/fallback.json`

## Contact form

`/api/contact` sends through Resend when configured and **answers 503
honestly when it is not** (the form then points visitors at GitHub and
LinkedIn). To switch it on, set these in Vercel → Project → Settings →
Environment Variables (see `.env.example`):

- `RESEND_API_KEY` (resend.com → API Keys)
- `CONTACT_TO_EMAIL` (where messages are delivered)
- `RESEND_FROM_EMAIL` (optional; defaults to `onboarding@resend.dev`)

Spam handling: a honeypot field answered with a fake success, plus a
per-instance sliding-window rate limit (5 requests / 10 minutes per IP).

## Media

- `public/projects/*.webp` are real captures of the live sites, taken by
  `scripts/capture.ts` (1600x1000 at 2x, compressed to WebP). The AI Angels
  capture blurs imagery via injected CSS to stay safe for work; the admin
  dashboard card and `public/og.png` render from the local HTML mocks in
  `scripts/` via `scripts/render-mocks.ts`.
- The two game cards (`marsrally`, `agi`) accept a `videoSrc` in
  `lib/projects.ts`: a short muted MP4 loop that plays in place of the
  screenshot (`components/project-video.tsx`), with the screenshot as
  poster and a reduced-motion fallback.

## Content

All copy and data live in `lib/site-config.ts`, `lib/projects.ts` and
`lib/skills.ts`. Project metrics are floors ("10,000+", "400+") checked
against each live site, so routine growth never makes them wrong.
