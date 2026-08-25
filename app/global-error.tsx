"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold text-rose-600">エラーが発生しました</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">サイトを表示できませんでした</h1>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          再読み込み
        </button>
      </body>
    </html>
  );
}
