import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

export function ProjectsSection() {
  const leads = PROJECTS.filter((p) => p.lead);
  const rest = PROJECTS.filter((p) => !p.lead);

  return (
    <section id="work" aria-labelledby="work-heading" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <h2 id="work-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Selected work
      </h2>
      <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted">
        Eight products in production. Six built solo, end to end. AI Angels and
        its admin dashboard: engineering lead of a three-person team.
      </p>
      <div className="mt-12 space-y-6">
        {leads.map((project, i) => (
          <ProjectCard key={project.slug} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
