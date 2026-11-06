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

const PUBLIC = { total: { lastYear: 14769 }, contributions: year(40) };
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
    assert.equal(r.data.totalLastYear, 14769);
    assert.ok(!hosts.includes("api.github.com"));
  });

  it("never uses GITHUB_TOKEN for the calendar, even with the public API down", async () => {
    process.env.GITHUB_TOKEN = "repo-scoped";
    delete process.env.GITHUB_CALENDAR_TOKEN;
    const hosts = stub({ publicUp: false, graphqlUp: true });
    const r = await getGitHubActivity();
    assert.equal(r.source, "fallback");
    assert.equal(r.data.totalLastYear, fallback.total.lastYear);
    assert.ok(!hosts.includes("api.github.com"));
  });

  it("falls back to GraphQL with GITHUB_CALENDAR_TOKEN when the public API is down", async () => {
    process.env.GITHUB_CALENDAR_TOKEN = "sees-everything";
    stub({ publicUp: false, graphqlUp: true });
    const r = await getGitHubActivity();
    assert.equal(r.source, "token");
    assert.equal(r.data.totalLastYear, 9587);
  });

  it("serves the committed snapshot with every source down", async () => {
    process.env.GITHUB_CALENDAR_TOKEN = "sees-everything";
    stub({ publicUp: false, graphqlUp: false });
    const r = await getGitHubActivity();
    assert.equal(r.source, "fallback");
    assert.equal(r.data.days.length, fallback.contributions.length);
  });
});
