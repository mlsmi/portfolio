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

1. **Public contributions API** (`github-contributions-api.jogruber.de`),
   which mirrors the public profile. The profile includes private
   contributions, so no token is required for the full picture, and the
   site shows exactly the profile's number.
2. **GitHub GraphQL**, only if the public API fails and only with
   `GITHUB_CALENDAR_TOKEN` set (optional). GraphQL counts only what its
   token can see, so it must be a token that sees every repo you contribute
   to. It deliberately never uses `GITHUB_TOKEN`: that token is scoped to
   the project repos for commit counts and would undercount by thousands
   (it showed 9,587 instead of 14,769).
3. **`lib/github/fallback.json`**, a committed snapshot, so the page builds
   and revalidates even with every network path down. Refresh it with:
   `curl -s 'https://github-contributions-api.jogruber.de/v4/mlsmi?y=last' > lib/github/fallback.json`

## Live project numbers

The countable numbers on the project cards (tools, airdrops, pages,
salons, companions) are read from each project's own public files, so
they stay current without hand edits. `lib/live/` fetches them in the page
render: on every build, and again with the page's daily revalidation.
**No environment variables are needed for these.**

| Project | Numbers | Source |
| --- | --- | --- |
| AirdropStop | airdrops tracked, live now | `llms.txt` summary line |
| aiwizard | tools; categories and pages | `llms-full.txt`; `sitemap.xml` |
| buybitcoinsmart | pages, page types, languages, comparisons | the base-language sitemaps of its sitemap index (hreflang alternates count every language) |
| Ilusalong24 | salons, towns | the homepage stats strip |
| AI Angels | companions | `/chat/<slug>` pages in its sitemaps |

Fallbacks: every number starts as the committed `lib/live/snapshot.json`
and is replaced only by a plausible live value (near the snapshot), so a
site being down or changing its format never breaks the build or shows a
wrong number. `npm run live:refresh` re-reads every source and rewrites the
snapshot (`-- --check` only prints). Google figures (indexed pages, clicks a
day) have no public source and stay hand-edited in `lib/projects.ts`.

In `lib/projects.ts` a metric is either static (`value`) or live
(`live: "aiwizard.tools"`), and labels can carry tokens like
`{bbs.languages}`.

### Live commit and PR counts (needs a token)

The repos are private, so live commit and PR counts need a read-only
GitHub token; without one the snapshot in `lib/projects.ts` stands.

1. github.com → Settings → Developer settings → Fine-grained tokens →
   Generate. Resource owner: `mlsmi`. Repository access: the project repos.
   Permissions (read-only): **Contents**, **Pull requests**, **Metadata**.
2. Vercel → portfolio → Settings → Environment Variables: add
   `GITHUB_TOKEN` (Production and Preview), then redeploy.
3. A fine-grained token covers one owner. For repos under an organisation
   add `GITHUB_TOKEN_<OWNER>` too (e.g. `GITHUB_TOKEN_ACME_LABS` for
   `acme-labs/...`).

Each project with a `repo` in `lib/projects.ts` is refreshed (mapped:
marsrally, agi, airdropstop, aiwizard, buybitcoinsmart →
`mlsmi/buybtcsmart`, ilusalong24 → `mlsmi/ilukliinikud`; the token needs
exactly these six repos). To cover AI Angels or its admin dashboard, add
`repo: "owner/name"` to that project (and a `GITHUB_TOKEN_<OWNER>` if
the repo lives under an organisation). This token is not used for the
contribution heatmap (see "GitHub activity data").

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

## Analytics

Vercel Web Analytics (`@vercel/analytics`, mounted in `app/layout.tsx`):
cookieless page-view counts, visitors, referrers, countries and devices.
In production the script and its beacons are same-origin
(`/_vercel/insights/*`). It records only once Web Analytics is enabled
for the project: Vercel dashboard → portfolio → Analytics → Enable. Views
appear there; local and preview builds don't count.

## Media

- `public/projects/*.webp` are real captures of the live sites, taken by
  `scripts/capture.ts` (1600x1000 at 2x, compressed to WebP). The AI Angels
  image is an app screenshot supplied by the owner, not captured; the admin
  dashboard card and `public/og.png` render from the local HTML mocks in
  `scripts/` via `scripts/render-mocks.ts`.
