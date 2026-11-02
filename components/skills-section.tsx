import { SKILL_GROUPS, type SkillGroup } from "@/lib/skills";

function Group({ group }: { group: SkillGroup }) {
  return (
    <div className={`reveal border-t pt-5 ${group.featured ? "border-line-strong" : "border-line"}`}>
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
      <div className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-2">
        {featured.map((group) => (
          <Group key={group.name} group={group} />
        ))}
      </div>
      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((group) => (
          <Group key={group.name} group={group} />
        ))}
      </div>
    </section>
  );
}
