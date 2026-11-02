"use client";

import { useEffect, useRef } from "react";

const STEP_MS = 72;
const CASCADE_MS = 70;

/**
 * A stat value on split-flap tiles, adapted from Aceternity UI's Text
 * Flipping Board (ui.aceternity.com/components/text-flipping-board)
 * without `motion`: tiles are CSS (app/globals.css .flap*), and each flap
 * is one Web Animations API call.
 *
 * The server renders the real value, so the text is right before, during
 * hydration and without JS. When the value first scrolls into view, every
 * digit flips through random digits and lands on its own, cascading left
 * to right. Glyphs are swapped in their text nodes (monospace, so no
 * layout shift). Assistive tech gets the value once, from the label.
 */
export function FlapValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cells = Array.from(root.querySelectorAll<HTMLElement>("[data-flap]"));
    const timers: number[] = [];

    const settle = () => {
      for (const cell of cells) {
        const node = cell.firstElementChild?.firstChild;
        if (node instanceof Text) node.nodeValue = cell.dataset.flap ?? "";
      }
    };

    const run = () => {
      cells.forEach((cell, i) => {
        const glyph = cell.firstElementChild as HTMLElement | null;
        const node = glyph?.firstChild;
        if (!glyph || !(node instanceof Text)) return;
        const target = cell.dataset.flap ?? "";
        const steps = 6 + i * 2 + Math.floor(Math.random() * 3);
        let n = 0;
        const step = () => {
          n += 1;
          const last = n >= steps;
          node.nodeValue = last ? target : String(Math.floor(Math.random() * 10));
          glyph.animate(
            [
              { transform: "rotateX(-88deg)", opacity: 0.4 },
              { transform: "rotateX(0deg)", opacity: 1 },
            ],
            { duration: last ? 240 : 110, easing: last ? "cubic-bezier(.2,1.6,.4,1)" : "cubic-bezier(.3,.7,.4,1)" },
          );
          if (!last) timers.push(window.setTimeout(step, STEP_MS));
        };
        timers.push(window.setTimeout(step, i * CASCADE_MS));
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.9 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      settle();
    };
  }, [value]);

  return (
    <span ref={ref} role="img" aria-label={value} className={`flaps ${className ?? ""}`}>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} data-flap={ch} className="flap">
            <span className="flap-glyph">{ch}</span>
          </span>
        ) : (
          <span key={i} className="flap flap-static">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
