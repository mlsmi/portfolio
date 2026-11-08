/** One day on the contribution calendar. `level` is GitHub's own 0-4 intensity bucket. */
export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionData = {
  /**
   * The sum of `days`: exactly the calendar GitHub draws, and what its
   * profile headline "contributions in the last year" counts. A source's
   * own total is never used: the public API's lagged the calendar by a
   * week at the Sunday rollover (14,943 against a day sum of 14,805 on
   * 2026-11-08, when the profile said 14,808).
   */
  totalLastYear: number;
  /** Oldest first. */
  days: ContributionDay[];
};

export type ActivitySource = "token" | "live" | "fallback";

export type ActivityResult = {
  data: ContributionData;
  source: ActivitySource;
};
