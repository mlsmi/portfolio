import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import fallback from "./fallback.json";
import { getGitHubActivity } from "./fetch";

const realFetch = globalThis.fetch;
const env = { ...process.env };

/** A well-formed year of days, `count` contributions each. */
function year(count: number) {
  const start = Date.UTC(2025, 10, 7);
  return Array.from({ length: 365 }, (_, i) => ({
    date: new Date(start + i * 86400000).toISOString().slice(0, 10),
    count,
    level: count === 0 ? 0 : 2,
  }));
}

const sum = (days: { count: number }[]) => days.reduce((n, d) => n + d.count, 0);

/**
 * As the public API answered on 2026-11-08: its `total.lastYear` (14,943)
 * still counted a week the calendar had already dropped; the 365 days it
 * returned summed to 14,805, which is what the profile showed.
 */
const ROLLED_OVER = year(40);
ROLLED_OVER[0].count += 205;
const PUBLIC = { total: { lastYear: 14943 }, contributions: ROLLED_OVER };
const GRAPHQL = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 9587,
          weeks: [{ contributionDays: year(26).map((d) => ({ date: d.date, contributionCount: d.count, contributionLevel: "SECOND_QUARTILE" })) }],
        },
      },
    },
  },
};

/** Stub fetch: the public API and GraphQL each up (a body) or down (null). */
function stub({ publicUp, graphqlUp }: { publicUp: boolean; graphqlUp: boolean }): string[] {
  const hosts: string[] = [];
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = new URL(String(input));
    hosts.push(url.host);
    const up = url.host === "api.github.com" ? graphqlUp : publicUp;
    if (!up) return new Response("down", { status: 503 });
    return Response.json(url.host === "api.github.com" ? GRAPHQL : PUBLIC);
  }) as typeof fetch;
  return hosts;
}

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...env };
});

describe("GitHub activity source order", () => {
  it("uses the public profile even when GITHUB_TOKEN is set (a repo-scoped token undercounts)", async () => {
    process.env.GITHUB_TOKEN = "repo-scoped";
    delete process.env.GITHUB_CALENDAR_TOKEN;
    const hosts = stub({ publicUp: true, graphqlUp: true });
    const r = await getGitHubActivity();
    assert.equal(r.source, "live");
    assert.ok(!hosts.includes("api.github.com"));
  });

  it("shows the sum of the calendar's days, not the API's lagging total", async () => {
    stub({ publicUp: true, graphqlUp: false });
    const r = await getGitHubActivity();
    assert.equal(sum(ROLLED_OVER), 14805);
    assert.equal(r.data.totalLastYear, 14805);
  });

  it("never uses GITHUB_TOKEN for the calendar, even with the public API down", async () => {
    process.env.GITHUB_TOKEN = "repo-scoped";
    delete process.env.GITHUB_CALENDAR_TOKEN;
    const hosts = stub({ publicUp: false, graphqlUp: true });
    const r = await getGitHubActivity();
    assert.equal(r.source, "fallback");
    assert.equal(r.data.totalLastYear, sum(fallback.contributions));
    assert.ok(!hosts.includes("api.github.com"));
  });

  it("falls back to GraphQL with GITHUB_CALENDAR_TOKEN when the public API is down", async () => {
    process.env.GITHUB_CALENDAR_TOKEN = "sees-everything";
    stub({ publicUp: false, graphqlUp: true });
    const r = await getGitHubActivity();
    assert.equal(r.source, "token");
    // The day sum, not GraphQL's own total (9,587 in the stub).
    assert.equal(r.data.totalLastYear, 365 * 26);
  });

  it("serves the committed snapshot with every source down", async () => {
    process.env.GITHUB_CALENDAR_TOKEN = "sees-everything";
    stub({ publicUp: false, graphqlUp: false });
    const r = await getGitHubActivity();
    assert.equal(r.source, "fallback");
    assert.equal(r.data.days.length, fallback.contributions.length);
  });
});
