export const SITE = {
  name: "Meelis Mikiver",
  handle: "mlsmi",
  role: "Full-Stack AI Engineer & SEO Specialist",
  description:
    "Full-stack AI engineer and SEO specialist. Ships customer apps, admin platforms, LLM pipelines and games with agentic AI, then ranks them: 130k+ pages indexed, ~4,000 Google clicks a day.",
  githubUrl: "https://github.com/mlsmi",
  linkedinUrl: "https://ee.linkedin.com/in/meelismikiver",
  /** GitHub account creation date, for the years-on-GitHub stat. */
  accountCreated: "2015-04-05",
  location: "Estonia (EET)",
} as const;

/** Canonical origin: explicit env first, then Vercel's production URL. */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
