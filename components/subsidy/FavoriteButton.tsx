"use client";

import { useSyncExternalStore } from "react";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";

function getServerSnapshot() {
  return false;
}

export function FavoriteButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  // useSyncExternalStore renders `getServerSnapshot` during SSR/hydration, then
  // switches to the real localStorage-backed value right after — no manual
  // effect + setState needed, and no hydration mismatch.
  const favorite = useSyncExternalStore(
    subscribeFavorites,
    () => isFavorite(slug),
    getServerSnapshot
  );

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(slug);
      }}
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${
        favorite
          ? "border-amber-300 bg-amber-50 text-amber-500"
          : "border-slate-200 bg-white text-slate-400 hover:text-amber-500"
      } ${className}`}
    >
      <svg viewBox="0 0 20 20" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <path d="M10 3.5l2.1 4.6 5 .6-3.7 3.5.9 5-4.3-2.5-4.3 2.5.9-5-3.7-3.5 5-.6L10 3.5z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
