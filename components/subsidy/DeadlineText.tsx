import { daysUntil, formatJstDate } from "@/lib/date";

export function DeadlineText({
  applicationEndAt,
  isRolling,
}: {
  applicationEndAt: string | null;
  isRolling: boolean;
}) {
  if (isRolling) {
    return <span className="text-slate-600">随時受付</span>;
  }
  if (!applicationEndAt) {
    return <span className="text-slate-500">締切は公式ページでご確認ください</span>;
  }

  const remaining = daysUntil(applicationEndAt);
  const dateLabel = formatJstDate(applicationEndAt);

  if (remaining === null) {
    return <span className="text-slate-600">{dateLabel} 締切</span>;
  }
  if (remaining < 0) {
    return <span className="text-slate-500">{dateLabel} 締切（終了）</span>;
  }
  if (remaining <= 7) {
    return (
      <span className="font-medium text-rose-600">
        {dateLabel} 締切（残り{remaining}日）
      </span>
    );
  }
  return (
    <span className="text-slate-700">
      {dateLabel} 締切（残り{remaining}日）
    </span>
  );
}
