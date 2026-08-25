export const APPLICANT_TYPES = [
  "法人",
  "個人事業主",
  "創業予定",
  "農林水産",
  "NPO・団体",
  "個人・世帯",
] as const;

export const STATUS_OPTIONS = [
  { value: "open", label: "募集中" },
  { value: "scheduled", label: "募集予定" },
  { value: "anytime", label: "随時受付" },
  { value: "closed", label: "終了" },
] as const;

export const DEADLINE_OPTIONS = [
  { value: "7", label: "7日以内" },
  { value: "30", label: "30日以内" },
  { value: "60", label: "60日以内" },
] as const;

export const AMOUNT_OPTIONS = [
  { value: "0-500000", label: "50万円未満", min: 0, max: 500000 },
  { value: "500000-1000000", label: "50万円〜100万円", min: 500000, max: 1000000 },
  { value: "1000000-3000000", label: "100万円〜300万円", min: 1000000, max: 3000000 },
  { value: "3000000-", label: "300万円以上", min: 3000000, max: null },
] as const;

export const SORT_OPTIONS = [
  { value: "recommended", label: "おすすめ順" },
  { value: "deadline", label: "締切が近い順" },
  { value: "updated", label: "更新が新しい順" },
  { value: "amount", label: "上限額が高い順" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function amountRangeFor(value: string | undefined) {
  return AMOUNT_OPTIONS.find((o) => o.value === value);
}
