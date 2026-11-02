import { AiSection } from "@/components/ai-section";
import { ContactSection } from "@/components/contact-section";
import { GithubActivity } from "@/components/github-activity";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { VelocityMarquee } from "@/components/velocity-marquee";
import { getGitHubActivity } from "@/lib/github/fetch";
import { SITE, siteUrl } from "@/lib/site-config";
import { MARQUEE_ROWS } from "@/lib/skills";

/** The one ISR surface: refresh the GitHub data daily. */
export const revalidate = 86400;

export default async function Home() {
  const activity = await getGitHubActivity();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    alternateName: SITE.handle,
    jobTitle: SITE.role,
    url: siteUrl(),
    sameAs: [SITE.githubUrl, SITE.linkedinUrl],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <GithubActivity activity={activity} />
      <ProjectsSection />
      <VelocityMarquee rows={MARQUEE_ROWS} />
      <AiSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
