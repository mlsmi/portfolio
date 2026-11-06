import { ProjectCard } from "@/components/project-card";
import { TerminalReceipts } from "@/components/terminal-receipts";
import type { ShownProject } from "@/lib/live";
import { SNAPSHOT } from "@/lib/live/keys";

const MONTH = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** Projects with their numbers resolved (lib/live), cards plus the receipts terminal. */
export function ProjectsSection({ projects, contributionsLive }: { projects: ShownProject[]; contributionsLive: boolean }) {
  const leads = projects.filter((p) => p.lead);
  const rest = projects.filter((p) => !p.lead);

  return (
    <section id="work" aria-labelledby="work-heading" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="work-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Selected work
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted">
            Eight products in production. Six built solo, end to end. AI Angels and
            its admin dashboard: engineering lead of a three-person team. Commit
            and PR counts are mine, from GitHub
            {contributionsLive ? ", refreshed daily" : ` (${MONTH.format(new Date(SNAPSHOT.date))})`}.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <TerminalReceipts projects={projects} />
        </div>
      </div>
      <div className="mt-12 space-y-6">
        {leads.map((project, i) => (
          <ProjectCard key={project.slug} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            wide={rest.length % 2 === 1 && i === rest.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
