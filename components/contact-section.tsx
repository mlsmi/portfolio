import { ContactForm } from "@/components/contact-form";
import { SITE } from "@/lib/site-config";

const FACTS: Array<{ label: string; value: string }> = [
  { label: "Based in", value: SITE.location },
  { label: "Working", value: "Remote, EU hours" },
  { label: "Open to", value: "Full-time roles and project contracts" },
];

export function ContactSection() {
  return (
    // data-glow: GlowField lights the dot field under the cursor.
    <section
      id="contact"
      data-glow
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-line"
    >
      <div aria-hidden className="dot-field" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="contact-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Contact
          </h2>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted">
            Hiring for a team, or need a product built and run end to end?
            Tell me what you are working on.
          </p>
          <dl className="mt-8 space-y-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex gap-4 text-sm">
                <dt className="w-24 shrink-0 font-mono text-faint">{fact.label}</dt>
                <dd className="text-muted">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex gap-6">
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
            >
              github.com/{SITE.handle}
            </a>
            <a
              href={SITE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div data-glow className="glow-panel border border-line bg-surface p-5 sm:p-7">
            <span aria-hidden className="glow-bloom" />
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
