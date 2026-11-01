import fallback from "./fallback.json";
import type { ActivityResult, ContributionData, ContributionDay } from "./types";

const GITHUB_LOGIN = "mlsmi";
const REVALIDATE_SECONDS = 86400; // daily

/**
 * The public profile already includes private contributions (profile
 * setting), so the no-token path shows the full picture. This endpoint
 * serves the same data GitHub renders on the profile page.
 */
const PUBLIC_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_LOGIN}?y=last`;

function isLevel(n: unknown): n is ContributionDay["level"] {
  return typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 4;
}

function isDay(d: unknown): d is ContributionDay {
  if (typeof d !== "object" || d === null) return false;
  const o = d as Record<string, unknown>;
  return (
    typeof o.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(o.date) &&
    typeof o.count === "number" &&
    o.count >= 0 &&
    isLevel(o.level)
  );
}

/** A year of days, every one well-formed — anything less falls back. */
function guard(data: { totalLastYear: unknown; days: unknown }): ContributionData | null {
  const { totalLastYear, days } = data;
  if (typeof totalLastYear !== "number" || !Array.isArray(days)) return null;
  if (days.length < 300 || days.length > 400) return null;
  if (!days.every(isDay)) return null;
  return { totalLastYear, days: days as ContributionDay[] };
}

const FALLBACK: ContributionData = (() => {
  const checked = guard({
    totalLastYear: fallback.total.lastYear,
    days: fallback.contributions,
  });
  if (!checked) throw new Error("lib/github/fallback.json is malformed");
  return checked;
})();

type PublicApiResponse = {
  total?: { lastYear?: unknown };
  contributions?: unknown;
};

async function fetchPublic(): Promise<ContributionData | null> {
  const res = await fetch(PUBLIC_API, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { accept: "application/json" },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as PublicApiResponse;
  return guard({
    totalLastYear: body.total?.lastYear,
    days: body.contributions,
  });
}

const GRAPHQL_LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type GraphQlDay = { date?: unknown; contributionCount?: unknown; contributionLevel?: unknown };
type GraphQlResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: unknown;
          weeks?: { contributionDays?: GraphQlDay[] }[];
        };
      };
    };
  };
};

/**
 * Preferred when GITHUB_TOKEN is set: first-party, and the token's own view
 * of the calendar. No scopes are needed for what the public profile shows.
 */
async function fetchGraphQl(token: string): Promise<ContributionData | null> {
  const query = `query { user(login: "${GITHUB_LOGIN}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as GraphQlResponse;
  const calendar = body.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar?.weeks) return null;
  const days = calendar.weeks.flatMap((w) =>
    (w.contributionDays ?? []).map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: GRAPHQL_LEVELS[String(d.contributionLevel)] ?? 0,
    })),
  );
  return guard({ totalLastYear: calendar.totalContributions, days });
}

/**
 * Never throws and never returns malformed data: token source first when
 * configured, then the public API, then the committed snapshot — so the
 * page builds and revalidates even with every network path down.
 */
export async function getGitHubActivity(): Promise<ActivityResult> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      const data = await fetchGraphQl(token);
      if (data) return { data, source: "token" };
    } catch {
      // fall through
    }
  }
  try {
    const data = await fetchPublic();
    if (data) return { data, source: "live" };
  } catch {
    // fall through
  }
  return { data: FALLBACK, source: "fallback" };
}
