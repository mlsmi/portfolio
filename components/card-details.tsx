"use client";

import { useId, useState } from "react";

/**
 * Collapsible details strip for a lead project card. The bar is a real
 * button that names what it opens; the list below it slides down by
 * animating grid-template-rows from 0fr to 1fr, so it reaches its natural
 * height without measuring. The list stays server-rendered in the HTML
 * (crawlers read it); while collapsed it is inert, so it takes no focus
 * and stays out of the accessibility tree.
 */
export function CardDetails({
  name,
  count,
  teaser,
  children,
}: {
  name: string;
  count: number;
  /** Highlight labels, shown as a one-line preview of what opens. */
  teaser: string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-t border-line">
      {/* Sits above the card's stretched link (z-index 1). */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="group/details relative z-[2] flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-raised sm:px-6"
      >
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center border border-line-strong text-accent transition-colors group-hover/details:border-accent"
        >
          <svg
            viewBox="0 0 12 12"
            className={`size-3 transition-transform duration-[600ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <span className="shrink-0 font-mono text-xs tracking-[0.18em] text-ink uppercase">
          {open ? "Hide details" : "Show details"}
          <span className="sr-only"> about {name}</span>
        </span>
        <span className="nums shrink-0 text-xs text-accent-dim">{count}</span>
        <span
          aria-hidden
          className={`hidden min-w-0 flex-1 truncate text-sm text-faint transition-opacity duration-300 sm:block ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          {teaser.join(" · ")}
        </span>
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div
            className={`transition-[opacity,translate] duration-[600ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
