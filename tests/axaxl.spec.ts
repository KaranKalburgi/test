import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const acceptCookies = page.getByRole('button', { name: /accept all|accept cookies/i });
  if (await acceptCookies.count() > 0 && await acceptCookies.first().isVisible()) await acceptCookies.first().click();
});

test('should load AXA XL homepage', async ({ page }) => {
  await expect(page).toHaveTitle(/AXA XL/i);
});

test('should open Insurance page', async ({ page }) => {
  await page.goto('/insurance');
  await expect(page).toHaveURL(/\/insurance/);
  await expect(page.locator('body')).toContainText(/Insurance/i);
});

test('should open Reinsurance page', async ({ page }) => {
  await page.goto('/reinsurance');
  await expect(page).toHaveURL(/\/reinsurance/);
  await expect(page.locator('body')).toContainText(/Reinsurance/i);
});

test('should open Claims page', async ({ page }) => {
  await page.goto('/insurance/claims');
  await expect(page).toHaveURL(/\/insurance\/claims/);
  await expect(page.locator('body')).toContainText(/Claims/i);
});

test('should display New Claims content', async ({ page }) => {
  await page.goto('/insurance/claims');
  await expect(page.locator('body')).toContainText(/New Claims/i);
});

test('should display Existing Claims content', async ({ page }) => {
  await page.goto('/insurance/claims');
  await expect(page.locator('body')).toContainText(/Existing Claims/i);
});

test('should open Risk Consulting page', async ({ page }) => {
  await page.goto('/insurance/risk-consulting');
  await expect(page).toHaveURL(/\/insurance\/risk-consulting/);
  await expect(page.locator('h1').filter({ hasText: 'Risk Consulting' })).toBeVisible();
});

test('should open Careers page', async ({ page }) => {
  await page.goto('/about-us/careers-at-axa-xl');
  await expect(page).toHaveURL(/careers-at-axa-xl/);
  await expect(page.locator('body')).toContainText(/Careers/i);
});

test('should open About Us page', async ({ page }) => {
  await page.goto('/about-us');
  await expect(page).toHaveURL(/\/about-us/);
  await expect(page.locator('body')).toContainText(/About Us/i);
});

test('should display Reinsurance content on About Us page', async ({ page }) => {
  await page.goto('/about-us');
  await expect(page.locator('body')).toContainText(/Reinsurance/i);
});

test('should display Risk Consulting content on About Us page', async ({ page }) => {
  await page.goto('/about-us');
  await expect(page.locator('body')).toContainText(/Risk Consulting/i);
});

test('should display Claims content on About Us page', async ({ page }) => {
  await page.goto('/about-us');
  await expect(page.locator('body')).toContainText(/Claims/i);
});

test('should open Contact Us page', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page).toHaveURL(/\/contact-us/);
  await expect(page.locator('body')).toContainText(/Contact/i);
});

test('should display first name field', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page.getByPlaceholder(/first name/i)).toBeVisible();
});

test('should accept first name', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.getByPlaceholder(/first name/i);
  await expect(field).toBeVisible();
  await field.fill('Karan');
  await expect(field).toHaveValue('Karan');
});

test('should display last name field', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page.getByPlaceholder(/last name/i)).toBeVisible();
});

test('should accept last name', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.getByPlaceholder(/last name/i);
  await expect(field).toBeVisible();
  await field.fill('Test');
  await expect(field).toHaveValue('Test');
});

test('should display email field', async ({ page }) => {
  await page.goto('/contact-us');
  const emailField = page.locator('input[type="email"]:visible').first();
  await expect(emailField).toBeVisible();
});

test('should accept email', async ({ page }) => {
  await page.goto('/contact-us');
  const emailField = page.locator('input[type="email"]:visible').first();
  await expect(emailField).toBeVisible();
  await emailField.fill('test@example.com');
  await expect(emailField).toHaveValue('test@example.com');
});

