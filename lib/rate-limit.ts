/**
 * In-memory sliding-window rate limit. Best effort by design: the Map
 * lives per server instance, so a new lambda starts fresh. For a
 * portfolio contact form that is plenty; it needs no database and the
 * honeypot carries most of the anti-bot weight.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 5;

const hits = new Map<string, number[]>();

export function rateLimited(key: string, now = Date.now()): boolean {
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= MAX_IN_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing unbounded across many distinct callers.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => t <= cutoff)) hits.delete(k);
    }
  }
  return false;
}
