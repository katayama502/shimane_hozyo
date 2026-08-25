import Link from "next/link";
import { listAdminSubsidies } from "@/lib/db/admin-queries";
import { formatJstDateTime } from "@/lib/date";
import { statusLabel } from "@/lib/status";

const STATUS_FILTERS = [
  { value: "", label: "すべて" },
  { value: "draft", label: "承認待ち（下書き）" },
  { value: "open", label: "募集中" },
  { value: "scheduled", label: "募集予定" },
  { value: "closed", label: "終了" },
];

export default async function AdminSubsidiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const subsidies = await listAdminSubsidies(status || undefined);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">制度一覧・承認</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/subsidies?status=${f.value}` : "/admin/subsidies"}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              (status ?? "") === f.value
                ? "border-teal-500 bg-teal-50 text-teal-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">制度名</th>
              <th className="px-4 py-3 font-medium">状態</th>
              <th className="px-4 py-3 font-medium">データ健全性</th>
              <th className="px-4 py-3 font-medium">実施機関</th>
              <th className="px-4 py-3 font-medium">最終確認</th>
              <th className="px-4 py-3 font-medium">出典</th>
            </tr>
          </thead>
          <tbody>
            {(subsidies ?? []).map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/subsidies/${s.id}`} className="font-medium text-teal-700 hover:underline">
                    {s.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{statusLabel(s.status)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.data_health === "verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : s.data_health === "needs_review"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {s.data_health}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{s.organizations?.name ?? "―"}</td>
                <td className="px-4 py-3 text-slate-500">{formatJstDateTime(s.verified_at)}</td>
                <td className="px-4 py-3">
                  {s.external_id ? (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Jグランツ</span>
                  ) : (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">手動</span>
                  )}
                </td>
              </tr>
            ))}
            {(!subsidies || subsidies.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  該当する制度はありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
