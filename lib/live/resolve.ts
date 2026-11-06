import type { Project } from "@/lib/projects";

import { isLiveKey, type LiveValues } from "./keys";

export type ShownMetric = { value: string; label: string };

/** A project as the page shows it: every metric resolved to text. */
export type ShownProject = Omit<Project, "metrics"> & { metrics: ShownMetric[] };

const format = (n: number) => n.toLocaleString("en-US");

/**
 * `{ live: key }` metrics take their value from the numbers, and `{key}`
 * tokens in any label are filled the same way; static metrics pass
 * through. Pure, so it is unit-tested.
 */
export function resolveProject(project: Project, values: LiveValues, contributions?: Project["contributions"]): ShownProject {
  const fill = (label: string) => label.replace(/\{([a-z]+\.[a-z]+)\}/g, (token, key: string) => (isLiveKey(key) ? format(values[key]) : token));
  return {
    ...project,
    contributions: contributions ?? project.contributions,
    metrics: project.metrics.map((metric) => ({
      value: metric.live ? format(values[metric.live]) : (metric.value ?? ""),
      label: fill(metric.label),
    })),
  };
}
