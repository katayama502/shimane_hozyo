"use client";

import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-base font-bold text-rose-600">エラーが発生しました</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">ページを表示できませんでした</h1>
      <p className="mt-3 text-base text-slate-600">
        時間をおいて再度お試しください。問題が続く場合はお手数ですがトップページからやり直してください。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3.5 text-base font-bold text-white hover:bg-teal-700"
      >
        再読み込み
      </button>
    </div>
  );
}
