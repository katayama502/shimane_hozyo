const STORAGE_KEY = "shimane-subsidy-favorites";
const FAVORITES_EVENT = "shimane-subsidy-favorites-change";

function readAll(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeAll(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

export function getFavoriteSlugs(): string[] {
  return readAll();
}

export function isFavorite(slug: string): boolean {
  return readAll().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const current = readAll();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  writeAll(next);
  return next.includes(slug);
}

/** Subscribes to favorite changes across components/tabs. Returns an unsubscribe fn. */
export function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(FAVORITES_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
