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
    lead: true,
    youtubeId: "jlMZbIT5BWo",
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
    lead: true,
  },
  {
    slug: "agi",
    name: "Alien Goats Invasion",
    pitch:
      "Web3 multiplayer game where NFT goats raid a shared valley, with an on-chain economy that posts itself to X.",
    url: "https://www.aliengoatsinvasion.com",
    metrics: [
      { value: "NFT", label: "holder-gated streaks, crates and daily quests" },
      { value: "On-chain", label: "mints and claims auto-posted to X and Telegram" },
    ],
    stack: ["Next.js", "Three.js", "Colyseus", "Solana", "Metaplex", "Drizzle", "Neon", "Redis"],
  },
  {
    slug: "buybitcoinsmart",
    name: "buybitcoinsmart",
    pitch: "How to buy bitcoin in every country on earth, in ten languages, with a Claude-powered assistant.",
    url: "https://www.buybitcoinsmart.com",
    metrics: [
      { value: "232", label: "country guides" },
      { value: "10", label: "languages, translated by refuter-checked LLM pipelines" },
      { value: "10,500", label: "static pages per build" },
    ],
    stack: ["Next.js", "Tailwind", "Supabase", "Claude", "i18n"],
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
  },
  {
    slug: "aiangels",
    name: "AI Angels",
    pitch: "AI companion platform running as both a website and a Telegram Mini App, paid in Stars and TON.",
    url: "https://www.aiangels.io",
    metrics: [
      { value: "96", label: "locale catalogs" },
      { value: "2", label: "payment rails: Telegram Stars and TON" },
    ],
    stack: ["Next.js", "Telegram Mini Apps", "Prisma", "Supabase", "AI SDK", "Deepgram", "TON"],
  },
  {
    slug: "aiangels-admin",
    name: "AI Angels Studio",
    pitch:
      "Internal AI image studio that keeps generated characters visually consistent across providers and scenes.",
    url: null,
    metrics: [
      { value: "1,844", label: "images across 35 consistent characters" },
      { value: "76", label: "admin API route groups" },
    ],
    stack: ["Next.js", "Seedream", "Supabase", "ffmpeg", "deck.gl"],
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
  },
];
