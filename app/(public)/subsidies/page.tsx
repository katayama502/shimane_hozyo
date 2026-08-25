import type { Metadata } from "next";
import Link from "next/link";
import { listAreas, listTags, searchSubsidies } from "@/lib/db/queries";
import { parseSearchParams, type RawSearchParams } from "@/lib/search/params";
import { SubsidyFilterForm } from "@/components/search/SubsidyFilterForm";
import { SortAutoSubmit } from "@/components/search/SortAutoSubmit";
import { SubsidyCard } from "@/components/subsidy/SubsidyCard";
import { Pagination } from "@/components/search/Pagination";

export const metadata: Metadata = {
  title: "補助金を探す",
  description: "島根県内19市町村と県・全国の補助金・助成金を、地域・目的・対象・締切から絞り込んで検索できます。",
  // Query-parameter search results are excluded from indexing per the SEO design
  // (canonical LPs at /areas/[slug] and /purposes/[slug] carry the indexable content).
  robots: { index: false, follow: true },
};

export default async function SubsidiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);

  const [areas, purposeTags, industryTags, results] = await Promise.all([
    listAreas(),
    listTags("purpose"),
    listTags("industry"),
    searchSubsidies(filters),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">補助金を探す</h1>
      <p className="mt-2 text-base text-slate-600">
        {results.totalCount}件の制度が見つかりました
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Mobile: collapsible filter disclosure acting as a lightweight bottom-sheet substitute */}
        <details className="rounded-xl border border-slate-200 bg-white p-5 lg:hidden">
          <summary className="cursor-pointer text-lg font-bold text-slate-800">
            絞り込み
          </summary>
          <div className="mt-4">
            <SubsidyFilterForm
              action="/subsidies"
              filters={filters}
              areas={areas}
              purposeTags={purposeTags}
              industryTags={industryTags}
              idPrefix="m"
            />
          </div>
        </details>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-800">絞り込み</h2>
            <div className="mt-4">
              <SubsidyFilterForm
                action="/subsidies"
                filters={filters}
                areas={areas}
                purposeTags={purposeTags}
                industryTags={industryTags}
                idPrefix="d"
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <form action="/subsidies" method="get">
              {/* Preserve current filters when the sort select auto-submits */}
              {filters.q && <input type="hidden" name="q" value={filters.q} />}
              {filters.area && <input type="hidden" name="area" value={filters.area} />}
              {filters.purpose.map((p) => (
                <input key={p} type="hidden" name="purpose" value={p} />
              ))}
              {filters.industry.map((i) => (
                <input key={i} type="hidden" name="industry" value={i} />
              ))}
              {filters.applicant && <input type="hidden" name="applicant" value={filters.applicant} />}
              {filters.status && <input type="hidden" name="status" value={filters.status} />}
              {filters.deadline && <input type="hidden" name="deadline" value={filters.deadline} />}
              {filters.amount && <input type="hidden" name="amount" value={filters.amount} />}
              <SortAutoSubmit defaultValue={filters.sort} />
            </form>
          </div>

          {results.rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-800">条件に一致する制度が見つかりませんでした</p>
              <p className="mt-2 text-base text-slate-500">
                絞り込み条件を減らすか、キーワードを変更してお試しください。
              </p>
              <Link
                href="/subsidies"
                className="mt-4 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                条件をリセット
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.rows.map((s) => (
                <SubsidyCard key={s.id} subsidy={s} />
              ))}
            </div>
          )}

          <Pagination
            basePath="/subsidies"
            filters={filters}
            page={results.page}
            totalPages={results.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
