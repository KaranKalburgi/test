import { test as setup, expect } from '@playwright/test';
setup('Salesforce login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.SF_USERNAME!);
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SF_PASSWORD!);
    await page.getByRole('button', { name: 'Log In' }).click();

    await page.waitForURL(/\/(lightning|setup|identity)/, { timeout: 60000 });

    if (await page.getByText(/verification code/i).isVisible().catch(() => false)) {
        console.log('Enter the Salesforce verification code in the browser.');
        await page.waitForTimeout(120000);
    }

    await expect(page).toHaveURL(/lightning/, { timeout: 60000 });

    await page.context().storageState({
        path: 'playwright/.auth/user.json'
    });
});