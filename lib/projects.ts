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
  /** Natural image size when not 1600x1000; lead cards show it uncropped. */
  imageSize?: { width: number; height: number };
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
    imageSize: { width: 1600, height: 1122 },
    role: "Engineering lead, 3-person team",
    metrics: [
      { value: "566", label: "AI companions with streaming chat and voice, some with their own Telegram bot" },
      { value: "132,000", label: "pages indexed by Google" },
      { value: "~4,000", label: "Google clicks a day" },
    ],
    highlights: [
      "Payments: 4 gateway integrations for cards and crypto, routed per plan, with signed webhooks and reconciliation crons",
      "Auth orchestration: email codes, Google and Discord OAuth, guest sessions that merge into the account on signup, Telegram account linking",
      "Email automation: Mailgun, SendGrid and SMTP failover with health checks, localized code emails, drip and capture sequences",
      "Chat and voice: streaming LLM chat with model A/B arms and provider failover; voice via Deepgram, ElevenLabs and realtime calls",
      "Group chats: an LLM director picks which of two companions speaks, with a scoring fallback and an energy budget for companion-to-companion banter",
      "Creator platform: users build and publish companions, set credit prices, and earn 70% of fan subscriptions plus tips, paid out in stablecoins",
      "Create wizard: seven steps from AI image and video generation to personality, names and version history",
      "Credit economy: per-action pricing, daily streaks and mystery gifts, server-side locked media, and a no-account Day Pass with claim codes",
      "Memory and realism: facts extracted every turn, session summaries and a nightly profile, proactive messages, multi-bubble replies with reactions",
      "Safety: a real-time classifier, hard blocks, a permanent minor lock, crisis lines for 173 countries and an 18+ gate",
      "Languages: the app runs in 12 languages with right-to-left layout, and companions reply in each user's own language",
      "Growth: database-driven A/B tests, referral rewards and a 50% affiliate program, push notifications and an installable PWA",
      "Free and premium experiences: guests, free users and subscribers get different message caps, media access, content ratings and voice limits, all resolved server-side from one entitlement check, with separate trial limits",
      "Upgrade journey: in-character premium pitches at code-chosen moments with a guard against false claims, refusal cards that route to premium or credits, A/B-tested pricing layouts, promo codes, trials and a cancellation flow",
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
      "Companion generator: casting, reference images, photos and video, on two cron lanes so slow video renders never block the quick steps",
      "AI studio: image and video across Seedream, Grok, Seedance and Kling, shared character reference sets, a safety interlock on explicit references, and a pre-generated media library for in-chat requests",
      "A/B experiments shared with the live site: hashed bucketing for guests and accounts, traffic splits, 18 tests including 13 pricing-page layout variants, significance testing on the create flow",
      "Pricing and credits: plan editing with per-plan payment routing, pricing-page layouts measured against real payments, credit packs, promo codes and a credit-economy P&L",
      "Conversion: upsell notifications with view and click tracking, targeted popup flows, in-site partner ads with AI-generated creatives, and testimonials",
      "Content: landing pages over 5 templates with an AI-agent API (drafts until approved), an on-page chat widget, and a competitor review guide",
      "Outreach: AI agents research and score partner sites and draft emails, an investor-finding agent with an MCP API, affiliate recruiting and application review",
      "Engagement: segmented in-app notifications and drips, capped web push with quiet hours, and Telegram bot management with broadcasts",
      "SEO audit: 59,000 Semrush keywords against weekly Search Console data, with AI page-fit and index checks",
      "Analytics: acquisition, a chat-health funnel, call and conversation analysis, LLM cost per model, a live user map, a chat moderation queue and payment drift detection",
    ],
    stack: ["Next.js", "Supabase", "Seedream", "Seedance", "Kling", "ffmpeg", "deck.gl", "Recharts", "Playwright"],
    lead: true,
    contributions: { commits: 788, prs: 249 },
  },
  {
    slug: "aiwizard",
    name: "aiwizard",
    pitch:
      "AI tools directory where an LLM pipeline researches, writes and fact-checks every listing, and tool owners verify themselves with an embedded badge.",
    url: "https://www.aiwizard.ai",
    metrics: [
      { value: "10,000+", label: "tools reviewed and categorized" },
      { value: "1,000+", label: "categories in a two-level tree" },
      { value: "12,000", label: "pages prerendered on every build, no ISR" },
    ],
    highlights: [
      "Badge verification: owners embed a badge, an automatic check confirms it (rendering JavaScript-built sites when needed), and a daily cron re-checks every verified tool; two misses unverify",
      "Verified tools earn a followed link, a blue check and verified-first placement on every listing; owners claim listings with a personal code carried on the badge",
      "Submit-a-tool pipeline: a submission waits for its badge, then an AI review job writes the listing and screenshots the site and its tutorial steps for admin review",
      "Catalog pipeline: scrape, DeepSeek enrichment with Claude fallback, and import, with an originality gate that rejects any copied 10-word span",
      "Semrush-driven category expansion: LLM assignment and fill passes grow a two-level tree of 1,000+ categories",
      "Supabase security: RLS policies, column grants, SECURITY DEFINER RPCs and a moderation trigger guarding curation fields",
    ],
    stack: ["Next.js", "Tailwind", "Supabase", "DeepSeek", "Claude", "Firecrawl", "Vercel crons"],
    lead: true,
    contributions: { commits: 555, prs: 111 },
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
