import { SITE } from "@/lib/site-config";

export function Hero() {
  return (
    // 88dvh, not 100: the telemetry band peeks above the fold.
    <section id="top" className="flex min-h-[88dvh] items-center">
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
          <span className="mt-4 block text-xl tracking-tight text-accent sm:text-2xl">
            {SITE.role}
          </span>
        </h1>
        <p
          className="enter mt-6 max-w-[58ch] text-base leading-relaxed text-muted sm:text-lg"
          style={{ "--enter-i": 2 } as React.CSSProperties}
        >
          I ship full-stack products with agentic AI: customer apps, admin
          platforms, LLM pipelines and 3D games. Then I rank them on search
          engines and LLMs so people find them.
        </p>
        <div className="enter mt-10 flex flex-wrap gap-4" style={{ "--enter-i": 3 } as React.CSSProperties}>
          <a
            href="#work"
            className="bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            View the work
          </a>
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
