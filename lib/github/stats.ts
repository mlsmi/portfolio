import type { ContributionDay } from "./types";

export type Streak = { length: number; start: string | null; end: string | null };

/** Longest run of consecutive days with at least one contribution. */
export function longestStreak(days: ContributionDay[]): Streak {
  let best: Streak = { length: 0, start: null, end: null };
  let run: Streak = { length: 0, start: null, end: null };
  for (const day of days) {
    if (day.count > 0) {
      run = run.length === 0 ? { length: 1, start: day.date, end: day.date } : { length: run.length + 1, start: run.start, end: day.date };
      if (run.length > best.length) best = run;
    } else {
      run = { length: 0, start: null, end: null };
    }
  }
  return best;
}

/**
 * Streak running up to the newest day. The newest day being 0 doesn't break
 * it (the day isn't over when the data is fetched).
 */
export function currentStreak(days: ContributionDay[]): number {
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let length = 0;
  for (; i >= 0 && days[i].count > 0; i--) length++;
  return length;
}

export function busiestDay(days: ContributionDay[]): ContributionDay | null {
  let best: ContributionDay | null = null;
  for (const day of days) {
    if (!best || day.count > best.count) best = day;
  }
  return best && best.count > 0 ? best : null;
}

/** Highest rolling 7-day total. Returns the window's end date. */
export function busiestWeek(days: ContributionDay[]): { count: number; end: string | null } {
  let sum = 0;
  let best = 0;
  let end: string | null = null;
  for (let i = 0; i < days.length; i++) {
    sum += days[i].count;
    if (i >= 7) sum -= days[i - 7].count;
    if (sum > best) {
      best = sum;
      end = days[i].date;
    }
  }
  return { count: best, end };
}

export function activeDays(days: ContributionDay[]): number {
  return days.reduce((n, d) => n + (d.count > 0 ? 1 : 0), 0);
}

export function activeDayShare(days: ContributionDay[]): number {
  return days.length === 0 ? 0 : activeDays(days) / days.length;
}

export function dailyAverage(days: ContributionDay[]): number {
  if (days.length === 0) return 0;
  return days.reduce((n, d) => n + d.count, 0) / days.length;
}

/** Whole years elapsed since an ISO date. */
export function yearsSince(isoDate: string, now: Date): number {
  const then = new Date(`${isoDate}T00:00:00Z`);
  let years = now.getUTCFullYear() - then.getUTCFullYear();
  const anniversaryPassed =
    now.getUTCMonth() > then.getUTCMonth() ||
    (now.getUTCMonth() === then.getUTCMonth() && now.getUTCDate() >= then.getUTCDate());
  if (!anniversaryPassed) years--;
  return Math.max(0, years);
}
