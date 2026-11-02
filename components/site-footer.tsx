import { FooterWordmark } from "@/components/footer-wordmark";
import { SITE } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <FooterWordmark text={SITE.handle} />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-faint">
          {SITE.name} · {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={SITE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
