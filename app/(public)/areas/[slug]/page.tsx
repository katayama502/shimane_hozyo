import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAreaBySlug, listAreas, listTags, searchSubsidies } from "@/lib/db/queries";
import { buildFilters } from "@/lib/search/params";
import { SubsidyFilterForm } from "@/components/search/SubsidyFilterForm";
import { SubsidyCard } from "@/components/subsidy/SubsidyCard";
import { Pagination } from "@/components/search/Pagination";
import { SITE_NAME } from "@/lib/site";

type Params = { slug: string };

// An LP with too little unique content is kept out of the index until it earns
// its place (design doc §5.2): at least 3 subsidies, or dedicated contact copy.
const MIN_INDEXABLE_SUBSIDIES = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) return {};

  const results = await searchSubsidies(buildFilters({ area: slug, page: 1 }));
  const shouldIndex = results.totalCount >= MIN_INDEXABLE_SUBSIDIES;

  return {
    title: `${area.name}の補助金・助成金`,
    description: `${area.name}で使える補助金・助成金を、島根県・全国制度とあわせて検索できます。最終確認日と公式情報つき。`,
    alternates: { canonical: `/areas/${slug}` },
    robots: { index: shouldIndex, follow: true },
  };
}

export default async function AreaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) notFound();

  const [areas, purposeTags, industryTags, results] = await Promise.all([
    listAreas(),
    listTags("purpose"),
    listTags("industry"),
    searchSubsidies(buildFilters({ area: slug })),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-base font-semibold text-teal-700">{area.region ? `${area.region}エリア` : SITE_NAME}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        {area.name}の補助金・助成金
      </h1>
      <p className="mt-2 max-w-2xl text-base text-slate-600">
        {area.name}に事業所や活動拠点がある方向けの制度を、島根県・全国制度とあわせて掲載しています。
        条件を絞り込んで、公式情報とあわせてご確認ください。
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        <details className="rounded-xl border border-slate-200 bg-white p-5 lg:hidden">
          <summary className="cursor-pointer text-lg font-bold text-slate-800">絞り込み</summary>
          <div className="mt-4">
            <SubsidyFilterForm
              action={`/areas/${slug}`}
              filters={buildFilters({ area: slug })}
              areas={areas}
              purposeTags={purposeTags}
              industryTags={industryTags}
              lockedArea={slug}
              idPrefix="am"
            />
          </div>
        </details>

        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-800">絞り込み</h2>
            <div className="mt-4">
              <SubsidyFilterForm
                action={`/areas/${slug}`}
                filters={buildFilters({ area: slug })}
                areas={areas}
                purposeTags={purposeTags}
                industryTags={industryTags}
                lockedArea={slug}
                idPrefix="ad"
              />
            </div>
          </div>
        </aside>

        <div>
          {results.rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-800">現在{area.name}で掲載中の制度はありません</p>
              <p className="mt-2 text-base text-slate-500">
                今後の公募開始に備えて、県・全国制度もあわせてご確認ください。
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.rows.map((s) => (
                <SubsidyCard key={s.id} subsidy={s} />
              ))}
            </div>
          )}
          <Pagination
            basePath={`/areas/${slug}`}
            filters={buildFilters({ area: slug })}
            page={results.page}
            totalPages={results.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
