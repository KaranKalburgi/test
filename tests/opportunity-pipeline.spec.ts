
import { test, expect, Page } from "@playwright/test";

async function createLeadAndConvert(page: Page) {
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
    await expect(page.getByRole("heading", { name: opportunityName, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Convert" }).click();

    const convertDialog = page.getByRole("dialog", { name: /Convert Lead/ });
    await expect(convertDialog).toBeVisible();

    await expect(convertDialog.getByLabel("First Name")).toHaveValue(firstName);
    await expect(convertDialog.getByLabel("Last Name")).toHaveValue(lastName);
    await expect(convertDialog.getByRole("button", { name: `${opportunityName}-` })).toBeVisible();

    await convertDialog.getByRole("button", { name: "Convert", exact: true }).click();
    await expect(page.getByText("Your lead has been converted", { exact: true })).toBeVisible();

    const opportunityCard = page.locator(".containerConvertedItem").filter({has: page.getByRole("heading", { name: "Opportunity", exact: true })});
    const opportunityLink = opportunityCard.locator(".primaryField a.outputLookupLink");

    await expect(opportunityLink).toBeVisible();
    await expect(opportunityLink).toContainText(opportunityName);
    await opportunityLink.click();
    await expect(page.getByRole("heading", { name: new RegExp(opportunityName) })).toBeVisible();

    return { opportunityName, opportunityPage: page };
}

async function changeStage(page: Page, stage: string) {
    await page.getByRole("button", { name: "Edit", exact: true }).click();

    const editDialog = page.getByRole("dialog", { name: /^Edit / });
    await expect(editDialog).toBeVisible();

    await editDialog.getByRole("combobox", { name: "Stage" }).click();
    await page.getByRole("option", { name: stage, exact: true }).click();
    await editDialog.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Edit Stage" }).locator("..")).toContainText(stage);
}

test.describe("Lead to Opportunity Pipeline", () => {

    test("create lead, convert and move opportunity through sales stages", async ({ page }) => {
        const { opportunityName, opportunityPage } = await createLeadAndConvert(page);

        const stages = [
            "Negotiation/Review",
            "Proposal/Price Quote",
            "Value Proposition",
            "Assessment Needed",
            "Develop Proposal",
            "Client Presentation",
            "Initiate Transfer",
            "Closed Won"
        ];

        for (const stage of stages) {
            await changeStage(opportunityPage, stage);
            await opportunityPage.reload();
            await expect(opportunityPage.getByRole("button", { name: "Edit Stage" }).locator("..")).toContainText(stage);
        }

        console.log("Opportunity created and closed won:", opportunityName);
    });

    test("create lead, convert and close opportunity as lost", async ({ page }) => {
        const { opportunityName, opportunityPage } = await createLeadAndConvert(page);

        await changeStage(opportunityPage, "Closed Lost");
        await opportunityPage.reload();

        await expect(opportunityPage.getByRole("button", { name: "Edit Stage" }).locator("..")).toContainText("Closed Lost");

        console.log("Opportunity closed as lost:", opportunityName);
    });
});