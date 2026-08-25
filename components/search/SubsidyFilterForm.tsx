import Link from "next/link";
import type { SubsidyFilters } from "@/lib/search/params";
import {
  AMOUNT_OPTIONS,
  APPLICANT_TYPES,
  DEADLINE_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/search/constants";

type Area = { slug: string; name: string; level: string; region: string | null };
type Tag = { slug: string; name: string };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base";
const labelClass = "block text-base font-semibold text-slate-700";
const chipClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3.5 py-2 text-base text-slate-700 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700";

export function SubsidyFilterForm({
  action,
  filters,
  areas,
  purposeTags,
  industryTags,
  lockedArea,
  lockedPurpose,
  idPrefix,
}: {
  action: string;
  filters: SubsidyFilters;
  areas: Area[];
  purposeTags: Tag[];
  industryTags: Tag[];
  lockedArea?: string;
  lockedPurpose?: string;
  idPrefix: string;
}) {
  const municipalities = areas.filter((a) => a.level === "municipality");
  const regions = Array.from(new Set(municipalities.map((a) => a.region).filter(Boolean))) as string[];

  return (
    <form action={action} method="get" className="space-y-6">
      <div>
        <label htmlFor={`${idPrefix}-q`} className={labelClass}>
          キーワード
        </label>
        <input
          id={`${idPrefix}-q`}
          type="text"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="制度名・実施機関など（2文字以上）"
          className={inputClass}
        />
      </div>

      {lockedArea ? (
        <input type="hidden" name="area" value={lockedArea} />
      ) : (
        <div>
          <label htmlFor={`${idPrefix}-area`} className={labelClass}>
            所在地
          </label>
          <select
            id={`${idPrefix}-area`}
            name="area"
            defaultValue={filters.area ?? ""}
            className={`${inputClass} bg-white`}
          >
            <option value="">全国・島根県全域を含むすべて</option>
            <option value="shimane">島根県（県全域の制度）</option>
            {regions.map((region) => (
              <optgroup key={region} label={`${region}エリア`}>
                {municipalities
                  .filter((a) => a.region === region)
                  .map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {lockedPurpose ? (
        <input type="hidden" name="purpose" value={lockedPurpose} />
      ) : (
        <fieldset>
          <legend className={labelClass}>目的</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {purposeTags.map((tag) => (
              <label key={tag.slug} className={chipClass}>
                <input
                  type="checkbox"
                  name="purpose"
                  value={tag.slug}
                  defaultChecked={filters.purpose.includes(tag.slug)}
                  className="sr-only"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className={labelClass}>業種</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {industryTags.map((tag) => (
            <label key={tag.slug} className={chipClass}>
              <input
                type="checkbox"
                name="industry"
                value={tag.slug}
                defaultChecked={filters.industry.includes(tag.slug)}
                className="sr-only"
              />
              {tag.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${idPrefix}-applicant`} className={labelClass}>
          対象
        </label>
        <select
          id={`${idPrefix}-applicant`}
          name="applicant"
          defaultValue={filters.applicant ?? ""}
          className={`${inputClass} bg-white`}
        >
          <option value="">指定なし</option>
          {APPLICANT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className={labelClass}>
          募集状況
        </label>
        <select
          id={`${idPrefix}-status`}
          name="status"
          defaultValue={filters.status ?? ""}
          className={`${inputClass} bg-white`}
        >
          <option value="">すべて</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-deadline`} className={labelClass}>
          締切
        </label>
        <select
          id={`${idPrefix}-deadline`}
          name="deadline"
          defaultValue={filters.deadline ?? ""}
          className={`${inputClass} bg-white`}
        >
          <option value="">指定なし</option>
          {DEADLINE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-amount`} className={labelClass}>
          上限金額
        </label>
        <select
          id={`${idPrefix}-amount`}
          name="amount"
          defaultValue={filters.amount ?? ""}
          className={`${inputClass} bg-white`}
        >
          <option value="">指定なし</option>
          {AMOUNT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-teal-600 px-5 py-3.5 text-base font-bold text-white hover:bg-teal-700"
        >
          この条件で検索
        </button>
        <Link
          href={action}
          className="rounded-lg border border-slate-300 px-5 py-3.5 text-center text-base font-semibold text-slate-600 hover:bg-slate-50"
        >
          リセット
        </Link>
      </div>
    </form>
  );
}
