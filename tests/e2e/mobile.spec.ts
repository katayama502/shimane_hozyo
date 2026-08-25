import { test, expect } from "@playwright/test";

// Viewport-only mobile emulation (no WebKit device preset) so this still runs
// against the installed Chromium browser.
test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

test("primary search flow completes at 375px width", async ({ page }) => {
  await page.goto("/subsidies");

  // Filters are collapsed behind a <details>/<summary> disclosure on narrow viewports.
  const mobileFilters = page.locator("details");
  await mobileFilters.locator("summary").click();

  await mobileFilters.locator("#m-area").selectOption("matsue");
  await mobileFilters.getByRole("button", { name: "この条件で検索" }).click();

  await expect(page).toHaveURL(/area=matsue/);
  await expect(page.getByText(/件の制度が見つかりました/)).toBeVisible();

  await page.locator('a[href^="/subsidies/"]').first().click();
  await expect(page.getByRole("link", { name: "公式ページで確認する" })).toBeVisible();
});
