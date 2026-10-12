import { test as setup, expect } from '@playwright/test';
setup('Salesforce login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.SF_USERNAME!);
    await page.getByRole('button',{name: 'Log in'}).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SF_PASSWORD!);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/lightning/);
    await page.context().storageState({
        path: 'playwright/.auth/user.json'
  });
});