import { getIngestionRuns } from "@/lib/db/admin-queries";
import { formatJstDateTime } from "@/lib/date";
import { SyncTrigger } from "@/components/admin/SyncTrigger";

export default async function AdminIngestionPage() {
  const runs = await getIngestionRuns(30);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Jグランツ同期</h1>
      <p className="mt-1 text-base text-slate-600">
        デジタル庁公開API（Jグランツ）から島根県関連の補助金情報を取得します。取得結果は下書き／要確認として保存され、公開には承認が必要です。
      </p>

      <div className="mt-6">
        <SyncTrigger />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">実行履歴</h2>
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
                <th className="px-4 py-3 font-medium">詳細</th>
              </tr>
            </thead>
            <tbody>
              {(runs ?? []).map((run) => (
                <tr key={run.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">{formatJstDateTime(run.started_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">{run.run_status}</td>
                  <td className="px-4 py-3 text-slate-700">{run.fetched_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.created_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.updated_count}</td>
                  <td className="px-4 py-3 text-slate-700">{run.error_count}</td>
                  <td className="px-4 py-3 text-slate-500">{run.error_message ?? "―"}</td>
                </tr>
              ))}
              {(!runs || runs.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
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
