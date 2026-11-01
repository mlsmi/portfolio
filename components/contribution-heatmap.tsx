import type { ContributionDay } from "@/lib/github/types";

const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const LEFT_GUTTER = 30;
const TOP_GUTTER = 18;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_ROWS: Array<{ row: number; label: string }> = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
];

function utcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function prettyDate(iso: string): string {
  const d = utcDate(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

type Cell = ContributionDay & { week: number; row: number };

/**
 * GitHub-style calendar: weeks as columns, Sunday-first rows. Pure
 * server-rendered SVG; counts ride on native <title> tooltips and the
 * section's caption, so the color scale is never the only encoding.
 */
export function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
  if (days.length === 0) return null;

  const firstDow = utcDate(days[0].date).getUTCDay();
  const cells: Cell[] = days.map((day, i) => {
    const offset = firstDow + i;
    return { ...day, week: Math.floor(offset / 7), row: offset % 7 };
  });
  const weeks = cells[cells.length - 1].week + 1;

  // One label where a month first appears, skipping crowded repeats.
  const monthLabels: Array<{ week: number; label: string }> = [];
  let lastMonth = -1;
  for (const cell of cells) {
    const m = utcDate(cell.date).getUTCMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      const prev = monthLabels[monthLabels.length - 1];
      if (!prev || cell.week - prev.week >= 3) {
        monthLabels.push({ week: cell.week, label: MONTHS[m] });
      }
    }
  }

  const width = LEFT_GUTTER + weeks * PITCH - GAP;
  const height = TOP_GUTTER + 7 * PITCH - GAP;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ minWidth: width, maxWidth: width }}
        role="img"
        aria-label="Calendar of daily GitHub contributions over the last year"
        shapeRendering="crispEdges"
      >
        {monthLabels.map(({ week, label }) => (
          <text
            key={`${label}-${week}`}
            x={LEFT_GUTTER + week * PITCH}
            y={10}
            className="fill-[var(--faint)] font-mono text-[9px]"
          >
            {label}
          </text>
        ))}
        {WEEKDAY_ROWS.map(({ row, label }) => (
          <text
            key={label}
            x={0}
            y={TOP_GUTTER + row * PITCH + CELL - 2}
            className="fill-[var(--faint)] font-mono text-[9px]"
          >
            {label}
          </text>
        ))}
        {cells.map((cell) => (
          <rect
            key={cell.date}
            x={LEFT_GUTTER + cell.week * PITCH}
            y={TOP_GUTTER + cell.row * PITCH}
            width={CELL}
            height={CELL}
            fill={`var(--heat-${cell.level})`}
          >
            <title>{`${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${prettyDate(cell.date)}`}</title>
          </rect>
        ))}
      </svg>
    </div>
  );
}

export function HeatmapLegend() {
  return (
    <p className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
      Less
      {[0, 1, 2, 3, 4].map((level) => (
        <span
          key={level}
          aria-hidden
          className="inline-block size-[11px]"
          style={{ background: `var(--heat-${level})` }}
        />
      ))}
      More
    </p>
  );
}
