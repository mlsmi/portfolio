import { ContributionHeatmap, HeatmapLegend } from "@/components/contribution-heatmap";
import { busiestDay, dailyAverage, longestStreak } from "@/lib/github/stats";
import type { ActivityResult } from "@/lib/github/types";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site-config";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function StatTile({
  value,
  label,
  sub,
  headline,
}: {
  value: string;
  label: string;
  sub?: string;
  headline?: boolean;
}) {
  return (
    <div
      className={
        headline
          ? "col-span-2 border-t border-line-strong pt-4 md:col-span-3 lg:col-span-2"
          : "border-t border-line pt-4"
      }
    >
      <p className={`nums ${headline ? "text-5xl text-accent sm:text-6xl" : "text-3xl text-ink sm:text-4xl"}`}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-snug text-muted">{label}</p>
      {sub ? <p className="mt-1 font-mono text-xs text-faint">{sub}</p> : null}
    </div>
  );
}

export function GithubActivity({ activity }: { activity: ActivityResult }) {
  const { data, source } = activity;
  const streak = longestStreak(data.days);
  const peak = busiestDay(data.days);
  const avg = dailyAverage(data.days);

  return (
    <section id="activity" aria-labelledby="activity-heading" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <p className="mono-label">GitHub telemetry</p>
      <h2 id="activity-heading" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Always shipping
      </h2>
      <div className="reveal mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-7">
        <StatTile
          value={data.totalLastYear.toLocaleString("en-US")}
          label="contributions in the last year"
          headline
        />
        <StatTile value={String(Math.round(avg))} label="contributions per day, on average" />
        <StatTile
          value={`${streak.length}`}
          label="days, longest shipping streak"
          sub={streak.start && streak.end ? `${shortDate(streak.start)} to ${shortDate(streak.end)}` : undefined}
        />
        <StatTile
          value={peak ? peak.count.toLocaleString("en-US") : "0"}
          label="contributions on the busiest day"
          sub={peak ? shortDate(peak.date) : undefined}
        />
        <StatTile value={String(SITE.activeSince)} label="actively shipping since" />
        <StatTile value={String(PROJECTS.length)} label="products in production" />
      </div>
      <div className="reveal mt-14 border border-line bg-surface p-4 sm:p-6">
        <ContributionHeatmap days={data.days} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-faint">
            {source === "fallback" ? "Cached snapshot of " : "Live from "}
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              github.com/{SITE.handle}
            </a>
            , private contributions included
          </p>
          <HeatmapLegend />
        </div>
      </div>
    </section>
  );
}
