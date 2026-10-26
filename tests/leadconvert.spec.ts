import { test, expect } from "@playwright/test";

test("create lead and convert", async ({ page }) => {
    const timestamp = Date.now();
    const firstName = "Playwright";
    const lastName = `Test Lead ${timestamp}`;
    const opportunityName = `${firstName} ${lastName}`;

    await page.goto("/lightning/o/Lead/list");

    await page.getByRole("button", { name: "New", exact: true }).click();

    const newLeadDialog = page.getByRole("dialog", { name: "New Lead" });

    await newLeadDialog.getByRole("textbox", { name: "First Name" }).fill(firstName);
    await newLeadDialog.getByRole("textbox", { name: "Last Name" }).fill(lastName);
    await newLeadDialog.getByRole("textbox", { name: "Website" }).fill("www.testing.com");
    await newLeadDialog.getByRole("textbox", { name: "Email" }).fill(`playwright${timestamp}@example.com`);
    await newLeadDialog.getByRole("button", { name: "Save", exact: true }).click();

    await expect( page.getByRole("heading", { name: `${firstName} ${lastName}`, exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Convert" }).click();

    const convertDialog = page.getByRole("dialog", { name: /Convert Lead/ });
    await expect(convertDialog).toBeVisible();

    await expect(convertDialog.getByLabel("First Name")).toHaveValue(firstName);
    await expect(convertDialog.getByLabel("Last Name")).toHaveValue(lastName);
    await expect(convertDialog.getByRole("button", { name: `${opportunityName}-` })).toBeVisible();

    await convertDialog.getByRole("button", { name: "Convert", exact: true }).click();
    const toast = page.locator(".forceToastManager");
    const closeToast = toast.getByRole("button", { name: "Close" });
    if (await closeToast.isVisible()) {
        await closeToast.click();
    }

    await expect(page.getByText("Your lead has been converted", { exact: true })).toBeVisible();

});