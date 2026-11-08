import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { getLiveContributions } from "./contributions";

const realFetch = globalThis.fetch;
const env = { ...process.env };

type Call = { url: string; auth: string | null };

/** Stub fetch: answers GitHub search with the given totals (or a status). */
function stub(answer: (url: string) => { status?: number; total?: number }): Call[] {
  const calls: Call[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const headers = new Headers(init?.headers);
    calls.push({ url, auth: headers.get("authorization") });
    const { status = 200, total } = answer(url);
    return new Response(JSON.stringify({ total_count: total }), { status });
  }) as typeof fetch;
  return calls;
}

const project = (repo: string | undefined, commits: number, prs: number) => ({
  slug: repo ?? "none",
  repo,
  contributions: { commits, prs },
});

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...env };
});

describe("live commit and PR counts", () => {
  it("keeps the snapshot and calls nothing without a token", async () => {
    delete process.env.GITHUB_TOKEN;
    const calls = stub(() => ({ total: 9999 }));
    const r = await getLiveContributions([project("mlsmi/marsrally", 1816, 366)]);
    assert.equal(calls.length, 0);
    assert.equal(r.live, false);
    assert.deepEqual(r.bySlug["mlsmi/marsrally"], { commits: 1816, prs: 366 });
  });

  it("reads whole-repo commit and PR totals with the token", async () => {
    process.env.GITHUB_TOKEN = "user-token";
    const calls = stub((url) => ({ total: url.includes("/search/commits") ? 1900 : 380 }));
    const r = await getLiveContributions([project("mlsmi/marsrally", 1816, 366), project(undefined, 5, 1)]);
    assert.equal(r.live, true);
    assert.deepEqual(r.bySlug["mlsmi/marsrally"], { commits: 1900, prs: 380 });
    assert.deepEqual(r.bySlug.none, { commits: 5, prs: 1 });
    assert.equal(calls.length, 2);
    assert.ok(calls.every((c) => c.auth === "Bearer user-token"));
    const queries = calls.map((c) => decodeURIComponent(new URL(c.url).searchParams.get("q") ?? ""));
    // Whole-repo totals, matching the repo page (agent commits included).
    assert.deepEqual(queries.sort(), ["repo:mlsmi/marsrally author-date:>1970-01-01", "repo:mlsmi/marsrally is:pr"]);
  });

  it("uses GITHUB_TOKEN_<OWNER> for repos under another owner", async () => {
    process.env.GITHUB_TOKEN = "user-token";
    process.env.GITHUB_TOKEN_ACME_LABS = "org-token";
    const calls = stub(() => ({ total: 100 }));
    await getLiveContributions([project("acme-labs/app", 90, 90)]);
    assert.ok(calls.length > 0 && calls.every((c) => c.auth === "Bearer org-token"));
  });

  it("falls back when GitHub refuses or answers implausibly low", async () => {
    process.env.GITHUB_TOKEN = "user-token";
    stub((url) => (url.includes("/search/commits") ? { status: 422 } : { total: 0 }));
    const r = await getLiveContributions([project("mlsmi/agi", 2217, 392)]);
    assert.equal(r.live, false);
    assert.deepEqual(r.bySlug["mlsmi/agi"], { commits: 2217, prs: 392 });
  });
});
