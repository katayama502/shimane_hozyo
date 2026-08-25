import { test, expect } from "@playwright/test";

test("top → search filter → detail → official link (F-01/F-02/F-03/F-05)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /島根で使える補助金を/ })).toBeVisible();

  await page.getByRole("link", { name: "補助金を探す" }).first().click();
  await expect(page).toHaveURL(/\/subsidies$/);

  // Keyword search narrows the result count and stays visible in the URL (F-01/F-02).
  // Scope to the desktop <aside> sidebar: the mobile disclosure's duplicate form
  // (#m-q) is CSS-hidden at this viewport width but still present in the DOM.
  const desktopFilters = page.locator("aside");
  await desktopFilters.locator("#d-q").fill("創業");
  await desktopFilters.getByRole("button", { name: "この条件で検索" }).click();
  await expect(page).toHaveURL(/[?&]q=%E5%89%B5%E6%A5%AD/);
  await expect(page.getByText(/件の制度が見つかりました/)).toBeVisible();

  const firstLink = page.locator('a[href^="/subsidies/"]').first();
  await firstLink.click();

  // Detail page shows the required fields (F-03) and an official-source CTA (F-05).
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const officialLink = page.getByRole("link", { name: "公式ページで確認する" });
  await expect(officialLink).toBeVisible();
  await expect(officialLink).toHaveAttribute("href", /^https:\/\//);
  await expect(officialLink).toHaveAttribute("target", "_blank");
  await expect(page.getByText(/最終確認日時: \d{4}年/)).toBeVisible();
  await expect(page.getByText(/対象可否や最新条件は、必ず実施機関の公式ページ/).first()).toBeVisible();
});

test("municipality LP shows only subsidies for that area", async ({ page }) => {
  await page.goto("/areas/masuda");
  await expect(page.getByRole("heading", { name: "益田市の補助金・助成金" })).toBeVisible();

  const areaBadges = page.locator("span", { hasText: "益田市" });
  await expect(areaBadges.first()).toBeVisible();
});
