export type SubsidyDisplayStatus =
  | "open"
  | "scheduled"
  | "anytime"
  | "closed"
  | "needs_review"
  | "archived";

export const STATUS_LABELS: Record<SubsidyDisplayStatus, string> = {
  open: "募集中",
  scheduled: "募集予定",
  anytime: "随時受付",
  closed: "終了",
  needs_review: "要確認",
  archived: "終了",
};

/** Tailwind color classes per status, used for badges. */
export const STATUS_BADGE_CLASSES: Record<SubsidyDisplayStatus, string> = {
  open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  scheduled: "bg-sky-100 text-sky-800 border-sky-200",
  anytime: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  needs_review: "bg-amber-100 text-amber-800 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status as SubsidyDisplayStatus] ?? status;
}

export function statusBadgeClass(status: string): string {
  return (
    STATUS_BADGE_CLASSES[status as SubsidyDisplayStatus] ??
    "bg-gray-100 text-gray-600 border-gray-200"
  );
}

/**
 * The status as it should be displayed to users: if the application deadline
 * has already passed, the subsidy reads as "closed" regardless of the stored
 * status value (F-07: expired subsidies flip to 終了 automatically).
 */
export function effectiveStatus(
  status: string,
  applicationEndAt: string | null
): string {
  if (applicationEndAt && new Date(applicationEndAt).getTime() < Date.now()) {
    return "closed";
  }
  return status;
}