- The game cards (`marsrally`, `agi`) accept a `youtubeId` in
  `lib/projects.ts`: the screenshot gets a "Play demo" button and the
  YouTube iframe (privacy-enhanced youtube-nocookie.com) mounts only on
  click (`components/demo-video.tsx`), so nothing loads from YouTube
  until a visitor asks for it.

## Effects

The motion and hover effects are adapted from
[Aceternity UI](https://ui.aceternity.com/components) and
[Magic UI](https://magicui.design/docs/components) and ported without
their `motion` dependency: CSS in `app/globals.css`, plus small client
components that write CSS variables or DOM attributes instead of
re-rendering. All of them use the one cyan accent, and all of them sit
behind `prefers-reduced-motion`.

| Where | Aceternity source | Implementation |
| --- | --- | --- |
| Header | Resizable Navbar | `components/site-header.tsx`, `.site-bar`; the pill rests on the section in view (`aria-current`), and a hairline shows scroll progress |
| Hero backdrop | Spotlight New, Grid Background | `components/hero.tsx`, `.spotlight-*`, `.hero-grid` |
| Hero monitor wall | 3D Marquee | `components/hero-wall.tsx`, `.wall-*` (large screens only, lazy images) |
| Hero role, "agents" in the hero copy | Encrypted Text | `components/encrypted-text.tsx` (server HTML keeps the real text; "agents" decrypts after the pointer box lands and replays on hover) |
| Hero phrase | Pointer Highlight | `components/pointer-highlight.tsx`, `.ph-*` |
| Hero CTA | Moving Border | `components/moving-border-link.tsx`, `.orbit-*` |
| Project cards, heatmap, contact form | Glowing Effect, Card Spotlight | `components/glow-field.tsx` (one listener for every `[data-glow]`), `.glow-panel` |
| GitHub stats | Text Flipping Board | `components/flap-value.tsx`, `.flap*` (server HTML keeps the real values) |
| Heatmap | (boot sweep) | `components/heatmap-tooltip.tsx` arms `data-boot`; cells carry `--w` |
| Contact | Hero Highlight dots, Stateful Button | `.dot-field` (lit by GlowField), `components/contact-form.tsx` |
| AI section | Tracing Beam | scroll-driven CSS, `.trace-*` |
| Stack | Card Hover Effect | `components/hover-highlight-grid.tsx`, `components/sliding-highlight.ts` |
| Footer | Text Hover Effect | `components/footer-wordmark.tsx`, `.wordmark-*` |
| Hero name | Magic UI Kinetic Text | `components/kinetic-text.tsx`, `.kinetic` (CSS only, letters stay real text) |
| Hero label | Magic UI Animated Shiny Text | `.shiny-text` |
| Work header | Magic UI Terminal | `components/terminal-receipts.tsx` (numbers from `lib/projects.ts`), `components/arm-on-view.tsx`, `.term-*` |
| Between Work and AI | Magic UI Scroll Based Velocity | `components/velocity-marquee.tsx`, rows in `lib/skills.ts` (`MARQUEE_ROWS`), `.vm-*` |
| AI section | Magic UI Animated Beam | `components/agent-beams.tsx`, `.beam-*` |
| Footer floor | Magic UI Retro Grid | `.retro-*` |

Pointer effects only run with a mouse or pen. Scroll-driven ones fall
back to a static state in browsers without `animation-timeline`.

## Content

All copy and data live in `lib/site-config.ts`, `lib/projects.ts` and
`lib/skills.ts`. Countable project metrics are live (see "Live project
numbers"); static ones that can grow use floors ("~800").

Each card's commit and PR counts (`contributions` in `lib/projects.ts`)
are a snapshot, refreshed live when a token is set (see "Live project
numbers"). The queries (default-branch commits authored by mlsmi, and PRs
opened by mlsmi) also work by hand:

```bash
gh api -X GET search/commits -f q='repo:mlsmi/marsrally author:mlsmi' --jq .total_count
gh api -X GET search/issues -f q='repo:mlsmi/marsrally is:pr author:mlsmi' --jq .total_count
```
