import { getSupabaseServerClient } from "./server";
import { amountRangeFor } from "@/lib/search/constants";
import type { SubsidyFilters } from "@/lib/search/params";

const PAGE_SIZE = 12;

export type SubsidySearchRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  data_health: string;
  applicant_types: string[];
  subsidy_rate_text: string | null;
  max_amount_yen: number | null;
  min_amount_yen: number | null;
  is_rolling: boolean;
  application_start_at: string | null;
  application_end_at: string | null;
  official_url: string;
  verified_at: string;
  organization_name: string | null;
  area_names: string[];
  purpose_tags: string[];
  industry_tags: string[];
  total_count: number;
};

export async function searchSubsidies(filters: SubsidyFilters) {
  const supabase = await getSupabaseServerClient();
  const amountRange = amountRangeFor(filters.amount);
  const offset = (filters.page - 1) * PAGE_SIZE;

  const { data, error } = await supabase.rpc("search_subsidies", {
    p_query: filters.q && filters.q.length >= 2 ? filters.q : undefined,
    p_area_slug: filters.area ?? undefined,
    p_purpose_slugs: filters.purpose.length ? filters.purpose : undefined,
    p_industry_slugs: filters.industry.length ? filters.industry : undefined,
    p_applicant_type: filters.applicant ?? undefined,
    p_status: filters.status ?? undefined,
    p_deadline_within_days: filters.deadline ? Number(filters.deadline) : undefined,
    p_amount_min: amountRange?.min ?? undefined,
    p_amount_max: amountRange?.max ?? undefined,
    p_sort: filters.sort,
    p_limit: PAGE_SIZE,
    p_offset: offset,
  });

  if (error) throw error;

  const rows = (data ?? []) as SubsidySearchRow[];
  const totalCount = rows[0]?.total_count ?? 0;

  return {
    rows,
    totalCount,
    pageSize: PAGE_SIZE,
    page: filters.page,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  };
}

export async function listAreas() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("areas")
    .select("id, slug, name, level, region, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listMunicipalities() {
  const areas = await listAreas();
  return areas.filter((a) => a.level === "municipality");
}

export async function getAreaBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("areas")
    .select("id, slug, name, level, region, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listTags(category: "purpose" | "industry" | "theme") {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, slug, name, category, sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTagBySlug(
  category: "purpose" | "industry" | "theme",
  slug: string
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, slug, name, category, sort_order")
    .eq("category", category)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type SubsidyDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  data_health: string;
  applicant_types: string[];
  eligible_expenses: string[];
  subsidy_rate_text: string | null;
  max_amount_yen: number | null;
  min_amount_yen: number | null;
  is_rolling: boolean;
  application_start_at: string | null;
  application_end_at: string | null;
  official_url: string;
  guideline_url: string | null;
  contact_text: string | null;
  eligible_business_text: string | null;
  exclusion_notes: string | null;
  application_process: string | null;
  required_documents: string | null;
  verified_at: string;
  published_at: string | null;
  organizations: {
    name: string;
    org_type: string | null;
    website_url: string | null;
    contact_text: string | null;
  } | null;
  subsidy_areas: { areas: { slug: string; name: string; level: string } | null }[];
  subsidy_tags: { tags: { slug: string; name: string; category: string } | null }[];
};

export async function getSubsidyBySlug(slug: string): Promise<SubsidyDetail | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("subsidies")
    .select(
      `
      id, slug, title, summary, status, data_health, applicant_types, eligible_expenses,
      subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
      application_start_at, application_end_at, official_url, guideline_url, contact_text,
      eligible_business_text, exclusion_notes, application_process, required_documents,
      verified_at, published_at,
      organizations ( name, org_type, website_url, contact_text ),
      subsidy_areas ( areas ( slug, name, level ) ),
      subsidy_tags ( tags ( slug, name, category ) )
    `
    )
    .eq("slug", slug)
    .neq("status", "draft")
    .not("published_at", "is", null)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as SubsidyDetail | null;
}

