export const SITE = {
  name: "Meelis Mikiver",
  handle: "mlsmi",
  role: "Full-Stack Developer & Product Builder",
  description:
    "Full-stack developer and product builder. 14,000+ GitHub contributions in the last year across eight production products: games, directories and AI pipelines, designed, built and run solo.",
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
