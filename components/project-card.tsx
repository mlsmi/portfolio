import Image from "next/image";

import { ProjectVideo } from "@/components/project-video";
import { projectImage, type Project } from "@/lib/projects";

function host(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

function Media({ project, priority }: { project: Project; priority?: boolean }) {
  const image = projectImage(project.slug);
  const alt = `Screenshot of ${project.name}`;
  if (project.videoSrc) {
    return <ProjectVideo src={project.videoSrc} poster={image} alt={alt} />;
  }
  return (
    <Image
      src={image}
      alt={alt}
      width={1600}
      height={1000}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className="aspect-[16/10] w-full object-cover"
    />
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
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.pitch}</p>
      <dl className="mt-5 space-y-2">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-3">
            <dt className="sr-only">{metric.label}</dt>
            <dd className="nums min-w-16 shrink-0 text-sm text-accent">{metric.value}</dd>
            <dd className="text-sm text-muted">{metric.label}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5" aria-label="Technology">
        {project.stack.map((tech) => (
          <li key={tech} className="font-mono text-xs text-faint">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The whole card is the hit area via a stretched link on the name;
 * crawlers and screen readers get the name as anchor text.
 */
export function ProjectCard({ project }: { project: Project }) {
  const interactive = Boolean(project.url);
  return (
    <article
      className={`group relative flex flex-col overflow-hidden border border-line bg-surface transition-colors ${
        interactive ? "hover:border-line-strong" : ""
      } ${project.lead ? "md:flex-row" : ""}`}
    >
      <div className={project.lead ? "md:w-3/5 md:shrink-0" : ""}>
        <Media project={project} priority={project.lead} />
      </div>
      <CardBody project={project} lead={project.lead} />
    </article>
  );
}
