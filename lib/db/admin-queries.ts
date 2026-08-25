import { getSupabaseServerClient } from "./server";
import type { Enums } from "./database.types";

type SubsidyStatus = Enums<"subsidy_status">;

const SUBSIDY_STATUSES: readonly SubsidyStatus[] = [
  "draft",
  "scheduled",
  "open",
  "anytime",
  "closed",
  "needs_review",
  "archived",
];

function isSubsidyStatus(value: string): value is SubsidyStatus {
  return (SUBSIDY_STATUSES as readonly string[]).includes(value);
}

/**
 * Admin-only queries. These rely on RLS ("subsidies admin full access" etc.)
 * granting access because the request carries an authenticated admin session
 * — there is no separate privileged client.
 */

export async function listAdminSubsidies(statusFilter?: string) {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("subsidies")
    .select(
      "id, slug, title, status, data_health, official_url, verified_at, published_at, external_id, organizations(name)"
    )
    .order("verified_at", { ascending: false })
    .limit(200);

  // Ignore unrecognized values (e.g. a hand-edited URL) rather than erroring.
  if (statusFilter && isSubsidyStatus(statusFilter)) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAdminSubsidyCounts() {
  const supabase = await getSupabaseServerClient();
  const [{ count: draftCount }, { count: needsReviewCount }, { count: totalCount }] = await Promise.all([
    supabase.from("subsidies").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("subsidies").select("id", { count: "exact", head: true }).eq("data_health", "needs_review"),
    supabase.from("subsidies").select("id", { count: "exact", head: true }),
  ]);
  return {
    draftCount: draftCount ?? 0,
    needsReviewCount: needsReviewCount ?? 0,
    totalCount: totalCount ?? 0,
  };
}

export async function getIngestionRuns(limit = 20) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ingestion_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export type AdminSubsidyDetail = {
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
  external_id: string | null;
  verified_at: string;
  published_at: string | null;
  organizations: { id: string; name: string } | null;
  subsidy_areas: { areas: { id: string; slug: string; name: string; level: string } | null }[];
  subsidy_tags: { tags: { id: string; slug: string; name: string; category: string } | null }[];
};

export async function getAdminSubsidyById(id: string): Promise<AdminSubsidyDetail | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("subsidies")
    .select(
      `
      id, slug, title, summary, status, data_health, applicant_types, eligible_expenses,
      subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
      application_start_at, application_end_at, official_url, guideline_url, contact_text,
      eligible_business_text, exclusion_notes, application_process, required_documents,
      external_id, verified_at, published_at,
      organizations ( id, name ),
      subsidy_areas ( areas ( id, slug, name, level ) ),
      subsidy_tags ( tags ( id, slug, name, category ) )
    `
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as AdminSubsidyDetail | null;
}

export async function getAdminChangeLogs(subsidyId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("change_logs")
    .select("*")
    .eq("subsidy_id", subsidyId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

export async function listAllAreas() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("areas").select("id, slug, name, level, region").order("sort_order");
  if (error) throw error;
  return data;
}

export async function listAllTagsForAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("tags").select("id, slug, name, category").order("category, sort_order");
  if (error) throw error;
  return data;
}
