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

/**
 * A year of days, every one well-formed — anything less falls back. The
 * headline total is the sum of these days, never a source's own total:
 * the days are exactly the calendar GitHub draws (and counts) right now,
 * while the public API's `total.lastYear` lagged it by a week at the
 * Sunday rollover (14,943 against a day sum of 14,805 on 2026-11-08).
 */
function guard(days: unknown): ContributionData | null {
  if (!Array.isArray(days)) return null;
  if (days.length < 300 || days.length > 400) return null;
  if (!days.every(isDay)) return null;
  const checked = days as ContributionDay[];
  return { totalLastYear: checked.reduce((sum, d) => sum + d.count, 0), days: checked };
}

const FALLBACK: ContributionData = (() => {
  const checked = guard(fallback.contributions);
  if (!checked) throw new Error("lib/github/fallback.json is malformed");
  return checked;
})();

type PublicApiResponse = {
  contributions?: unknown;
};

async function fetchPublic(): Promise<ContributionData | null> {
  const res = await fetch(PUBLIC_API, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { accept: "application/json" },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as PublicApiResponse;
  return guard(body.contributions);
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
          weeks?: { contributionDays?: GraphQlDay[] }[];
        };
      };
    };
  };
};

/**
 * First-party, but only the token's own view of the calendar: contributions
 * in repos the token cannot see drop out. A repo-scoped token (like the
 * GITHUB_TOKEN used for the project cards' commit counts) undercounts by
 * thousands, so this runs only as a fallback, with its own token.
 */
async function fetchGraphQl(token: string): Promise<ContributionData | null> {
  const query = `query { user(login: "${GITHUB_LOGIN}") { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
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
  return guard(days);
}

/**
 * Never throws and never returns malformed data. The public API comes
 * first: it is exactly what the profile shows, private contributions
 * included. Then GraphQL, only with a dedicated GITHUB_CALENDAR_TOKEN
 * (never GITHUB_TOKEN, which is scoped to a few repos and would undercount),
 * then the committed snapshot, so the page builds and revalidates even
 * with every network path down.
 */
export async function getGitHubActivity(): Promise<ActivityResult> {
  try {
    const data = await fetchPublic();
    if (data) return { data, source: "live" };
  } catch {
    // fall through
  }
  const token = process.env.GITHUB_CALENDAR_TOKEN;
  if (token) {
    try {
      const data = await fetchGraphQl(token);
      if (data) return { data, source: "token" };
    } catch {
      // fall through
    }
  }
  return { data: FALLBACK, source: "fallback" };
}
