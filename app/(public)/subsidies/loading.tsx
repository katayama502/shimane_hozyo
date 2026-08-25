export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-96 animate-pulse rounded-xl bg-slate-100 lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
