const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function formatYen(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined) return null;
  return yenFormatter.format(amount);
}

/** e.g. "上限 500万円" style compact label used on cards. */
export function formatAmountRange(
  minYen: number | null,
  maxYen: number | null
): string {
  if (maxYen === null && minYen === null) return "金額は公式ページでご確認ください";
  if (minYen !== null && maxYen !== null && minYen !== maxYen) {
    return `${formatYen(minYen)}〜${formatYen(maxYen)}`;
  }
  const amount = maxYen ?? minYen;
  return `上限 ${formatYen(amount)}`;
}
