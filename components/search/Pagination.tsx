import Link from "next/link";
import type { SubsidyFilters } from "@/lib/search/params";
import { filtersToSearchParams } from "@/lib/search/params";

export function Pagination({
  basePath,
  filters,
  page,
  totalPages,
}: {
  basePath: string;
  filters: SubsidyFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = filtersToSearchParams({ ...filters, page: targetPage });
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="mt-8 flex items-center justify-center gap-3 text-base" aria-label="ページネーション">
      {prevDisabled ? (
        <span className="rounded-lg border border-slate-200 px-5 py-2.5 text-slate-300">前へ</span>
      ) : (
        <Link href={hrefFor(page - 1)} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
          前へ
        </Link>
      )}
      <span className="font-medium text-slate-600">
        {page} / {totalPages}
      </span>
      {nextDisabled ? (
        <span className="rounded-lg border border-slate-200 px-5 py-2.5 text-slate-300">次へ</span>
      ) : (
        <Link href={hrefFor(page + 1)} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
          次へ
        </Link>
      )}
    </nav>
  );
}
