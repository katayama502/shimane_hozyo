const JST_TIME_ZONE = "Asia/Tokyo";

const jstDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: JST_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

const jstDateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: JST_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Formats an ISO timestamp as a JST date, e.g. "2026年8月22日". */
export function formatJstDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return jstDateFormatter.format(new Date(iso));
}

/** Formats an ISO timestamp as a JST date + time, e.g. "2026年8月22日 18:30". */
export function formatJstDateTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return jstDateTimeFormatter.format(new Date(iso));
}

/**
 * Days remaining until `iso` (JST calendar-day granularity), relative to now.
 * Returns null when there's no deadline, negative once the deadline has passed.
 */
export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const target = toJstDateOnly(new Date(iso));
  const today = toJstDateOnly(new Date());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

function toJstDateOnly(date: Date): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isPast(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}
