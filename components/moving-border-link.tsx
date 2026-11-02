/**
 * Moving Border, adapted from Aceternity UI
 * (ui.aceternity.com/components/moving-border) as pure CSS: a cyan comet
 * orbits the link's sharp 1px frame. An oversized conic square rotates
 * behind the frame (only transform animates); the label's own background
 * covers all but the edge. With reduced motion the comet holds still.
 */
export function MovingBorderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="orbit-border group active:scale-[0.98]">
      <span aria-hidden className="orbit-spinner" />
      <span className="relative bg-raised px-6 py-3 text-sm font-medium text-ink transition-colors group-hover:bg-[#0f1829] group-hover:text-accent">
        {children}
      </span>
    </a>
  );
}
