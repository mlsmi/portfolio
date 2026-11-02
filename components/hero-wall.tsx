import Image from "next/image";
import type { CSSProperties } from "react";

import { PROJECTS, projectImage } from "@/lib/projects";

/** Drift per column: alternating direction and pace, so the wall shears. */
const DRIFT = [
  { d: "10s", y: "100px" },
  { d: "15s", y: "-100px" },
  { d: "12s", y: "90px" },
  { d: "17s", y: "-110px" },
];

/**
 * The hero's monitor wall: Aceternity UI's 3D Marquee
 * (ui.aceternity.com/components/3d-marquee) as a server component with CSS
 * drift instead of `motion` (app/globals.css .wall-*). A tilted grid of
 * the real project screenshots, each shown twice across four columns.
 *
 * Decorative and ambient: aria-hidden, no pointer events, images muted.
 * Large screens only; the images are lazy, so inside the display:none
 * wrapper phones never fetch them, and they ask for small variants.
 */
export function HeroWall() {
  const slugs = PROJECTS.map((project) => project.slug);
  const at = (i: number) => slugs[i % slugs.length];
  const columns = DRIFT.map((_, c) => [at(2 * c), at(2 * c + 1), at(2 * c + 4), at(2 * c + 5)]);

  return (
    <div aria-hidden className="wall pointer-events-none hidden lg:block">
      <div className="wall-stage">
        <div className="wall-grid">
          {columns.map((column, c) => (
            <div
              key={c}
              className="wall-col"
              style={{ "--wall-d": DRIFT[c].d, "--wall-y": DRIFT[c].y } as CSSProperties}
            >
              {column.map((slug, i) => (
                <div key={`${slug}-${i}`} className="wall-tile">
                  <Image
                    src={projectImage(slug)}
                    alt=""
                    width={1600}
                    height={1000}
                    sizes="300px"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
