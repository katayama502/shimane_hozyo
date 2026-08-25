import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { effectiveStatus, statusLabel } from "@/lib/status";

describe("effectiveStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-22T01:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("flips to closed once the application deadline has passed (F-07)", () => {
    expect(effectiveStatus("open", "2026-08-01T00:00:00Z")).toBe("closed");
  });

  it("keeps the stored status while the deadline hasn't passed", () => {
    expect(effectiveStatus("open", "2026-09-01T00:00:00Z")).toBe("open");
    expect(effectiveStatus("scheduled", "2026-09-01T00:00:00Z")).toBe("scheduled");
  });

  it("keeps the stored status when there is no deadline (rolling/anytime)", () => {
    expect(effectiveStatus("anytime", null)).toBe("anytime");
  });
});

describe("statusLabel", () => {
  it("maps known statuses to Japanese labels", () => {
    expect(statusLabel("open")).toBe("募集中");
    expect(statusLabel("closed")).toBe("終了");
    expect(statusLabel("needs_review")).toBe("要確認");
  });

  it("falls back to the raw value for unknown statuses", () => {
    expect(statusLabel("mystery")).toBe("mystery");
  });
});
