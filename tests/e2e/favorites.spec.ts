import { test, expect } from "@playwright/test";

test("favoriting a subsidy without an account persists it locally (F-06)", async ({ page }) => {
  await page.goto("/subsidies");

  const firstCard = page.locator("div.relative.rounded-xl").first();
  const favoriteButton = firstCard.getByRole("button", { name: "お気に入りに追加" });
  const title = await firstCard.locator("h3").innerText();

  await favoriteButton.click();
  await expect(firstCard.getByRole("button", { name: "お気に入りから削除" })).toBeVisible();

  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "お気に入り" })).toBeVisible();
  await expect(page.getByText(title)).toBeVisible();

  // Un-favoriting removes it again.
  const favoritedCard = page.locator("div.relative.rounded-xl", { hasText: title });
  await favoritedCard.getByRole("button", { name: "お気に入りから削除" }).click();
  await expect(page.getByText("まだお気に入りはありません")).toBeVisible();
});
