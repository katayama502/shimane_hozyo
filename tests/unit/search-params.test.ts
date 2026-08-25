import { describe, it, expect } from "vitest";
import { buildFilters, filtersToSearchParams, parseSearchParams } from "@/lib/search/params";

describe("parseSearchParams", () => {
  it("applies defaults when nothing is provided", () => {
    const filters = parseSearchParams({});
    expect(filters).toEqual({
      purpose: [],
      industry: [],
      sort: "recommended",
      page: 1,
    });
  });

  it("reads repeated purpose/industry params as arrays", () => {
    const filters = parseSearchParams({
      purpose: ["dx", "startup"],
      industry: "manufacturing",
    });
    expect(filters.purpose).toEqual(["dx", "startup"]);
    expect(filters.industry).toEqual(["manufacturing"]);
  });

  it("coerces the page param to a positive integer", () => {
    expect(parseSearchParams({ page: "3" }).page).toBe(3);
    expect(parseSearchParams({ page: "not-a-number" }).page).toBe(1);
  });

  it("falls back to defaults for an invalid sort value instead of erroring", () => {
    expect(parseSearchParams({ sort: "nonsense" }).sort).toBe("recommended");
  });
});

describe("filtersToSearchParams", () => {
  it("round-trips filters into a shareable query string (F-02)", () => {
    const filters = buildFilters({
      q: "創業",
      area: "matsue",
      purpose: ["startup", "dx"],
      status: "open",
      page: 2,
    });
    const params = filtersToSearchParams(filters);

    expect(params.get("q")).toBe("創業");
    expect(params.get("area")).toBe("matsue");
    expect(params.getAll("purpose")).toEqual(["startup", "dx"]);
    expect(params.get("status")).toBe("open");
    expect(params.get("page")).toBe("2");

    // Re-parsing the generated query string should reproduce the same filters.
    const rawFromUrl = Object.fromEntries(
      [...new Set(params.keys())].map((key) => [key, params.getAll(key)])
    );
    expect(parseSearchParams(rawFromUrl)).toEqual(filters);
  });

  it("omits default values to keep URLs clean", () => {
    const params = filtersToSearchParams(buildFilters({}));
    expect(params.toString()).toBe("");
  });
});
