import type { CSSProperties } from "react";

import { ArmOnView } from "@/components/arm-on-view";
import { commitQuery, prQuery } from "@/lib/live/contributions";
import type { Project } from "@/lib/projects";
import { SITE } from "@/lib/site-config";

type Line = { kind: "cmd" | "cont" | "out" | "note"; text: string };

const CHAR_MS = 12;
const OUTPUT_PAUSE_MS = 280;
const NEXT_PAUSE_MS = 520;

/**
 * Terminal, adapted from Magic UI (magicui.design/docs/components/terminal)
 * as server-rendered markup with CSS typing (app/globals.css .term-*).
 *
 * The receipts behind "Commit and PR counts are mine": the README's own
 * GitHub search queries for Mars Rally with their results, and the totals
 * across every project. The numbers are the same ones the cards show
 * (lib/live: live from GitHub with a token, else the committed snapshot). Commands type out in monospace steps when the
 * panel first scrolls into view (ArmOnView); without JS or with reduced
 * motion everything is simply shown.
 */
export function TerminalReceipts({ projects }: { projects: Pick<Project, "slug" | "contributions">[] }) {
  const mars = projects.find((p) => p.slug === "marsrally");
  const repo = `${SITE.handle}/marsrally`;
  const commits = projects.reduce((sum, p) => sum + p.contributions.commits, 0);
  const prs = projects.reduce((sum, p) => sum + p.contributions.prs, 0);

  const lines: Line[] = mars
    ? [
        { kind: "cmd", text: "gh api -X GET search/commits \\" },
        { kind: "cont", text: `    -f q='${commitQuery(repo)}' \\` },
        { kind: "cont", text: "    --jq .total_count" },
        { kind: "out", text: String(mars.contributions.commits) },
        { kind: "cmd", text: "gh api -X GET search/issues \\" },
        { kind: "cont", text: `    -f q='${prQuery(repo)}' \\` },
        { kind: "cont", text: "    --jq .total_count" },
        { kind: "out", text: String(mars.contributions.prs) },
        {
          kind: "note",
          text: `# all ${projects.length} products: ${commits.toLocaleString("en-US")} commits, ${prs.toLocaleString("en-US")} PRs`,
        },
      ]
    : [];

  // Timeline: each typed line starts when the previous one finishes.
  let t = 200;
  const timed = lines.map((line) => {
    const shown = line.kind === "cmd" ? `$ ${line.text}` : line.text;
    const typed = line.kind !== "out";
    const dur = typed ? shown.length * CHAR_MS : 0;
    const start = line.kind === "out" ? t + OUTPUT_PAUSE_MS : line.kind === "cmd" && t > 200 ? t + NEXT_PAUSE_MS : t;
    t = start + dur;
    return { ...line, shown, typed, start, dur };
  });

  return (
    <ArmOnView
      data-glow
      threshold={0.5}
      className="glow-panel border border-line bg-[#060910] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]"
    >
      <span aria-hidden className="glow-bloom" />
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span aria-hidden className="size-2 bg-line-strong" />
        <span aria-hidden className="size-2 bg-line-strong" />
        <span aria-hidden className="size-2 bg-accent/70" />
        <span className="ml-2 font-mono text-[11px] text-faint">github.com/{SITE.handle}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed text-muted sm:p-5 sm:text-xs">
        {timed.map((line, i) => (
          // Inline lines ending in a real newline, so the text copies and
          // indexes as separate lines.
          <span
            key={i}
            className={`term-line ${line.typed ? "term-typed" : "term-out"}`}
            style={{ "--n": line.shown.length, "--t": `${line.start}ms`, "--dur": `${line.dur}ms` } as CSSProperties}
          >
            <span className="term-type">
              {line.kind === "cmd" ? (
                <>
                  <span className="text-accent">$</span> <span className="text-ink">{line.text}</span>
                </>
              ) : line.kind === "cont" ? (
                <span className="text-ink">{line.text}</span>
              ) : line.kind === "out" ? (
                <span className="text-accent">{line.text}</span>
              ) : (
                <span className="text-faint">{line.text}</span>
              )}
            </span>
            {"\n"}
          </span>
        ))}
        <span aria-hidden className="term-cursor" style={{ "--t": `${t + 200}ms` } as CSSProperties} />
      </pre>
    </ArmOnView>
  );
}
