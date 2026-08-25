import crypto from "node:crypto";
import { getSupabaseServerClient } from "@/lib/db/server";

const LIST_URL = "https://api.jgrants-portal.go.jp/exp/v1/public/subsidies";
const DETAIL_URL = (id: string) => `https://api.jgrants-portal.go.jp/exp/v1/public/subsidies/id/${id}`;

// Keeps a manually-triggered sync fast; raise once the mapping has proven itself.
const MAX_ITEMS_PER_RUN = 15;

type JgrantsListItem = {
  id: string;
  name: string;
  title: string;
  target_area_search: string | null;
  subsidy_max_limit: number | null;
  acceptance_start_datetime: string | null;
  acceptance_end_datetime: string | null;
  target_number_of_employees: string | null;
  institution_name: string | null;
};

type JgrantsDetail = JgrantsListItem & {
  subsidy_catch_phrase: string | null;
  subsidy_rate: string | null;
  use_purpose: string | null;
  industry: string | null;
  target_area_detail: string | null;
  project_end_deadline: string | null;
  front_subsidy_detail_page_url: string | null;
  application_guidelines: { name: string; data: string }[] | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Jグランツ API error ${res.status}: ${url}`);
  }
  return res.json();
}

function unwrapResult<T>(json: unknown): T[] {
  if (json && typeof json === "object" && "result" in json) {
    const result = (json as { result: unknown }).result;
    return Array.isArray(result) ? (result as T[]) : [result as T];
  }
  return [];
}

function slugFor(externalId: string): string {
  return `jgrants-${externalId.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}

function contentHashFor(fields: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(JSON.stringify(fields)).digest("hex");
}

/** Best-effort keyword match against our controlled tag vocabulary; admin can adjust after review. */
function guessTagIds(freeText: string | null, tags: { id: string; slug: string; name: string }[]): string[] {
  if (!freeText) return [];
  return tags.filter((t) => freeText.includes(t.name)).map((t) => t.id);
}

export type JgrantsSyncSummary = {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
};

export async function runJgrantsSync(keyword: string): Promise<JgrantsSyncSummary> {
  const supabase = await getSupabaseServerClient();
  const startedAt = new Date().toISOString();

  const { data: run, error: runError } = await supabase
    .from("ingestion_runs")
    .insert({ source_name: "jgrants", started_at: startedAt, run_status: "running" })
    .select("id")
    .single();
  if (runError) throw runError;

  const summary: JgrantsSyncSummary = {
    fetched: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    errorMessages: [],
  };

  try {
    const listParams = new URLSearchParams({
      keyword,
      sort: "created_date",
      order: "DESC",
      acceptance: "1",
    });
    const listJson = await fetchJson<unknown>(`${LIST_URL}?${listParams.toString()}`);
    const items = unwrapResult<JgrantsListItem>(listJson).slice(0, MAX_ITEMS_PER_RUN);
    summary.fetched = items.length;

    const [{ data: purposeTags }, { data: industryTags }, { data: shimaneArea }] = await Promise.all([
      supabase.from("tags").select("id, slug, name").eq("category", "purpose"),
      supabase.from("tags").select("id, slug, name").eq("category", "industry"),
      supabase.from("areas").select("id, slug").eq("slug", "shimane").maybeSingle(),
    ]);

    for (const item of items) {
      try {
        const detailJson = await fetchJson<unknown>(DETAIL_URL(item.id));
        const detailResults = unwrapResult<JgrantsDetail>(detailJson);
        const detail = detailResults[0] ?? (item as JgrantsDetail);

        const summaryText = detail.subsidy_catch_phrase?.trim() || detail.title;
        const officialUrl = detail.front_subsidy_detail_page_url || `https://www.jgrants-portal.go.jp/subsidy/${item.id}`;
        const guidelineUrl = detail.application_guidelines?.[0]?.data ?? null;

        const hashInput = {
          title: detail.title,
          summary: summaryText,
          max: detail.subsidy_max_limit,
          rate: detail.subsidy_rate,
          start: detail.acceptance_start_datetime,
          end: detail.acceptance_end_datetime,
          url: officialUrl,
        };
        const contentHash = contentHashFor(hashInput);

        const { data: existing } = await supabase
          .from("subsidies")
          .select("id, status, published_at, content_hash, title, summary, max_amount_yen, application_end_at")
          .eq("external_id", item.id)
          .maybeSingle();

        let organizationId: string | null = null;
        if (item.institution_name) {
          const { data: existingOrg } = await supabase
            .from("organizations")
            .select("id")
            .eq("name", item.institution_name)
            .maybeSingle();
          if (existingOrg) {
            organizationId = existingOrg.id;
          } else {
            const { data: newOrg, error: orgError } = await supabase
              .from("organizations")
              .insert({ name: item.institution_name, org_type: "Jグランツ掲載機関" })
              .select("id")
              .single();
            if (orgError) throw orgError;
            organizationId = newOrg.id;
          }
        }

        if (!existing) {
          const { data: inserted, error: insertError } = await supabase
            .from("subsidies")
            .insert({
              external_id: item.id,
              slug: slugFor(item.id),
              title: detail.title,
              summary: summaryText,
              status: "draft",
              data_health: "needs_review",
              subsidy_rate_text: detail.subsidy_rate,
              max_amount_yen: detail.subsidy_max_limit,
              application_start_at: detail.acceptance_start_datetime,
              application_end_at: detail.acceptance_end_datetime,
              official_url: officialUrl,
              guideline_url: guidelineUrl,
              organization_id: organizationId,
              eligible_business_text: detail.use_purpose,
              content_hash: contentHash,
              verified_at: new Date().toISOString(),
            })
            .select("id")
            .single();
          if (insertError) throw insertError;

          const purposeIds = guessTagIds(detail.use_purpose, purposeTags ?? []);
          const industryIds = guessTagIds(detail.industry, industryTags ?? []);
          const tagIds = [...purposeIds, ...industryIds];
          if (tagIds.length > 0) {
            await supabase
              .from("subsidy_tags")
              .insert(tagIds.map((tagId) => ({ subsidy_id: inserted.id, tag_id: tagId })));
          }
          if (shimaneArea && (item.target_area_search ?? "").includes("島根")) {
            await supabase
              .from("subsidy_areas")
              .insert({ subsidy_id: inserted.id, area_id: shimaneArea.id });
          }
          await supabase.from("sources").insert({
            subsidy_id: inserted.id,
            url: officialUrl,
            is_official: true,
            http_status: 200,
          });

          summary.created += 1;
        } else if (existing.content_hash !== contentHash) {
          const { error: updateError } = await supabase
            .from("subsidies")
            .update({
              title: detail.title,
              summary: summaryText,
              subsidy_rate_text: detail.subsidy_rate,
              max_amount_yen: detail.subsidy_max_limit,
              application_start_at: detail.acceptance_start_datetime,
              application_end_at: detail.acceptance_end_datetime,
              official_url: officialUrl,
              guideline_url: guidelineUrl,
              eligible_business_text: detail.use_purpose,
              content_hash: contentHash,
              data_health: "needs_review",
              verified_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (updateError) throw updateError;

          const changedFields: [string, string | null, string | null][] = [
            ["title", existing.title, detail.title],
            ["summary", existing.summary, summaryText],
            ["max_amount_yen", String(existing.max_amount_yen ?? ""), String(detail.subsidy_max_limit ?? "")],
            ["application_end_at", existing.application_end_at, detail.acceptance_end_datetime],
          ];
          for (const [field, oldVal, newVal] of changedFields) {
            if (oldVal !== newVal) {
              await supabase.from("change_logs").insert({
                subsidy_id: existing.id,
                field_name: field,
                old_value: oldVal,
                new_value: newVal,
                changed_by: "jgrants-sync",
                change_source: "ingestion",
              });
            }
          }

          summary.updated += 1;
        } else {
          summary.skipped += 1;
        }
      } catch (itemError) {
        summary.errors += 1;
        summary.errorMessages.push(
          `${item.id}: ${itemError instanceof Error ? itemError.message : String(itemError)}`
        );
      }
    }

    await supabase
      .from("ingestion_runs")
      .update({
        finished_at: new Date().toISOString(),
        run_status: summary.errors > 0 ? "partial" : "success",
        fetched_count: summary.fetched,
        created_count: summary.created,
        updated_count: summary.updated,
        error_count: summary.errors,
        error_message: summary.errorMessages.length > 0 ? summary.errorMessages.join("; ").slice(0, 2000) : null,
      })
      .eq("id", run.id);

    return summary;
  } catch (fatalError) {
    await supabase
      .from("ingestion_runs")
      .update({
        finished_at: new Date().toISOString(),
        run_status: "failed",
        error_message: fatalError instanceof Error ? fatalError.message : String(fatalError),
      })
      .eq("id", run.id);
    throw fatalError;
  }
}