export async function getChangeLogs(subsidyId: string, limit = 10) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("change_logs")
    .select("id, field_name, old_value, new_value, created_at")
    .eq("subsidy_id", subsidyId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export type RelatedSubsidy = {
  id: string;
  slug: string;
  title: string;
  status: string;
  application_end_at: string | null;
  max_amount_yen: number | null;
};

export async function getRelatedSubsidies(
  subsidyId: string,
  areaSlug: string | null,
  limit = 4
): Promise<RelatedSubsidy[]> {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("subsidies")
    .select(
      "id, slug, title, status, application_end_at, max_amount_yen, subsidy_areas!inner(areas!inner(slug))"
    )
    .neq("id", subsidyId)
    .neq("status", "draft")
    .not("published_at", "is", null)
    .limit(limit);

  if (areaSlug) {
    query = query.eq("subsidy_areas.areas.slug", areaSlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as RelatedSubsidy[];
}

/** Looks up subsidies by slug (used by the localStorage-backed favorites page). */
export async function getSubsidiesBySlugs(slugs: string[]): Promise<SubsidySearchRow[]> {
  if (slugs.length === 0) return [];
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("subsidies")
    .select(
      `
      id, slug, title, summary, status, data_health, applicant_types,
      subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
      application_start_at, application_end_at, official_url, verified_at,
      organizations ( name ),
      subsidy_areas ( areas ( name ) ),
      subsidy_tags ( tags ( name, category ) )
    `
    )
    .in("slug", slugs)
    .neq("status", "draft")
    .not("published_at", "is", null);
  if (error) throw error;

  type Row = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    status: string;
    data_health: string;
    applicant_types: string[];
    subsidy_rate_text: string | null;
    max_amount_yen: number | null;
    min_amount_yen: number | null;
    is_rolling: boolean;
    application_start_at: string | null;
    application_end_at: string | null;
    official_url: string;
    verified_at: string;
    organizations: { name: string } | null;
    subsidy_areas: { areas: { name: string } | null }[];
    subsidy_tags: { tags: { name: string; category: string } | null }[];
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    status: effectiveStatusFor(row.status, row.application_end_at),
    data_health: row.data_health,
    applicant_types: row.applicant_types,
    subsidy_rate_text: row.subsidy_rate_text,
    max_amount_yen: row.max_amount_yen,
    min_amount_yen: row.min_amount_yen,
    is_rolling: row.is_rolling,
    application_start_at: row.application_start_at,
    application_end_at: row.application_end_at,
    official_url: row.official_url,
    verified_at: row.verified_at,
    organization_name: row.organizations?.name ?? null,
    area_names: row.subsidy_areas.map((sa) => sa.areas?.name).filter((n): n is string => !!n),
    purpose_tags: row.subsidy_tags
      .filter((st) => st.tags?.category === "purpose")
      .map((st) => st.tags!.name),
    industry_tags: row.subsidy_tags
      .filter((st) => st.tags?.category === "industry")
      .map((st) => st.tags!.name),
    total_count: 0,
  }));
}

function effectiveStatusFor(status: string, applicationEndAt: string | null): string {
  if (applicationEndAt && new Date(applicationEndAt).getTime() < Date.now()) return "closed";
  return status;
}

export async function getAreaSubsidyCounts(): Promise<Record<string, number>> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("area_subsidy_counts").select("area_slug, subsidy_count");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.area_slug) counts[row.area_slug] = row.subsidy_count ?? 0;
  }
  return counts;
}

export async function getTagSubsidyCounts(
  category: "purpose" | "industry" | "theme"
): Promise<Record<string, number>> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tag_subsidy_counts")
    .select("tag_slug, subsidy_count")
    .eq("category", category);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.tag_slug) counts[row.tag_slug] = row.subsidy_count ?? 0;
  }
  return counts;
}

export async function getSiteStats() {
  const supabase = await getSupabaseServerClient();
  const [{ count: totalCount }, { count: openCount }, { data: latest }] = await Promise.all([
    supabase.from("subsidies").select("id", { count: "exact", head: true }),
    supabase
      .from("subsidies")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "anytime"]),
    supabase
      .from("subsidies")
      .select("verified_at")
      .order("verified_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    totalCount: totalCount ?? 0,
    openCount: openCount ?? 0,
    lastVerifiedAt: latest?.verified_at ?? null,
  };
}
