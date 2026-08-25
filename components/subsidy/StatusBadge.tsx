import { statusBadgeClass, statusLabel } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(
        status
      )}`}
    >
      {statusLabel(status)}
    </span>
  );
}
