import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="mono-label">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-ink sm:text-5xl">
          Signal lost
        </h1>
        <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted">
          Nothing is stationed at this address.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-line-strong px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Return to base
        </Link>
      </div>
    </main>
  );
}
