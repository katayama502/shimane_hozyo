import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-base font-bold text-teal-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">ページが見つかりません</h1>
      <p className="mt-3 text-base text-slate-600">
        お探しのページは削除されたか、URLが変更された可能性があります。
      </p>
      <Link
        href="/subsidies"
        className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3.5 text-base font-bold text-white hover:bg-teal-700"
      >
        補助金を探す
      </Link>
    </div>
  );
}
