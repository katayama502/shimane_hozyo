import Link from "next/link";
import { getAdminSubsidyCounts, getIngestionRuns } from "@/lib/db/admin-queries";
import { formatJstDateTime } from "@/lib/date";

export default async function AdminDashboardPage() {
  const [counts, runs] = await Promise.all([getAdminSubsidyCounts(), getIngestionRuns(5)]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="承認待ち（下書き）" value={counts.draftCount} href="/admin/subsidies?status=draft" tone="amber" />
        <StatCard label="要確認" value={counts.needsReviewCount} href="/admin/subsidies" tone="rose" />
        <StatCard label="掲載制度 合計" value={counts.totalCount} href="/admin/subsidies" tone="teal" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/subsidies?status=draft"
          className="rounded-lg bg-teal-600 px-5 py-3 text-base font-bold text-white hover:bg-teal-700"
        >
          承認待ちを確認する
        </Link>
        <Link
          href="/admin/ingestion"
          className="rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
        >
          Jグランツ同期を実行
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">直近の同期履歴</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">開始</th>
                <th className="px-4 py-3 font-medium">結果</th>
                <th className="px-4 py-3 font-medium">取得</th>
                <th className="px-4 py-3 font-medium">新規</th>
                <th className="px-4 py-3 font-medium">更新</th>
                <th className="px-4 py-3 font-medium">エラー</th>
              </tr>
            </thead>
            <tbody>
              {(runs ?? []).map((run) => (
                <tr key={run.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-700">{formatJstDateTime(run.started_at)}</td>
                  <td className="px-4 py-3">
                    <RunStatusBadge status={run.run_status} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{run.fetched_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.created_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.updated_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.error_count}</td>
                </tr>
              ))}
              {(!runs || runs.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    同期履歴はまだありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone: "amber" | "rose" | "teal";
}) {
  const toneClass = {
    amber: "text-amber-700",
    rose: "text-rose-700",
    teal: "text-teal-700",
  }[tone];
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${toneClass}`}>{value}</p>
    </Link>
  );
}

function RunStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    running: "実行中",
    success: "成功",
    partial: "一部失敗",
    failed: "失敗",
  };
  const classes: Record<string, string> = {
    running: "bg-sky-100 text-sky-700",
    success: "bg-emerald-100 text-emerald-700",
    partial: "bg-amber-100 text-amber-700",
    failed: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status] ?? "bg-slate-100 text-slate-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}
