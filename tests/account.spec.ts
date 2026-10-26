import { test, expect } from "@playwright/test";
import { title } from "node:process";

test.describe("Account", () => {
  test("create account", async ({ page }) => {
    await page.goto("/lightning/o/Account/list");
    await page.getByRole("button", { name: "New" }).click();
    await expect(page.getByRole("radio")).toHaveCount(4);
    await page.getByText("Person Account", { exact: true }).click();
    await page.getByRole("button", { name: "Next" }).click();

    const accountName = `Playwright Account ${Date.now()}`;

    await page.getByLabel("last Name").fill(accountName);
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByLabel("Description").fill("this is the test account for playwright testing is created");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole('heading', { name: accountName, exact: true })).toBeVisible();
  });

  test("edit account", async ({ page }) => {
    await page.goto("/lightning/o/Account/list");
    const accountName = `Playwright Edit Account ${Date.now()}`;

    await page.getByRole("button", { name: "New" }).click();
    await page.getByText("Person Account", { exact: true }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("Last Name").fill(accountName);
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole('heading', { name: accountName, exact: true })).toBeVisible();
    const toast = page.locator(".forceToastManager");
    const closeToast = toast.getByRole("button", { name: "Close" });
    if (await closeToast.isVisible()) {
        await closeToast.click();
    }
    await page.getByRole("button", { name: "Show more actions" }).click();
    await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByRole('option', { name: 'Female', exact: true }).click();
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("combobox", { name: "Gender" })).toContainText("Female");
  });
});