import assert from "node:assert/strict";
import { test } from "node:test";

import {
  activeDayShare,
  activeDays,
  busiestDay,
  busiestWeek,
  currentStreak,
  dailyAverage,
  longestStreak,
  yearsSince,
} from "./stats";
import type { ContributionDay } from "./types";

function day(date: string, count: number): ContributionDay {
  return { date, count, level: count === 0 ? 0 : 1 };
}

const EMPTY: ContributionDay[] = [];

test("longestStreak finds the longest run and its bounds", () => {
  const days = [
    day("2026-01-01", 1),
    day("2026-01-02", 0),
    day("2026-01-03", 2),
    day("2026-01-04", 5),
    day("2026-01-05", 1),
    day("2026-01-06", 0),
    day("2026-01-07", 3),
  ];
  assert.deepEqual(longestStreak(days), { length: 3, start: "2026-01-03", end: "2026-01-05" });
  assert.deepEqual(longestStreak(EMPTY), { length: 0, start: null, end: null });
  assert.equal(longestStreak(days.map((d) => ({ ...d, count: 0 }))).length, 0);
});

test("currentStreak counts back from the newest day", () => {
  assert.equal(currentStreak([day("2026-01-01", 0), day("2026-01-02", 4), day("2026-01-03", 1)]), 2);
  assert.equal(currentStreak([day("2026-01-01", 2), day("2026-01-02", 0)]), 1, "today at 0 doesn't break the streak");
  assert.equal(currentStreak([day("2026-01-01", 2), day("2026-01-02", 0), day("2026-01-03", 0)]), 0);
  assert.equal(currentStreak(EMPTY), 0);
});

test("busiestDay picks the max and ignores all-zero data", () => {
  assert.deepEqual(busiestDay([day("2026-01-01", 3), day("2026-01-02", 9), day("2026-01-03", 9)]), day("2026-01-02", 9));
  assert.equal(busiestDay([day("2026-01-01", 0)]), null);
  assert.equal(busiestDay(EMPTY), null);
});

test("busiestWeek is the best rolling 7-day sum", () => {
  // 7 days of 1 then 7 days of 10.
  const built = [
    day("2026-01-01", 1),
    day("2026-01-02", 1),
    day("2026-01-03", 1),
    day("2026-01-04", 1),
    day("2026-01-05", 1),
    day("2026-01-06", 1),
    day("2026-01-07", 1),
    day("2026-01-08", 10),
    day("2026-01-09", 10),
    day("2026-01-10", 10),
    day("2026-01-11", 10),
    day("2026-01-12", 10),
    day("2026-01-13", 10),
    day("2026-01-14", 10),
  ];
  assert.deepEqual(busiestWeek(built), { count: 70, end: "2026-01-14" });
  assert.deepEqual(busiestWeek(EMPTY), { count: 0, end: null });
});

test("busiestWeek handles fewer than 7 days", () => {
  assert.deepEqual(busiestWeek([day("2026-01-01", 2), day("2026-01-02", 3)]), { count: 5, end: "2026-01-02" });
});

test("activeDays / activeDayShare / dailyAverage", () => {
  const days = [day("2026-01-01", 0), day("2026-01-02", 10), day("2026-01-03", 20), day("2026-01-04", 0)];
  assert.equal(activeDays(days), 2);
  assert.equal(activeDayShare(days), 0.5);
  assert.equal(dailyAverage(days), 7.5);
  assert.equal(activeDayShare(EMPTY), 0);
  assert.equal(dailyAverage(EMPTY), 0);
});

test("yearsSince respects the anniversary", () => {
  const created = "2015-04-05";
  assert.equal(yearsSince(created, new Date("2026-11-01T12:00:00Z")), 11);
  assert.equal(yearsSince(created, new Date("2026-04-04T12:00:00Z")), 10);
  assert.equal(yearsSince(created, new Date("2026-04-05T00:00:00Z")), 11);
});
