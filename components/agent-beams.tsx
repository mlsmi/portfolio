"use client";

import { useEffect, useRef } from "react";

/**
 * The "fleet of AI agents" diagram: Magic UI's Animated Beam
 * (magicui.design/docs/components/animated-beam) without `motion`. The AI
 * tools beam into the hub (the developer), which beams out to what ships.
 *
 * Nodes are ordinary markup; the SVG behind them gets one path per link,
 * an S-curve from node edge to node edge, recomputed whenever the layout
 * changes and written straight to the path elements (no re-render). Each
 * link is a faint base line plus a short glowing dash that runs along it
 * (CSS, app/globals.css .beam-*); with reduced motion only the lines
 * stay. The tools list keeps its list semantics; the hub and outputs
 * restate the copy beside them and are hidden from assistive tech.
 */
export function AgentBeams({ tools, hub, outputs }: { tools: string[]; hub: string; outputs: string[] }) {
  const container = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = container.current;
    const paths = svg.current?.querySelectorAll<SVGPathElement>("[data-link]");
    if (!root || !paths) return;
    const from = Array.from(root.querySelectorAll<HTMLElement>("[data-beam-from]"));
    const to = Array.from(root.querySelectorAll<HTMLElement>("[data-beam-to]"));
    const hubEl = root.querySelector<HTMLElement>("[data-beam-hub]");
    if (!hubEl) return;

    const curve = (sx: number, sy: number, ex: number, ey: number) => {
      const mx = (sx + ex) / 2;
      return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${mx.toFixed(1)} ${sy.toFixed(1)}, ${mx.toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    };

    const layout = () => {
      const box = root.getBoundingClientRect();
      const hub = hubEl.getBoundingClientRect();
      const hubY = hub.top + hub.height / 2 - box.top;
      const ds = [
        ...from.map((el) => {
          const r = el.getBoundingClientRect();
          return curve(r.right - box.left, r.top + r.height / 2 - box.top, hub.left - box.left, hubY);
        }),
        ...to.map((el) => {
          const r = el.getBoundingClientRect();
          return curve(hub.right - box.left, hubY, r.left - box.left, r.top + r.height / 2 - box.top);
        }),
      ];
      paths.forEach((path) => {
        const d = ds[Number(path.dataset.link)];
        if (d) path.setAttribute("d", d);
      });
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(root);
    [...from, ...to, hubEl].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const links = tools.length + outputs.length;
  const delay = (i: number) => (i < tools.length ? i * 0.42 : 1.1 + (i - tools.length) * 0.38);

  return (
    <div ref={container} className="relative grid grid-cols-[auto_auto_auto] items-center justify-between gap-x-6 sm:justify-start sm:gap-x-14">
      <svg ref={svg} aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {Array.from({ length: links }, (_, i) => (
          <g key={i}>
            <path data-link={i} className="beam-base" />
            <path data-link={i} className="beam-dash" pathLength={1} style={{ "--d": `${delay(i)}s` } as React.CSSProperties} />
          </g>
        ))}
      </svg>
      <ul aria-label="AI tooling used daily" className="relative flex flex-col items-end gap-2">
        {tools.map((tool) => (
          <li
            key={tool}
            data-beam-from
            className="border border-line bg-surface px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-muted sm:text-xs"
          >
            {tool}
          </li>
        ))}
      </ul>
      <div
        aria-hidden
        data-beam-hub
        className="beam-hub relative flex size-16 items-center justify-center border border-accent/60 bg-raised font-mono text-xs text-accent sm:size-[4.5rem]"
      >
        {hub}
      </div>
      <ul aria-hidden className="relative flex flex-col items-start gap-3">
        {outputs.map((output) => (
          <li
            key={output}
            data-beam-to
            className="border border-line-strong bg-surface px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap text-ink sm:text-xs"
          >
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}
