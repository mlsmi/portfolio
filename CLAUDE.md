# CLAUDE.md

Pointers for Claude Code sessions working on the portfolio site
(Meelis Mikiver, meelismikiver / mlsmi). Read `README.md` for
architecture, commands and the GitHub-data and contact-form designs.

## Git identity (required)

Before committing, always set (cloud/remote sessions don't inherit it):

```bash
git config user.name "mlsmi"
git config user.email "11808906+mlsmi@users.noreply.github.com"
```

Commits must be authored as **mlsmi**, never as a generic agent identity.

## Workflow: never push to main (owner rule, 2026-11-01)

`main` is production: the Vercel project **portfolio** (team "meelism's
projects") builds and deploys every commit that lands on it. Changes go:

1. Commit on a feature branch and push it.
2. Open a pull request against `main`, with the gate below green.
3. **Stop there. The owner merges PRs himself** (owner rule, 2026-11-01).
   Never merge a PR, and never `git push origin main`, not even a
   fast-forward.

## The gate (run before every PR)

CI is not set up; you are the test runner:

```bash
npm test            # GitHub stat derivations (node:test)
npm run lint
npm run typecheck
npm run build       # route table must show: / with 1d revalidate, only /api/contact dynamic
npm start           # then, in another step:
npm run smoke       # 17 checks against http://localhost:3000
```

## Where things live

- All copy and data: `lib/site-config.ts`, `lib/projects.ts` (8 projects),
  `lib/skills.ts`. Countable project metrics are `live` (README "Live
  project numbers"): `lib/live/` reads them from each site's public files
  per build and daily, never throws, and falls back to
  `lib/live/snapshot.json` (`npm run live:refresh` rewrites it). Commit/PR
  counts go live only with `GITHUB_TOKEN` (and a `repo` on the project).
- GitHub activity: `lib/github/` (token GraphQL → public API →
  committed `fallback.json`; never throws). Refresh the snapshot with the
  curl in README.
- Design: dark single theme locked in `app/globals.css` (one accent,
  `--heat-*` scale for the heatmap, sharp corners). No em or en dashes in
  any user-visible text. No new dependencies without need.
- Effects (README "Effects"): adapted from Aceternity UI and Magic UI as
  dependency-free ports, never pasted with `motion`. Cyan only, sharp corners, every
  animation reduced-motion gated. The card glow is one listener
  (`components/glow-field.tsx`): add `data-glow`, `glow-panel` and a
  `glow-bloom` span to a bordered panel to opt it in. The hero role
  decrypts and the GitHub stats flip client-side, so the server HTML must
  keep the real text and values (smoke checks the role). The hero wall is
  large-screen only with lazy images, so phones never fetch them. The
  Work terminal and the marquee only show real numbers and copy from
  `lib/` (never type fabricated output into the terminal).
- Media: `scripts/capture.ts` recaptures the project screenshots
  (aiwizard, buybitcoinsmart, airdropstop and ilusalong24 in dark mode). The aiangels
  image is an owner-supplied app screenshot, unblurred by owner decision,
  and is never captured: don't add it back to the capture list.
  `scripts/render-mocks.ts` renders the admin-card and OG mocks. Review
  every capture by eye before committing.
- The game cards take an optional `youtubeId` in `lib/projects.ts`:
  click-to-play lite embed (`components/demo-video.tsx`) over the
  screenshot; the CSP's `frame-src` allows only youtube-nocookie.com.
- Contact form sends only when `RESEND_API_KEY` + `CONTACT_TO_EMAIL` are
  set on Vercel; without them it answers 503 by design. Never make it
  fake success.
