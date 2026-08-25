import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { daysUntil, formatJstDate, isPast } from "@/lib/date";

describe("date helpers", () => {
  beforeEach(() => {
    // 2026-08-22 10:00 JST == 2026-08-22 01:00 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-22T01:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when there is no deadline", () => {
    expect(daysUntil(null)).toBeNull();
    expect(daysUntil(undefined)).toBeNull();
  });

  it("counts whole JST calendar days remaining", () => {
    expect(daysUntil("2026-08-29T01:00:00Z")).toBe(7);
    expect(daysUntil("2026-08-22T14:00:00Z")).toBe(0); // later same JST day
  });

  it("returns a negative count once the deadline has passed", () => {
    expect(daysUntil("2026-08-15T01:00:00Z")).toBe(-7);
  });

  it("formats a date in JST", () => {
    expect(formatJstDate("2026-08-22T01:00:00Z")).toBe("2026年8月22日");
  });

  it("returns null when formatting a missing date", () => {
    expect(formatJstDate(null)).toBeNull();
  });

  it("detects whether a timestamp is in the past", () => {
    expect(isPast("2026-08-15T00:00:00Z")).toBe(true);
    expect(isPast("2026-08-30T00:00:00Z")).toBe(false);
    expect(isPast(null)).toBe(false);
  });
});
