import { describe, it, expect } from "vitest";
import { formatAmountRange, formatYen } from "@/lib/format";

describe("formatYen", () => {
  it("formats an integer amount as JPY", () => {
    expect(formatYen(1000000)).toBe("￥1,000,000");
  });

  it("returns null for missing amounts", () => {
    expect(formatYen(null)).toBeNull();
    expect(formatYen(undefined)).toBeNull();
  });
});

describe("formatAmountRange", () => {
  it("shows an upper-limit label when only a max is set", () => {
    expect(formatAmountRange(null, 5000000)).toBe("上限 ￥5,000,000");
  });

  it("shows a range when min and max differ", () => {
    expect(formatAmountRange(100000, 500000)).toBe("￥100,000〜￥500,000");
  });

  it("falls back to a guidance message when no amount is set", () => {
    expect(formatAmountRange(null, null)).toBe("金額は公式ページでご確認ください");
  });
});
