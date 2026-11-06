import snapshot from "./snapshot.json";

/** A live project number, e.g. "aiwizard.tools" (see snapshot.json). */
export type LiveKey = keyof typeof snapshot.values;

export type LiveValues = Record<LiveKey, number>;

/** The committed fallback, also the single place the numbers live. */
export const SNAPSHOT: { date: string; values: LiveValues } = snapshot;

export function isLiveKey(key: string): key is LiveKey {
  return Object.hasOwn(SNAPSHOT.values, key);
}
