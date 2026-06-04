import { expect, type Page } from "@playwright/test";

const E2E_PASSWORD = "password123";

export const createE2eEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

/** Register via shell UI; lands on `/` when sign-up succeeds. */
export async function signUpViaShell(page: Page, email = createE2eEmail()) {
  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
    timeout: 30_000,
  });
  return email;
}
