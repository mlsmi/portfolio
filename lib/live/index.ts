import { unstable_cache } from "next/cache";

import { PROJECTS } from "@/lib/projects";

import { getLiveContributions } from "./contributions";
import { getLiveNumbers } from "./numbers";
import { resolveProject, type ShownProject } from "./resolve";

export type { ShownProject } from "./resolve";

/**
 * The numbers, not the multi-MB bodies behind them, go in the data cache:
 * read once per build and once a day after that, like the page.
 */
const cachedNumbers = unstable_cache(getLiveNumbers, ["live-numbers-v1"], { revalidate: 86400 });

/**
 * The projects with their numbers brought up to date: product counts read
 * from each site's own public files, commit and PR counts from GitHub when
 * a token is configured. Never throws; anything unavailable keeps its
 * committed snapshot (lib/live/snapshot.json, lib/projects.ts).
 */
export async function getLiveProjects(): Promise<{ projects: ShownProject[]; contributionsLive: boolean }> {
  const [numbers, contributions] = await Promise.all([cachedNumbers(), getLiveContributions(PROJECTS)]);
  return {
    projects: PROJECTS.map((p) => resolveProject(p, numbers.values, contributions.bySlug[p.slug])),
    contributionsLive: contributions.live,
  };
}
