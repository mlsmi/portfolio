import { EncryptedText } from "@/components/encrypted-text";
import { MovingBorderLink } from "@/components/moving-border-link";
import { PointerHighlight } from "@/components/pointer-highlight";
import { SITE } from "@/lib/site-config";

/**
 * Spotlight New (two swaying cyan light cones) over a Grid Background
 * floor, both adapted from Aceternity UI as CSS (app/globals.css).
 * Contained in the hero's own stacking context, above the site-wide
 * falling drops and below the hero's content.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0 -z-10">
      <div className="hero-grid" />
      <div className="spotlight-arm spotlight-left">
        <span className="beam-1" />
        <span className="beam-2" />
        <span className="beam-3" />
      </div>
      <div className="spotlight-arm spotlight-right">
        <span className="beam-1" />
        <span className="beam-2" />
        <span className="beam-3" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    // 88dvh, not 100: the telemetry band peeks above the fold.
    <section id="top" className="relative isolate flex min-h-[88dvh] items-center overflow-hidden">
      <HeroBackdrop />
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6">
        <p className="mono-label enter flex items-center gap-2.5" style={{ "--enter-i": 0 } as React.CSSProperties}>
          {/* The page's one status dot: a real availability flag. */}
          <span aria-hidden className="size-1.5 bg-accent" />
          Open to roles and contract work
        </p>
        <h1 className="enter mt-6" style={{ "--enter-i": 1 } as React.CSSProperties}>
          <span className="block text-5xl font-semibold tracking-tighter text-ink sm:text-7xl">
            {SITE.name}
          </span>
          {/* Monospace, so the decrypting glyphs never change the line's width. */}
          <span className="mt-5 block font-mono text-lg tracking-tight text-accent sm:text-xl">
            <EncryptedText text={SITE.role} />
          </span>
        </h1>
        <p
          className="enter mt-6 max-w-[58ch] text-base leading-relaxed text-muted sm:text-lg"
          style={{ "--enter-i": 2 } as React.CSSProperties}
        >
          I ship full-stack products with agentic AI: consumer apps, admin
          platforms, LLM pipelines and 3D games. Then I rank them on{" "}
          <PointerHighlight>search engines and LLMs</PointerHighlight> so
          people find them.
        </p>
        <div className="enter mt-10 flex flex-wrap gap-4" style={{ "--enter-i": 3 } as React.CSSProperties}>
          <MovingBorderLink href="#work">View the work</MovingBorderLink>
          <a
            href="#contact"
            className="border border-line-strong px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
