import type { CSSProperties } from "react";

/**
 * Pointer Highlight, adapted from Aceternity UI
 * (ui.aceternity.com/components/pointer-highlight) as pure CSS: once the
 * hero's load cascade has played, a box draws itself around the phrase
 * while a cursor travels to its far corner (app/globals.css .ph-*). With
 * reduced motion the box and cursor are simply there.
 */
export function PointerHighlight({ children, delay = 1.9 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span
      className="relative mx-1 inline-block whitespace-nowrap text-ink"
      style={{ "--ph-delay": `${delay}s` } as CSSProperties}
    >
      <span aria-hidden className="ph-box" />
      <span className="relative">{children}</span>
      <svg aria-hidden viewBox="0 0 13 17" className="ph-cursor">
        <path
          d="M1 1v13.2l3.4-3.1 2.4 5.2 2.4-1.1-2.4-5.1H11L1 1Z"
          fill="currentColor"
          stroke="var(--bg)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
