import { test, expect } from "@playwright/test";

test("edit first opportunity from All Opportunities", async ({ page }) => {
    await page.goto("/lightning/o/Opportunity/list");

    const firstOpportunity = page.locator("table tbody tr").first().getByRole("link").first();
    await firstOpportunity.click();

    await page.getByRole("button", { name: "Edit", exact: true }).click();
    const editDialog = page.getByRole("dialog", { name: /^Edit / });
    await expect(editDialog).toBeVisible();

    await editDialog.getByRole("combobox", { name: "Stage" }).click();
    await editDialog.getByRole("option", { name: "Client Presentation", exact: true }).click();
    await editDialog.getByRole("textbox", { name: "Close Date" }).fill("12/31/2026");
    await editDialog.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Edit Stage" }).locator("..")).toContainText("Client Presentation");
    await expect(page.getByRole("button", { name: "Edit Close Date" }).locator("..")).toContainText("12/31/2026");

});