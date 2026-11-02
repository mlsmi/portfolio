import type { CSSProperties } from "react";

/**
 * Site-wide background: thin accent-coloured streaks with a glowing head,
 * falling through the viewport at their own speeds (ported from
 * AirdropStop's hero drops, owner request 2026-11-02, in this site's cyan).
 *
 * Pure CSS, no JavaScript: only `transform` and `opacity` animate
 * (app/globals.css: .drop), so the layer is composited without layout or
 * paint per frame. Every value is a constant, so server and client always
 * agree. Negative delays mean the first paint already shows drops mid-fall.
 * Half the streaks are hidden on phones (7 layers instead of 14), and the
 * whole layer is hidden under prefers-reduced-motion.
 *
 * x: left in %, h: height in px, d: fall duration in s, t: delay in s
 * (negative = already falling), o: peak opacity in %. The opacity is baked
 * into the colour, never read by a keyframe, so the animation stays on the
 * compositor.
 */
type Streak = { x: number; h: number; d: number; t: number; o: number; phone?: true };

const STREAKS: Streak[] = [
  { x: 4, h: 88, d: 13, t: -4.5, o: 55, phone: true },
  { x: 9, h: 56, d: 10, t: -1, o: 45 },
  { x: 15, h: 112, d: 15, t: -7.5, o: 65, phone: true },
  { x: 22, h: 64, d: 11, t: -3, o: 50 },
  { x: 28, h: 80, d: 12, t: -6, o: 55, phone: true },
  { x: 36, h: 48, d: 9, t: -2, o: 45 },
  { x: 43, h: 96, d: 14, t: -9, o: 60, phone: true },
  { x: 51, h: 72, d: 11.5, t: -0.5, o: 50 },
  { x: 58, h: 104, d: 14.5, t: -5, o: 65, phone: true },
  { x: 66, h: 56, d: 10.5, t: -3.5, o: 45 },
  { x: 73, h: 88, d: 13.5, t: -8, o: 55, phone: true },
  { x: 81, h: 64, d: 11, t: -1.5, o: 50 },
  { x: 88, h: 96, d: 12.5, t: -6.5, o: 60, phone: true },
  { x: 95, h: 72, d: 10, t: -4, o: 50 },
];

const vars = (v: Record<string, string>) => v as CSSProperties;

export function FallingDrops() {
  return (
    <div aria-hidden className="drops pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {STREAKS.map((s) => (
        <span
          key={s.x}
          className={s.phone ? "drop" : "drop max-sm:hidden"}
          style={vars({ "--x": `${s.x}%`, "--h": `${s.h}px`, "--d": `${s.d}s`, "--t": `${s.t}s`, "--o": `${s.o}%` })}
        />
      ))}
    </div>
  );
}
