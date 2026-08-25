import { z } from "zod";
import { SORT_OPTIONS, type SortValue } from "./constants";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function firstOf(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  // Native <select>/<input> GET submissions send every field, including unset
  // ones as "" (e.g. the "指定なし" placeholder option) — treat those as absent
  // rather than as a literal empty-string filter value.
  return v === "" ? undefined : v;
}

const sortValues = SORT_OPTIONS.map((o) => o.value) as [SortValue, ...SortValue[]];

const filtersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  area: z.string().trim().max(50).optional(),
  purpose: z.array(z.string().trim().max(50)).default([]),
  industry: z.array(z.string().trim().max(50)).default([]),
  applicant: z.string().trim().max(50).optional(),
  status: z.string().trim().max(50).optional(),
  deadline: z.string().trim().max(10).optional(),
  amount: z.string().trim().max(30).optional(),
  sort: z.enum(sortValues).default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
});

export type SubsidyFilters = z.infer<typeof filtersSchema>;

/** Builds a filters object from partial overrides, useful for internal queries (top page sections, LPs). */
export function buildFilters(overrides: Partial<SubsidyFilters> = {}): SubsidyFilters {
  return filtersSchema.parse(overrides);
}

export function parseSearchParams(searchParams: RawSearchParams): SubsidyFilters {
  const parsed = filtersSchema.safeParse({
    q: firstOf(searchParams.q),
    area: firstOf(searchParams.area),
    purpose: toArray(searchParams.purpose),
    industry: toArray(searchParams.industry),
    applicant: firstOf(searchParams.applicant),
    status: firstOf(searchParams.status),
    deadline: firstOf(searchParams.deadline),
    amount: firstOf(searchParams.amount),
    sort: firstOf(searchParams.sort),
    page: firstOf(searchParams.page),
  });

  if (parsed.success) return parsed.data;

  // Fall back to defaults rather than erroring the page on a malformed URL.
  return filtersSchema.parse({});
}

/** Builds a query string from filters, dropping empty values. Used for pagination/sort links. */
export function filtersToSearchParams(filters: Partial<SubsidyFilters>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.area) params.set("area", filters.area);
  for (const p of filters.purpose ?? []) params.append("purpose", p);
  for (const i of filters.industry ?? []) params.append("industry", i);
  if (filters.applicant) params.set("applicant", filters.applicant);
  if (filters.status) params.set("status", filters.status);
  if (filters.deadline) params.set("deadline", filters.deadline);
  if (filters.amount) params.set("amount", filters.amount);
  if (filters.sort && filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}
