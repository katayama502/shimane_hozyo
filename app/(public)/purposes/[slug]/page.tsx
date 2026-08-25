import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug, listAreas, listTags, searchSubsidies } from "@/lib/db/queries";
import { buildFilters } from "@/lib/search/params";
import { SubsidyFilterForm } from "@/components/search/SubsidyFilterForm";
import { SubsidyCard } from "@/components/subsidy/SubsidyCard";
import { Pagination } from "@/components/search/Pagination";

type Params = { slug: string };

const MIN_INDEXABLE_SUBSIDIES = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug("purpose", slug);
  if (!tag) return {};

  const results = await searchSubsidies(buildFilters({ purpose: [slug], page: 1 }));
  const shouldIndex = results.totalCount >= MIN_INDEXABLE_SUBSIDIES;

  return {
    title: `${tag.name}に使える補助金`,
    description: `島根県内で「${tag.name}」の取り組みに使える補助金・助成金を、市町村・県・全国制度から検索できます。`,
    alternates: { canonical: `/purposes/${slug}` },
    robots: { index: shouldIndex, follow: true },
  };
}

export default async function PurposePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tag = await getTagBySlug("purpose", slug);
  if (!tag) notFound();

  const [areas, purposeTags, industryTags, results] = await Promise.all([
    listAreas(),
    listTags("purpose"),
    listTags("industry"),
    searchSubsidies(buildFilters({ purpose: [slug] })),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-base font-semibold text-teal-700">目的から探す</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{tag.name}に使える補助金</h1>
      <p className="mt-2 max-w-2xl text-base text-slate-600">
        「{tag.name}」に取り組む事業者・団体向けの制度を、市町村・県・全国からまとめて掲載しています。
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        <details className="rounded-xl border border-slate-200 bg-white p-5 lg:hidden">
          <summary className="cursor-pointer text-lg font-bold text-slate-800">絞り込み</summary>
          <div className="mt-4">
            <SubsidyFilterForm
              action={`/purposes/${slug}`}
              filters={buildFilters({ purpose: [slug] })}
              areas={areas}
              purposeTags={purposeTags}
              industryTags={industryTags}
              lockedPurpose={slug}
              idPrefix="pm"
            />
          </div>
        </details>

        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-800">絞り込み</h2>
            <div className="mt-4">
              <SubsidyFilterForm
                action={`/purposes/${slug}`}
                filters={buildFilters({ purpose: [slug] })}
                areas={areas}
                purposeTags={purposeTags}
                industryTags={industryTags}
                lockedPurpose={slug}
                idPrefix="pd"
              />
            </div>
          </div>
        </aside>

        <div>
          {results.rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-800">現在該当する制度はありません</p>
              <p className="mt-2 text-base text-slate-500">条件を変えて再度お試しください。</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.rows.map((s) => (
                <SubsidyCard key={s.id} subsidy={s} />
              ))}
            </div>
          )}
          <Pagination
            basePath={`/purposes/${slug}`}
            filters={buildFilters({ purpose: [slug] })}
            page={results.page}
            totalPages={results.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
