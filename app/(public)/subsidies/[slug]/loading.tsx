export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
      <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 h-24 animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
