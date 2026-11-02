"use client";

import { useRef } from "react";

/**
 * Oversized outlined wordmark for the footer, adapted from Aceternity UI's
 * Text Hover Effect (ui.aceternity.com/components/text-hover-effect)
 * without `motion`, in the site's cyan.
 *
 * Two layers of the same text: a faint outline that draws itself in as it
 * scrolls into view (CSS, app/globals.css .wordmark-draw), and a cyan
 * gradient stroke masked by a radial gradient whose centre follows the
 * mouse, set straight on the SVG attribute. Decorative: aria-hidden, the
 * handle is already in the header.
 */
export function FooterWordmark({ text }: { text: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const reveal = useRef<SVGRadialGradientElement>(null);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch" || !svg.current || !reveal.current) return;
    const r = svg.current.getBoundingClientRect();
    reveal.current.setAttribute("cx", `${(((event.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    reveal.current.setAttribute("cy", `${(((event.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    svg.current.dataset.hover = "true";
  };

  const onPointerLeave = () => {
    if (svg.current) svg.current.dataset.hover = "false";
  };

  const textProps = { x: "50%", y: 58, textAnchor: "middle" } as const;

  return (
    <svg
      ref={svg}
      aria-hidden
      viewBox="0 0 300 66"
      className="wordmark block h-auto w-full select-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <defs>
        <linearGradient id="wordmark-stroke" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="260" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--accent-dim)" }} />
          <stop offset="35%" style={{ stopColor: "var(--accent)" }} />
          <stop offset="55%" style={{ stopColor: "var(--ink)" }} />
          <stop offset="75%" style={{ stopColor: "var(--accent)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-dim)" }} />
        </linearGradient>
        <radialGradient ref={reveal} id="wordmark-reveal" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="26%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="wordmark-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#wordmark-reveal)" />
        </mask>
      </defs>
      <text {...textProps} className="wordmark-draw">
        {text}
      </text>
      <text {...textProps} className="wordmark-glow" stroke="url(#wordmark-stroke)" mask="url(#wordmark-mask)">
        {text}
      </text>
    </svg>
  );
}
