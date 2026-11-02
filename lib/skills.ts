/** `featured` groups are the headline skills: rendered wide, above the rest. */
export type SkillGroup = { name: string; items: string[]; featured?: boolean };

/**
 * Every item is backed by code in one of the eight project repos. Keep the
 * regular (non-featured) groups at a multiple of three so the grid never
 * leaves an orphan tile.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "AI Engineering",
    featured: true,
    items: [
      "Agentic coding with Claude Code, Cursor, Codex and Grok",
      "LLM content pipelines with judge, writer and refuter passes",
      "Claude, DeepSeek, xAI Grok and Mistral via Vercel AI SDK",
      "Streaming chat with model A/B arms and provider failover",
      "AI image and video generation: Seedream, Seedance, Kling, Grok Imagine",
      "Voice AI: Deepgram, ElevenLabs, realtime calls",
      "Agent APIs and MCP servers for AI-written content",
    ],
  },
  {
    name: "SEO & Growth",
    featured: true,
    items: [
      "Programmatic SEO at 130k+ indexed pages",
      "International SEO: 96 locales, reciprocal hreflang",
      "Sharded sitemap indexes, video and image sitemaps",
      "JSON-LD structured data across 15+ schema types",
      "IndexNow, llms.txt and answer-engine optimization",
      "Search Console and Semrush keyword pipelines",
      "Internal-linking engines and thin-content gates",
    ],
  },
  {
    name: "Frontend",
    items: ["TypeScript", "React 19", "Next.js 15/16 App Router", "Tailwind CSS", "next-intl", "Radix and shadcn/ui", "Recharts and deck.gl"],
  },
  {
    name: "Backend & Data",
    items: [
      "PostgreSQL",
      "Supabase (Auth, RLS, RPCs)",
      "Prisma",
      "Drizzle and Neon",
      "Upstash Redis",
      "Vercel crons and background drains",
    ],
  },
  {
    name: "Payments, Auth & Email",
    items: [
      "Multi-gateway payments: Verotel, FlowGuard, Vexutopia",
      "NOWPayments crypto with reconciliation crons",
      "Telegram Stars and TON",
      "Auth: email codes, Google and Discord OAuth, guest-to-account merge",
      "Email: Mailgun, SendGrid and SMTP failover, drip sequences",
      "PostHog analytics and OneSignal push",
      "Firecrawl data harvesting",
    ],
  },
  {
    name: "Realtime, 3D & Media",
    items: [
      "Three.js",
      "Colyseus authoritative servers",
      "Deterministic physics with server re-simulation",
      "WebCodecs video rendering",
      "ffmpeg video pipelines",
    ],
  },
  {
    name: "Web3 & Telegram",
    items: [
      "Telegram Mini Apps",
      "Telegram bots (Bot API)",
      "Solana and Sign-In With Solana",
      "Metaplex NFTs",
      "On-chain event automation",
    ],
  },
  {
    name: "Platform & Ops",
    items: [
      "Vercel at scale (ISR and build economics)",
      "GitHub Actions incl. a self-hosted GPU runner",
      "Playwright and Vitest",
      "Railway WebSocket relays",
      "Admin dashboards and internal tools",
    ],
  },
];

export type AiHighlight = { title: string; body: string; receipts: string[] };

/**
 * The AI-native section's content: tools driven daily, plus pipelines and
 * automations actually running in production across the eight projects.
 */
export const AI_TOOLS = ["Claude Code", "Cursor", "Codex", "Grok", "DeepSeek", "Vercel AI SDK"];

export const AI_HIGHLIGHTS: AiHighlight[] = [
  {
    title: "Agentic coding, directed end to end",
    body: "Claude Code, Cursor, Codex and Grok are daily drivers. The 14,000+ contributions this year were shipped by directing AI agents through real codebases: specs, guardrails, review gates and test suites that keep velocity honest.",
    receipts: ["Claude Code", "Cursor", "Codex", "Grok"],
  },
  {
    title: "LLM pipelines in production",
    body: "Content systems where models research, write and attack each other's work before anything ships: a judge, writer and refuter pipeline sourcing every fact to a quote, review enrichment across 10,000+ tools, and ten-language translation with independent refuters.",
    receipts: ["Claude", "DeepSeek", "Firecrawl", "judge / writer / refuter"],
  },
  {
    title: "Automations that run the business",
    body: "In-house bots and cron agents doing the operating: new records rendered to video on a GPU runner and posted to X, on-chain events cross-posted to Telegram, badge verification sweeps, index submissions and content refreshes, all unattended.",
    receipts: ["GitHub Actions", "cron agents", "X / Telegram bots"],
  },
];
