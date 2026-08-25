import type { MetadataRoute } from "next";
import { getSupabaseServerClient } from "@/lib/db/server";
import { SITE_URL } from "@/lib/site";

const MIN_INDEXABLE_SUBSIDIES = 3;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await getSupabaseServerClient();

  const [{ data: subsidies }, { data: areas }, { data: purposeTags }, { data: areaCounts }, { data: tagCounts }] =
    await Promise.all([
      supabase.from("subsidies").select("slug, updated_at").neq("status", "draft").not("published_at", "is", null),
      supabase.from("areas").select("slug").eq("level", "municipality"),
      supabase.from("tags").select("slug").eq("category", "purpose"),
      supabase.from("area_subsidy_counts").select("area_slug, subsidy_count"),
      supabase.from("tag_subsidy_counts").select("tag_slug, subsidy_count").eq("category", "purpose"),
    ]);

  const areaCountMap = new Map((areaCounts ?? []).map((r) => [r.area_slug, r.subsidy_count ?? 0]));
  const tagCountMap = new Map((tagCounts ?? []).map((r) => [r.tag_slug, r.subsidy_count ?? 0]));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/subsidies`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/favorites`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const subsidyEntries: MetadataRoute.Sitemap = (subsidies ?? []).map((s) => ({
    url: `${SITE_URL}/subsidies/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const areaEntries: MetadataRoute.Sitemap = (areas ?? [])
    .filter((a) => (areaCountMap.get(a.slug) ?? 0) >= MIN_INDEXABLE_SUBSIDIES)
    .map((a) => ({
      url: `${SITE_URL}/areas/${a.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const purposeEntries: MetadataRoute.Sitemap = (purposeTags ?? [])
    .filter((t) => (tagCountMap.get(t.slug) ?? 0) >= MIN_INDEXABLE_SUBSIDIES)
    .map((t) => ({
      url: `${SITE_URL}/purposes/${t.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticEntries, ...subsidyEntries, ...areaEntries, ...purposeEntries];
}
