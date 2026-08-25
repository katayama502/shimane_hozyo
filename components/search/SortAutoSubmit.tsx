"use client";

import { SORT_OPTIONS } from "@/lib/search/constants";

export function SortAutoSubmit({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-700"
      aria-label="並び順"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
