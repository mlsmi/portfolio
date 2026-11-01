export type SkillGroup = { name: string; items: string[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "Frontend",
    items: ["TypeScript", "React 19", "Next.js 15/16", "Tailwind CSS 4", "App Router at 10k+ pages", "SEO / structured data"],
  },
  {
    name: "Realtime & 3D",
    items: ["Three.js", "Colyseus multiplayer", "Deterministic physics", "WebCodecs video export", "Canvas / WebGL"],
  },
  {
    name: "Data & Backend",
    items: ["PostgreSQL", "Supabase", "Neon", "Drizzle", "Prisma", "Upstash Redis", "RLS security design"],
  },
  {
    name: "AI Engineering",
    items: ["Claude API & Agent SDK", "DeepSeek", "Vercel AI SDK", "Firecrawl", "LLM pipeline design", "Prompt & eval discipline"],
  },
  {
    name: "Web3 & Telegram",
    items: [
      "Telegram Mini Apps",
      "Telegram bots (Bot API)",
      "Telegram Stars & TON payments",
      "Solana web3.js",
      "Metaplex NFTs",
      "Wallet auth (ed25519)",
      "On-chain event processing",
    ],
  },
  {
    name: "Platform & Ops",
    items: ["Vercel at scale", "ISR / build economics", "GitHub Actions", "Playwright", "i18n architecture", "Web push / PWA"],
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
    body: "Content systems where models research, write and attack each other's work before anything ships: a judge, writer and refuter pipeline sourcing every fact to a quote, review enrichment across 5,700+ tools, and ten-language translation with independent refuters.",
    receipts: ["Claude", "DeepSeek", "Firecrawl", "judge / writer / refuter"],
  },
  {
    title: "Automations that run the business",
    body: "In-house bots and cron agents doing the operating: new records rendered to video on a GPU runner and posted to X, on-chain events cross-posted to Telegram, badge verification sweeps, index submissions and content refreshes, all unattended.",
    receipts: ["GitHub Actions", "cron agents", "X / Telegram bots"],
  },
];
