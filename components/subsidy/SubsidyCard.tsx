import Link from "next/link";
import type { SubsidySearchRow } from "@/lib/db/queries";
import { StatusBadge } from "./StatusBadge";
import { DeadlineText } from "./DeadlineText";
import { FavoriteButton } from "./FavoriteButton";
import { formatAmountRange } from "@/lib/format";
import { formatJstDate } from "@/lib/date";

export function SubsidyCard({ subsidy }: { subsidy: SubsidySearchRow }) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={subsidy.status} />
          {subsidy.area_names.slice(0, 2).map((name) => (
            <span
              key={name}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
            >
              {name}
            </span>
          ))}
        </div>
        <FavoriteButton slug={subsidy.slug} className="h-11 w-11 shrink-0" />
      </div>

      <Link href={`/subsidies/${subsidy.slug}`} className="mt-3 block">
        <h3 className="text-lg font-bold text-slate-900 hover:underline">
          {subsidy.title}
        </h3>
      </Link>
      <p className="mt-1.5 line-clamp-2 text-base text-slate-600">{subsidy.summary}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-base">
        <div className="col-span-2 flex flex-wrap gap-x-1.5 sm:col-span-1">
          <dt className="text-slate-500">上限額</dt>
          <dd className="font-semibold text-slate-800">
            {formatAmountRange(subsidy.min_amount_yen, subsidy.max_amount_yen)}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="sr-only">締切</dt>
          <dd>
            <DeadlineText
              applicationEndAt={subsidy.application_end_at}
              isRolling={subsidy.is_rolling}
            />
          </dd>
        </div>
      </dl>

      {subsidy.purpose_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subsidy.purpose_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{subsidy.organization_name ?? "実施機関未設定"}</span>
        <span>最終確認: {formatJstDate(subsidy.verified_at)}</span>
      </div>
    </div>
  );
}
