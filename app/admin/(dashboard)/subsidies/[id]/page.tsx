import { notFound } from "next/navigation";
import {
  getAdminChangeLogs,
  getAdminSubsidyById,
  listAllAreas,
  listAllTagsForAdmin,
} from "@/lib/db/admin-queries";
import {
  deleteDraftSubsidy,
  publishSubsidy,
  reverifySubsidy,
  updateSubsidyClassification,
} from "@/lib/admin/actions";
import { formatJstDateTime } from "@/lib/date";
import { statusLabel } from "@/lib/status";
import { STATUS_OPTIONS } from "@/lib/search/constants";

export default async function AdminSubsidyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subsidy, changeLogs, areas, tags] = await Promise.all([
    getAdminSubsidyById(id),
    getAdminChangeLogs(id),
    listAllAreas(),
    listAllTagsForAdmin(),
  ]);
  if (!subsidy) notFound();

  const selectedAreaIds = new Set(subsidy.subsidy_areas.map((sa) => sa.areas?.id).filter(Boolean));
  const selectedTagIds = new Set(subsidy.subsidy_tags.map((st) => st.tags?.id).filter(Boolean));

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        {statusLabel(subsidy.status)} ・ データ健全性: {subsidy.data_health}
        {subsidy.external_id && " ・ 出典: Jグランツ"}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{subsidy.title}</h1>
      <p className="mt-2 text-base text-slate-700">{subsidy.summary}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <Field label="実施機関" value={subsidy.organizations?.name ?? "未設定"} />
        <Field label="上限額" value={subsidy.max_amount_yen ? `¥${subsidy.max_amount_yen.toLocaleString()}` : "―"} />
        <Field label="補助率" value={subsidy.subsidy_rate_text ?? "―"} />
        <Field
          label="受付期間"
          value={`${formatJstDateTime(subsidy.application_start_at) ?? "―"} 〜 ${formatJstDateTime(subsidy.application_end_at) ?? "―"}`}
        />
        <Field label="最終確認日時" value={formatJstDateTime(subsidy.verified_at) ?? "―"} />
        <Field label="公開日時" value={formatJstDateTime(subsidy.published_at) ?? "未公開"} />
        <div className="col-span-2">
          <dt className="text-slate-500">公式URL</dt>
          <dd>
            <a href={subsidy.official_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline break-all">
              {subsidy.official_url}
            </a>
          </dd>
        </div>
        {subsidy.eligible_business_text && (
          <div className="col-span-2">
            <dt className="text-slate-500">対象事業（原文）</dt>
            <dd className="text-slate-700">{subsidy.eligible_business_text}</dd>
          </div>
        )}
      </dl>

      {/* 分類（市町村・タグ） */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">分類（公開前に必ず確認）</h2>
        <p className="mt-1 text-sm text-slate-500">
          自動取得データは地域・目的・業種を機械的に推定できないため、公開前にここで確認・修正してください。
        </p>
        <form action={updateSubsidyClassification} className="mt-3 space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <input type="hidden" name="id" value={subsidy.id} />
          <div>
            <p className="text-base font-semibold text-slate-700">対象地域</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {areas.map((a) => (
                <label key={a.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                  <input type="checkbox" name="areaIds" value={a.id} defaultChecked={selectedAreaIds.has(a.id)} />
                  {a.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-700">目的・業種タグ</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <label key={t.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                  <input type="checkbox" name="tagIds" value={t.id} defaultChecked={selectedTagIds.has(t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            分類を保存
          </button>
        </form>
      </section>

      {/* 承認アクション */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">承認アクション</h2>
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-end">
          <form action={publishSubsidy} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
            <input type="hidden" name="id" value={subsidy.id} />
            <div className="flex-1">
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700">
                公開ステータス
              </label>
              <select
                id="status"
                name="status"
                defaultValue={subsidy.status === "draft" ? "open" : subsidy.status}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
                <option value="anytime">随時受付</option>
              </select>
            </div>
            <button type="submit" className="rounded-lg bg-teal-600 px-5 py-2.5 text-base font-bold text-white hover:bg-teal-700">
              この内容で公開する
            </button>
          </form>

          {subsidy.status !== "draft" && (
            <form action={reverifySubsidy}>
              <input type="hidden" name="id" value={subsidy.id} />
              <button type="submit" className="rounded-lg border border-slate-300 px-5 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50">
                内容を確認済みにする
              </button>
            </form>
          )}

          {subsidy.status === "draft" && (
            <form action={deleteDraftSubsidy}>
              <input type="hidden" name="id" value={subsidy.id} />
              <button type="submit" className="rounded-lg border border-rose-300 px-5 py-2.5 text-base font-semibold text-rose-600 hover:bg-rose-50">
                却下（削除）
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 更新履歴 */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">更新履歴</h2>
        <ul className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          {(changeLogs ?? []).map((log) => (
            <li key={log.id}>
              {formatJstDateTime(log.created_at)} [{log.change_source}] {log.field_name}: 「{log.old_value ?? "―"}」→「{log.new_value ?? "―"}」
            </li>
          ))}
          {(!changeLogs || changeLogs.length === 0) && <li className="text-slate-400">履歴はありません</li>}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
