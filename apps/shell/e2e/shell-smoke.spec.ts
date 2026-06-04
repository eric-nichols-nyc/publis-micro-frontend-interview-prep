import { expect, test } from "@playwright/test";
import { signUpViaShell } from "./helpers/auth";

test.describe("MFE shell smoke", () => {
  test.beforeEach(async ({ page }) => {
    await signUpViaShell(page);
  });

  test("home loads shell chrome", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Shop Shell", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Shell (host application)")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open products" })
    ).toBeVisible();
  });

  test("/products loads federated catalog remote", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator('[data-remote="mfe-products"]')).toBeVisible({
      timeout: 45_000,
    });
    await expect(
      page.getByRole("heading", { name: "Products", level: 2 })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add to cart" }).first()).toBeVisible();
  });

  test("/cart loads federated cart remote", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator('[data-remote="mfe-cart"]')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByRole("heading", { name: "Cart", level: 2 })).toBeVisible();
  });

  test("main nav moves between federated routes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", {
      name: "Products",
    }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.locator('[data-remote="mfe-products"]')).toBeVisible({
      timeout: 45_000,
    });

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", {
      name: "Cart",
    }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator('[data-remote="mfe-cart"]')).toBeVisible({
      timeout: 45_000,
    });
  });
});
