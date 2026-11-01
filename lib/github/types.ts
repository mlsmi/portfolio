/** One day on the contribution calendar. `level` is GitHub's own 0-4 intensity bucket. */
export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionData = {
  /**
   * GitHub's own "contributions in the last year" figure. Its window is the
   * full 53-week calendar, slightly wider than the 365 `days`, so it can
   * exceed the sum of `days` — display this one, derive everything else
   * from the days.
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
