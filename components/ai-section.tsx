import { AI_HIGHLIGHTS, AI_TOOLS } from "@/lib/skills";

/**
 * Full-width band, visually distinct from the card grids around it:
 * raised surface, an asymmetric 5/7 split, highlights as hairline rows.
 */
export function AiSection() {
  return (
    <section aria-labelledby="ai-heading" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ai-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              AI-native, by default
            </h2>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted">
              One developer with a fleet of AI agents now outships a team. I work
              that way daily, and I build the pipelines and automations that let
              products run themselves.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="AI tooling used daily">
              {AI_TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="border border-line px-3 py-1.5 font-mono text-xs text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line border-t border-line lg:border-t-0">
              {AI_HIGHLIGHTS.map((highlight) => (
                <li key={highlight.title} className="py-7 first:lg:pt-0">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{highlight.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{highlight.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
