/**
 * Kinetic Text, adapted from Magic UI
 * (magicui.design/docs/components/kinetic-text) as pure CSS
 * (app/globals.css .kinetic): hovering a letter swells it to a heavier
 * weight and its neighbours step up with it.
 *
 * Letters are plain inline spans grouped per word (no wrapping inside a
 * word), with no hidden duplicate, so the text reads once for crawlers
 * and screen readers.
 */
export function KineticText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="kinetic">
      {words.map((word, w) => (
        <span key={w}>
          {w > 0 ? " " : null}
          <span className="whitespace-nowrap">
            {[...word].map((letter, i) => (
              <span key={i} className="k">
                {letter}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
