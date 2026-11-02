import { AgentBeams } from "@/components/agent-beams";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site-config";
import { AI_HIGHLIGHTS, AI_TOOLS } from "@/lib/skills";

/**
 * Full-width band, visually distinct from the card grids around it:
 * raised surface, an asymmetric 5/7 split: the agent-fleet beam diagram
 * on the left, highlights as hairline rows along a tracing-beam rail.
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
            <div className="mt-10">
              <AgentBeams
                tools={AI_TOOLS}
                hub={SITE.handle}
                outputs={[`${PROJECTS.length} products`, "LLM pipelines", "Automations"]}
              />
            </div>
          </div>
          {/* Tracing Beam (adapted from Aceternity UI as scroll-driven
              CSS, app/globals.css .trace-*): a beam slides down the rail
              as the list scrolls past, lighting each item's node. */}
          <div className="trace lg:col-span-7">
            <div aria-hidden className="trace-rail">
              <span className="trace-beam" />
            </div>
            <ul className="trace-list divide-y divide-line">
              {AI_HIGHLIGHTS.map((highlight) => (
                <li key={highlight.title} className="relative py-7 first:lg:pt-0">
                  <span aria-hidden className="trace-node" />
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
