import type { Project } from "@/lib/projects";

const REVALIDATE_SECONDS = 86400;
const TIMEOUT_MS = 12000;

type Counts = Project["contributions"];

/**
 * The token for a repo's owner: GITHUB_TOKEN_<OWNER> when set (a
 * fine-grained token covers one owner, so repos under an organisation can
 * have their own), else GITHUB_TOKEN.
 */
function tokenFor(owner: string): string | null {
  const own = process.env[`GITHUB_TOKEN_${owner.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`];
  return own || process.env.GITHUB_TOKEN || null;
}

async function totalCount(endpoint: "commits" | "issues", q: string, token: string): Promise<number | null> {
  const url = `https://api.github.com/search/${endpoint}?q=${encodeURIComponent(q)}&per_page=1`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { total_count?: unknown };
  return typeof body.total_count === "number" ? body.total_count : null;
}

/** Counts only grow; a token without access answers 0 or 422, so stay near the snapshot. */
const plausible = (n: number | null, snapshot: number): n is number => n !== null && n >= snapshot * 0.9;

/**
 * Every commit on the default branch: what the repo page's "Commits"
 * counter shows. Commit search needs a search term, and an all-time date
 * range matches every commit. This deliberately counts the whole history,
 * not only commits authored as the owner: commits made by AI agents
 * (Claude Code, Cursor Agent) carry the agents' identities, and GitHub
 * does not credit them to the owner's account.
 */
export const commitQuery = (repo: string) => `repo:${repo} author-date:>1970-01-01`;

/** Every pull request in the repo. */
export const prQuery = (repo: string) => `repo:${repo} is:pr`;

/**
 * Commit and PR totals per project, matching each repo's own counters on
 * GitHub (the terminal on the page types the same queries). Needs a token
 * (the repos are private); without one, or for projects with no `repo`,
 * the committed snapshot stands. Never throws.
 */
export async function getLiveContributions(
  projects: Pick<Project, "slug" | "repo" | "contributions">[],
): Promise<{ bySlug: Record<string, Counts>; live: boolean }> {
  const bySlug: Record<string, Counts> = {};
  let anyLive = false;
  await Promise.all(
    projects.map(async (project) => {
      bySlug[project.slug] = project.contributions;
      if (!project.repo) return;
      const token = tokenFor(project.repo.split("/")[0]);
      if (!token) return;
      try {
        const [commits, prs] = await Promise.all([
          totalCount("commits", commitQuery(project.repo), token),
          totalCount("issues", prQuery(project.repo), token),
        ]);
        const commitsOk = plausible(commits, project.contributions.commits);
        const prsOk = plausible(prs, project.contributions.prs);
        if (commitsOk || prsOk) anyLive = true;
        bySlug[project.slug] = {
          commits: commitsOk ? commits : project.contributions.commits,
          prs: prsOk ? prs : project.contributions.prs,
        };
      } catch (err) {
        console.warn(`[live] contributions ${project.repo}: ${err instanceof Error ? err.message : err}`);
      }
    }),
  );
  return { bySlug, live: anyLive };
}
