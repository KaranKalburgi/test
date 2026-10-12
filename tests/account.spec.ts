import { test, expect } from '@playwright/test';
import { title } from 'node:process';

test.describe('Account', () => {
  test('create account', async ({ page }) => {
    await page.goto('/lightning/o/Account/list');
    await page.getByRole('button', { name: 'New' }).click();
    await expect(page.getByRole('radio')).toHaveCount(4);
    await page.getByRole('radio', {name: 'Person Account'}).check();
    await page.getByRole('button', { name: 'Next' }).click();

    const accountName = `Playwright Account ${Date.now()}`;

    await page.getByLabel('last Name').fill(accountName);
    await page.getByLabel('Description').fill('this is the test account for playwright testing is created');
    await page.getByLabel('Phone').fill('9876543210');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(accountName, { exact: true })).toBeVisible();
  });

  test('edit account', async ({ page }) => {
    await page.goto('/lightning/o/Account/list');
    const accountName = `Playwright Edit Account ${Date.now()}`;

    await page.getByRole('button', { name: 'New' }).click();
    await page.getByRole('radio', {name: 'Person Account'}).check();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByLabel('Last Name').fill(accountName);
    await page.getByLabel('Phone').fill('9876543210');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(accountName, { exact: true })).toBeVisible();
    await page.getByText(accountName, { exact: true }).click();
    await page.getByRole('button', {name: 'Show more actions'}).click();
    await page.getByRole('menu',{name: 'Edit'}).click();
    await page.getByLabel('Phone').fill('9999999999');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('9999999999', { exact: true })).toBeVisible();
  });
});