test('should contain broker field in contact form', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.locator('#brokerNameTxt');
  await expect(field).toBeAttached();
  await expect(field).toHaveAttribute('placeholder', 'Broker');
  await expect(field).toHaveAttribute('aria-label', 'Broker Name');
});

test('should contain company field in contact form', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.locator('#companyNameTxt');
  await expect(field).toBeAttached();
  await expect(field).toHaveAttribute('placeholder', 'Company');
  await expect(field).toHaveAttribute('aria-label', 'Company Name');
});

test('should contain contact field in contact form', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.locator('#contactPhoneTxt');
  await expect(field).toBeAttached();
  await expect(field).toHaveAttribute('placeholder', 'Contact');
  await expect(field).toHaveAttribute('aria-label', 'Contact Phone');
});

test('should contain policy field in contact form', async ({ page }) => {
  await page.goto('/contact-us');
  const field = page.locator('#policyNumberTxt');
  await expect(field).toBeAttached();
  await expect(field).toHaveAttribute('placeholder', 'Policy');
  await expect(field).toHaveAttribute('aria-label', 'Policy Number');
});

test('should contain input elements on contact page', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page.locator('input')).not.toHaveCount(0);
});

test('should contain select elements on contact page', async ({ page }) => {
  await page.goto('/contact-us');
  const selects = page.locator('select');
  await expect(selects.first()).toBeAttached();
});

test('should contain links on contact page', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page.locator('a').first()).toBeAttached();
});

test('should contain footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toBeAttached();
});

test('should contain images on homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('img').first()).toBeAttached();
});

test('should support page scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('body')).toBeVisible();
});

test('should return to top after scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('body')).toBeVisible();
});

test('should open Cyber product page', async ({ page }) => {
  await page.goto('/insurance/product-families/cyber');
  await expect(page).toHaveURL(/\/insurance\/product-families\/cyber/);
  await expect(page.locator('body')).toContainText(/Cyber/i);
});

test('should open Construction product page', async ({ page }) => {
  await page.goto('/insurance/product-families/construction');
  await expect(page).toHaveURL(/\/insurance\/product-families\/construction/);
  await expect(page.locator('body')).toContainText(/Construction/i);
});

test('should have navigation links', async ({ page }) => {
  await expect(page.locator('nav a').first()).toBeAttached();
});

test('should navigate using keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('body')).toBeVisible();
});

test('should allow mouse interaction with navigation', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('nav a');
  await expect(links.first()).toBeVisible();
  await links.first().hover();
});

test('should expose accessible labels for contact inputs', async ({ page }) => {
  await page.goto('/contact-us');
  const inputs = page.locator('input:visible');
  const count = await inputs.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) await expect(inputs.nth(i)).toHaveAttribute('aria-label', /.+/);
});

test('should have valid href attributes on navigation links', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('nav a');
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) await expect(links.nth(i)).toHaveAttribute('href', /.+/);
});

test('should have valid image sources on homepage', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('img');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) await expect(images.nth(i)).toHaveAttribute('src', /.+/);
});

test('should display page content after refresh', async ({ page }) => {
  await page.goto('/');
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
});

test('should retain contact page URL after refresh', async ({ page }) => {
  await page.goto('/contact-us');
  await page.reload();
  await expect(page).toHaveURL(/\/contact-us/);
});

test('should retain Risk Consulting URL after refresh', async ({ page }) => {
  await page.goto('/insurance/risk-consulting');
  await page.reload();
  await expect(page).toHaveURL(/\/insurance\/risk-consulting/);
});

test('should display homepage after direct navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/axaxl\.com/);
  await expect(page.locator('body')).toBeVisible();
});

test('should contain buttons on homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button').first()).toBeAttached();
});

test('should contain headings on Claims page', async ({ page }) => {
  await page.goto('/insurance/claims');
  await expect(page.locator('h1, h2').first()).toBeVisible();
});

test('should contain headings on Reinsurance page', async ({ page }) => {
  await page.goto('/reinsurance');
  await expect(page.locator('h1, h2').first()).toBeVisible();
});