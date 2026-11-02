export type ProjectMetric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  /** One-line pitch under the name. */
  pitch: string;
  /** Live site; null for internal systems. */
  url: string | null;
  /** 2-3 headline metrics, mono value + short label. */
  metrics: ProjectMetric[];
  stack: string[];
  /** The owner's own commits (default branch) and PRs opened. */
  contributions: { commits: number; prs: number };
  /** Set for team projects, shown under the name; absent means solo. */
  role?: string;
  /** Optional capability list under the metrics, for integration depth. */
  highlights?: string[];
  /** Lead projects render large with a video slot. */
  lead?: boolean;
  /** Gameplay video: click-to-play YouTube embed over the screenshot. */
  youtubeId?: string;
};

export function projectImage(slug: string): string {
  return `/projects/${slug}.webp`;
}

/**
 * Facts verified against each project's repository (2026-11). Metrics use
 * floors ("5,700+", "~800") so routine growth never makes them wrong.
 *
 * `contributions` is a snapshot from GitHub search on 2026-11-02: commits
 * on the default branch authored as mlsmi, and PRs opened by mlsmi. The
 * refresh queries are in README.md.
 */
export const PROJECTS: Project[] = [
  {
    slug: "marsrally",
    name: "Mars Rally Championship",
    pitch:
      "Browser rally racing on Mars: deterministic physics, online multiplayer and server-verified leaderboards.",
    url: "https://marsrallychampionship.com",
    metrics: [
      { value: "60 Hz", label: "deterministic physics, every run re-simulated server-side" },
      { value: "8", label: "players per online race, with spectators and chat" },
      { value: "1080p", label: "replays rendered to video in the browser" },
    ],
    stack: ["Next.js", "Three.js", "Colyseus", "WebCodecs", "Supabase", "Solana"],
    contributions: { commits: 1771, prs: 355 },
    lead: true,
    youtubeId: "jlMZbIT5BWo",
  },
  {
    slug: "aiangels",
    name: "AI Angels",
    pitch:
      "AI companion platform on the web and Telegram. I lead its engineering: architecture decisions, code reviews and a three-person team.",
    url: "https://www.aiangels.io",
    role: "Engineering lead, 3-person team",
    metrics: [
      { value: "566", label: "AI companions with streaming chat and voice, some with their own Telegram bot" },
      { value: "132,000", label: "pages indexed by Google" },
      { value: "~4,000", label: "Google clicks a day" },
    ],
    highlights: [
      "4 payment gateway integrations for cards and crypto, routed per plan, with signed webhooks and reconciliation crons",
      "Auth orchestration: email codes, Google and Discord OAuth, guest sessions that merge into the account on signup, Telegram account linking",
      "Email automation: Mailgun, SendGrid and SMTP failover with health checks, localized code emails, drip and capture sequences",
      "Streaming LLM chat with model A/B arms and provider failover; voice via Deepgram, ElevenLabs and realtime calls",
    ],
    stack: ["Next.js", "Supabase", "Prisma", "Vercel AI SDK", "xAI Grok", "Deepgram", "Telegram bots"],
    lead: true,
    contributions: { commits: 4862, prs: 932 },
  },
  {
    slug: "aiangels-admin",
    name: "AI Angels Admin Dashboard",
    pitch:
      "The operations platform behind AI Angels: an AI image and video studio, an automated companion generator, SEO audits against Search Console, pricing, outreach, cost tracking and a live user map.",
    url: null,
    role: "Engineering lead, 3-person team",
    metrics: [
      { value: "89", label: "admin pages across 7 areas, on 477 API routes" },
      { value: "16", label: "cron pipelines for generation, SEO and analytics" },
      { value: "40,000+", label: "SEO video compilations and 11,700+ images" },
    ],
    highlights: [
      "Automated companion generator: casting, reference images, photos and video, on two cron lanes so slow video renders never block the quick steps",
      "AI image and video studio across Seedream, Grok, Seedance and Kling, with shared character reference sets and a safety interlock on explicit references",
      "SEO audit: 59,000 Semrush keywords against weekly Search Console data, with AI page-fit and index checks",
      "Live operations: deck.gl user map, LLM cost dashboards, a chat moderation queue and payment drift detection",
    ],
    stack: ["Next.js", "Supabase", "Seedream", "Seedance", "Kling", "ffmpeg", "deck.gl", "Recharts", "Playwright"],
    lead: true,
    contributions: { commits: 788, prs: 249 },
  },
  {
    slug: "agi",
    name: "Alien Goats Invasion",
    pitch:
      "Multiplayer RPG in a rebuilt Bay Area. Fight from the Mission past the Golden Gate Bridge, Stanford's Hoover Tower and Sand Hill Road to a boss on Alcatraz. Your rarest NFT goat becomes your character.",
    url: "https://www.aliengoatsinvasion.com",
    metrics: [
      { value: "8", label: "skills levelling to 99 from XP: combat, woodcutting, fishing, cooking" },
      { value: "14", label: "enemy types, from Startup Intern and Crypto Degen to VC Associate and the Board Member boss" },
      { value: "24", label: "regions with ~20 modelled landmarks, 64 players per shared world" },
    ],
    stack: ["Next.js", "Three.js", "Colyseus", "Solana", "Metaplex", "Drizzle", "Neon", "Redis"],
    contributions: { commits: 2217, prs: 392 },
  },
  {
    slug: "buybitcoinsmart",
    name: "buybitcoinsmart",
    pitch:
      "How to buy bitcoin in every country on earth, with a Claude-powered assistant and refuter-checked translations in ten languages.",
    url: "https://www.buybitcoinsmart.com",
    metrics: [
      { value: "50,000", label: "programmatic pages in 10 languages" },
      {
        value: "22",
        label:
          "page types: country guides, payment methods per country, exchange-by-country pages, 659 comparisons, wallet hubs, US states, tax and licence guides",
      },
      { value: "~140/day", label: "Google clicks three months after relaunch, zero paid SEO" },
    ],
    stack: ["Next.js", "Tailwind", "Supabase", "Claude", "i18n"],
    contributions: { commits: 2676, prs: 146 },
  },
  {
    slug: "aiwizard",
    name: "aiwizard",
    pitch: "AI tools directory where listings are researched, written and fact-checked by an LLM pipeline.",
    url: "https://www.aiwizard.ai",
    metrics: [
      { value: "10,000+", label: "tools reviewed and categorized" },
      { value: "1,000+", label: "categories, fully prerendered on every build" },
    ],
    stack: ["Next.js", "Tailwind", "Supabase", "DeepSeek", "Claude"],
    contributions: { commits: 555, prs: 111 },
  },
  {
    slug: "airdropstop",
    name: "AirdropStop",
    pitch:
      "Crypto airdrop directory rebuilt from a lost database, where an AI pipeline sources every fact to a quote.",
    url: "https://www.airdropstop.com",
    metrics: [
      { value: "317", label: "verified listings" },
      { value: "0", label: "databases: the repo is the CMS" },
    ],
    stack: ["Next.js", "Tailwind", "Firecrawl", "Claude"],
    contributions: { commits: 272, prs: 15 },
  },
  {
    slug: "ilusalong24",
    name: "Ilusalong24",
    pitch: "Estonia's beauty clinic directory, prerendered in four languages with hand-tuned grammar for each.",
    url: "https://ilusalong24.ee",
    metrics: [
      { value: "400+", label: "editor-checked salons across 10 service categories" },
      { value: "4", label: "languages with hand-authored place-name grammar" },
      { value: "9,600", label: "routes prerendered per build" },
    ],
    stack: ["Next.js", "Supabase", "next-intl", "Vercel"],
    contributions: { commits: 436, prs: 141 },
  },
];
