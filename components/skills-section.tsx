import { SKILL_GROUPS } from "@/lib/skills";

export function SkillsSection() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <h2 id="stack-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Stack
      </h2>
      <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <div key={group.name} className="border-t border-line pt-5">
            <h3 className="font-mono text-sm text-accent">{group.name}</h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
