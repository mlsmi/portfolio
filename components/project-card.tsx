import Image from "next/image";

import { CardDetails } from "@/components/card-details";
import { DemoVideo } from "@/components/demo-video";
import { projectImage, type Project } from "@/lib/projects";

function host(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

/** The "Label" of a "Label: detail" highlight, or null when it has none. */
function labelOf(text: string): string | null {
  const i = text.indexOf(": ");
  return i > 0 && i <= 48 ? text.slice(0, i) : null;
}

/** "Label: detail" highlights get the label in ink so long lists scan. */
function Highlight({ text }: { text: string }) {
  const label = labelOf(text);
  if (!label) return <>{text}</>;
  return (
    <>
      <span className="text-ink">{label}:</span> {text.slice(label.length + 2)}
    </>
  );
}

function Media({ project, priority }: { project: Project; priority?: boolean }) {
  const image = projectImage(project.slug);
  const alt = `Screenshot of ${project.name}`;
  if (project.youtubeId) {
    return <DemoVideo youtubeId={project.youtubeId} poster={image} name={project.name} priority={priority} />;
  }
  const size = project.imageSize ?? { width: 1600, height: 1000 };
  // Lead cards own their row, so their screenshot shows whole, uncropped.
  // Grid cards share a uniform 16:10 frame so rows align; anchored to the
  // top so the cropped part is never a site's header.
  const fit = project.lead ? "h-auto" : "aspect-[16/10] object-cover object-top";
  return (
    <div className="overflow-hidden">
      <Image
        src={image}
        alt={alt}
        width={size.width}
        height={size.height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 60vw"
        className={`w-full ${fit} transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
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
            <li key={item}>
              <Highlight text={item} />
            </li>
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
          so the text column never outgrows the screenshot beside it, and
          they start collapsed behind a "Show details" bar. */}
      {project.lead && project.highlights ? (
        <CardDetails
          name={project.name}
          count={project.highlights.length}
          teaser={project.highlights.map(labelOf).filter((label) => label !== null)}
        >
          <ul className="grid gap-x-8 gap-y-3 px-5 pt-1 pb-6 text-sm leading-relaxed text-muted sm:px-6 md:grid-cols-2">
            {project.highlights.map((item) => (
              <li key={item} className="border-l border-line pl-4">
                <Highlight text={item} />
              </li>
            ))}
          </ul>
        </CardDetails>
      ) : null}
    </article>
  );
}
