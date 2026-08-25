"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/db/server";
import type { Enums } from "@/lib/db/database.types";

type SubsidyStatus = Enums<"subsidy_status">;
const PUBLISHABLE_STATUSES: readonly SubsidyStatus[] = [
  "open",
  "scheduled",
  "anytime",
  "closed",
  "needs_review",
  "archived",
];

async function logChange(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  subsidyId: string,
  fieldName: string,
  oldValue: string | null,
  newValue: string | null,
  changedBy: string
) {
  await supabase.from("change_logs").insert({
    subsidy_id: subsidyId,
    field_name: fieldName,
    old_value: oldValue,
    new_value: newValue,
    changed_by: changedBy,
    change_source: "manual",
  });
}

export async function publishSubsidy(formData: FormData) {
  const id = String(formData.get("id"));
  const rawStatus = String(formData.get("status"));
  if (!PUBLISHABLE_STATUSES.includes(rawStatus as SubsidyStatus)) {
    throw new Error(`invalid status: ${rawStatus}`);
  }
  const status: SubsidyStatus = rawStatus as SubsidyStatus;

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: current } = await supabase
    .from("subsidies")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("subsidies")
    .update({
      status,
      data_health: "verified",
      verified_at: new Date().toISOString(),
      published_at: current?.published_at ?? new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  await logChange(supabase, id, "status", current?.status ?? null, status, user?.email ?? "admin");

  revalidatePath("/admin/subsidies");
  revalidatePath(`/admin/subsidies/${id}`);
  redirect("/admin/subsidies");
}

export async function reverifySubsidy(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("subsidies")
    .update({ data_health: "verified", verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await logChange(supabase, id, "data_health", "needs_review", "verified", user?.email ?? "admin");

  revalidatePath("/admin/subsidies");
  revalidatePath(`/admin/subsidies/${id}`);
}

export async function deleteDraftSubsidy(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await getSupabaseServerClient();

  // Only ever discard rows that were never published, per F-08 (auto-fetched
  // data must not reach the public site without approval).
  const { error } = await supabase.from("subsidies").delete().eq("id", id).eq("status", "draft");
  if (error) throw error;

  revalidatePath("/admin/subsidies");
  redirect("/admin/subsidies");
}

export async function updateSubsidyClassification(formData: FormData) {
  const id = String(formData.get("id"));
  const areaIds = formData.getAll("areaIds").map(String);
  const tagIds = formData.getAll("tagIds").map(String);

  const supabase = await getSupabaseServerClient();

  const { error: deleteAreasError } = await supabase.from("subsidy_areas").delete().eq("subsidy_id", id);
  if (deleteAreasError) throw deleteAreasError;
  if (areaIds.length > 0) {
    const { error } = await supabase
      .from("subsidy_areas")
      .insert(areaIds.map((areaId) => ({ subsidy_id: id, area_id: areaId })));
    if (error) throw error;
  }

  const { error: deleteTagsError } = await supabase.from("subsidy_tags").delete().eq("subsidy_id", id);
  if (deleteTagsError) throw deleteTagsError;
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from("subsidy_tags")
      .insert(tagIds.map((tagId) => ({ subsidy_id: id, tag_id: tagId })));
    if (error) throw error;
  }

  revalidatePath(`/admin/subsidies/${id}`);
}
