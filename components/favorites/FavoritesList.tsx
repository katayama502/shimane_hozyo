"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SubsidySearchRow } from "@/lib/db/queries";
import { SubsidyCard } from "@/components/subsidy/SubsidyCard";
import { getFavoriteSlugs, subscribeFavorites } from "@/lib/favorites";

export function FavoritesList() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [subsidies, setSubsidies] = useState<SubsidySearchRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const slugs = getFavoriteSlugs();
      if (slugs.length === 0) {
        if (!cancelled) {
          setSubsidies([]);
          setStatus("ready");
        }
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs }),
        });
        if (!res.ok) throw new Error("failed to load favorites");
        const json = await res.json();
        if (!cancelled) {
          setSubsidies(json.subsidies ?? []);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    const unsubscribe = subscribeFavorites(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">お気に入り</h1>
      <p className="mt-2 text-base text-slate-600">
        この端末に保存したお気に入りです。ログインは不要ですが、端末やブラウザを変えると引き継がれません。
      </p>

      {status === "loading" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-base text-rose-700">
          お気に入りの読み込みに失敗しました。時間をおいて再度お試しください。
        </div>
      )}

      {status === "ready" && subsidies.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">まだお気に入りはありません</p>
          <p className="mt-2 text-base text-slate-500">
            気になる制度のカードにある☆マークをタップすると、ここに追加されます。
          </p>
          <Link
            href="/subsidies"
            className="mt-4 inline-block rounded-lg bg-teal-600 px-5 py-3 text-base font-semibold text-white hover:bg-teal-700"
          >
            補助金を探す
          </Link>
        </div>
      )}

      {status === "ready" && subsidies.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subsidies.map((s) => (
            <SubsidyCard key={s.id} subsidy={s} />
          ))}
        </div>
      )}
    </div>
  );
}
