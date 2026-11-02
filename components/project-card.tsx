import Image from "next/image";

import { DemoVideo } from "@/components/demo-video";
import { projectImage, type Project } from "@/lib/projects";

function host(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

function Media({ project, priority }: { project: Project; priority?: boolean }) {
  const image = projectImage(project.slug);
  const alt = `Screenshot of ${project.name}`;
  if (project.youtubeId) {
    return <DemoVideo youtubeId={project.youtubeId} poster={image} name={project.name} priority={priority} />;
  }
  return (
    <div className="overflow-hidden">
      <Image
        src={image}
        alt={alt}
        width={1600}
        height={1000}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

function CardBody({ project, lead }: { project: Project; lead?: boolean }) {
  return (
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={lead ? "text-xl font-semibold tracking-tight text-ink sm:text-2xl" : "text-lg font-semibold tracking-tight text-ink"}>
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="card-link">
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        <span className="shrink-0 font-mono text-xs text-faint">
          {project.url ? host(project.url) : "internal"}
        </span>
      </div>
      {project.role ? <p className="mt-1.5 font-mono text-xs text-accent-dim">{project.role}</p> : null}
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.pitch}</p>
      <dl className="mt-5 space-y-2">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-3">
            <dt className="sr-only">{metric.label}</dt>
            <dd className="nums min-w-20 shrink-0 text-sm text-accent">{metric.value}</dd>
            <dd className="text-sm text-muted">{metric.label}</dd>
          </div>
        ))}
      </dl>
      {project.highlights && !lead ? (
        <ul className="mt-5 space-y-2 border-l border-line pl-4 text-sm leading-relaxed text-muted">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-5">
        <p className="font-mono text-xs text-accent-dim">
          {project.contributions.commits.toLocaleString("en-US")} commits ·{" "}
          {project.contributions.prs.toLocaleString("en-US")} PRs
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1" aria-label="Technology">
          {project.stack.map((tech) => (
            <li key={tech} className="font-mono text-xs text-faint">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The whole card is the hit area via a stretched link on the name;
 * crawlers and screen readers get the name as anchor text.
 */
export function ProjectCard({
  project,
  reverse,
  wide,
}: {
  project: Project;
  reverse?: boolean;
  /** Grid card spanning both columns (an odd last card), laid out side by side. */
  wide?: boolean;
}) {
  const interactive = Boolean(project.url);
  const row = project.lead || wide;
  return (
    <article
      className={`reveal group relative flex flex-col overflow-hidden border border-line bg-surface transition-colors ${
        interactive ? "hover:border-line-strong" : ""
      } ${wide ? "md:col-span-2" : ""}`}
    >
      <div className={`flex flex-1 flex-col ${row ? (reverse ? "md:flex-row-reverse" : "md:flex-row") : ""}`}>
        <div className={project.lead ? "md:w-3/5 md:shrink-0" : wide ? "md:w-1/2 md:shrink-0" : ""}>
          <Media project={project} priority={project.lead} />
        </div>
        <CardBody project={project} lead={project.lead} />
      </div>
      {/* On a lead card the highlights span the full width under the row,
          so the text column never outgrows the screenshot beside it. */}
      {project.lead && project.highlights ? (
        <ul className="grid gap-x-8 gap-y-3 border-t border-line p-5 text-sm leading-relaxed text-muted sm:p-6 md:grid-cols-2">
          {project.highlights.map((item) => (
            <li key={item} className="border-l border-line pl-4">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
