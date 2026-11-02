import { HoverHighlightGrid } from "@/components/hover-highlight-grid";
import { SKILL_GROUPS, type SkillGroup } from "@/lib/skills";

function Group({ group }: { group: SkillGroup }) {
  return (
    <div
      data-hover-tile
      className={`reveal relative border bg-surface p-5 transition-colors sm:p-6 ${
        group.featured ? "border-line-strong hover:border-accent-dim" : "border-line hover:border-line-strong"
      }`}
    >
      <h3 className={`font-mono text-accent ${group.featured ? "text-base" : "text-sm"}`}>{group.name}</h3>
      <ul className={`mt-4 space-y-2 ${group.featured ? "text-[0.9375rem] text-ink/85" : "text-sm text-muted"}`}>
        {group.items.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsSection() {
  const featured = SKILL_GROUPS.filter((g) => g.featured);
  const rest = SKILL_GROUPS.filter((g) => !g.featured);

  return (
    <section id="stack" aria-labelledby="stack-heading" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <h2 id="stack-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Stack
      </h2>
      <HoverHighlightGrid className="mt-12 grid gap-6 lg:grid-cols-2">
        {featured.map((group) => (
          <Group key={group.name} group={group} />
        ))}
      </HoverHighlightGrid>
      <HoverHighlightGrid className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((group) => (
          <Group key={group.name} group={group} />
        ))}
      </HoverHighlightGrid>
    </section>
  );
}
