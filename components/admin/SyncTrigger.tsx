"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function SyncTrigger() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("島根");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function runSync() {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/sync-jgrants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "同期に失敗しました");
        const s = json.summary;
        setResult(
          `取得${s.fetched}件 / 新規${s.created}件 / 更新${s.updated}件 / 変更なし${s.skipped}件 / エラー${s.errors}件`
        );
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "同期に失敗しました");
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="keyword" className="block text-base font-semibold text-slate-700">
            検索キーワード
          </label>
          <input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
          />
        </div>
        <button
          type="button"
          onClick={runSync}
          disabled={pending}
          className="rounded-lg bg-teal-600 px-6 py-3.5 text-base font-bold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "同期中…" : "今すぐ同期"}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Jグランツ公開APIから最大15件を取得し、新規は下書き、更新は「要確認」として保存します。公開されるまで一般には表示されません。
      </p>
      {result && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{result}</p>}
      {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    </div>
  );
}
