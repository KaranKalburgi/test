import { test, expect } from '@playwright/test';

const baseUrl = 'https://the-internet.herokuapp.com';

test('verify home page', async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle(/The Internet/);
  await expect(page.getByRole('heading', { name: 'Welcome to the-internet' })).toBeVisible();
});

test('verify available examples', async ({ page }) => {
  await page.goto(baseUrl);
  const links = page.locator('#content ul li a');
  await expect(links).not.toHaveCount(0);
});

test('click checkbox', async ({ page }) => {
  await page.goto(`${baseUrl}/checkboxes`);
  const checkboxes = page.locator('input[type="checkbox"]');
  await checkboxes.nth(0).check();
  await expect(checkboxes.nth(0)).toBeChecked();
});

test('uncheck checkbox', async ({ page }) => {
  await page.goto(`${baseUrl}/checkboxes`);
  const checkbox = page.locator('input[type="checkbox"]').nth(1);
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
});

test('select dropdown option', async ({ page }) => {
  await page.goto(`${baseUrl}/dropdown`);
  const dropdown = page.locator('#dropdown');
  await dropdown.selectOption('1');
  await expect(dropdown).toHaveValue('1');
});

test('select dropdown by label', async ({ page }) => {
  await page.goto(`${baseUrl}/dropdown`);
  const dropdown = page.locator('#dropdown');
  await dropdown.selectOption({ label: 'Option 2' });
  await expect(dropdown).toHaveValue('2');
});

test('handle JavaScript alert', async ({ page }) => {
  await page.goto(`${baseUrl}/javascript_alerts`);
  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('I am a JS Alert');
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});

test('handle JavaScript confirmation accept', async ({ page }) => {
  await page.goto(`${baseUrl}/javascript_alerts`);
  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toHaveText('You clicked: Ok');
});

test('handle JavaScript confirmation dismiss', async ({ page }) => {
  await page.goto(`${baseUrl}/javascript_alerts`);
  page.once('dialog', async dialog => {
    await dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
});

test('handle JavaScript prompt', async ({ page }) => {
  await page.goto(`${baseUrl}/javascript_alerts`);
  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt');
    await dialog.accept('Karan');
  });
  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
  await expect(page.locator('#result')).toHaveText('You entered: Karan');
});

test('fill input field', async ({ page }) => {
  await page.goto(`${baseUrl}/inputs`);
  const input = page.locator('input[type="number"]');
  await input.fill('12345');
  await expect(input).toHaveValue('12345');
});

test('clear input field', async ({ page }) => {
  await page.goto(`${baseUrl}/inputs`);
  const input = page.locator('input[type="number"]');
  await input.fill('100');
  await input.clear();
  await expect(input).toHaveValue('');
});

test('verify input accepts keyboard value', async ({ page }) => {
  await page.goto(`${baseUrl}/inputs`);
  const input = page.locator('input[type="number"]');
  await input.pressSequentially('5678');
  await expect(input).toHaveValue('5678');
});

test('hover over element', async ({ page }) => {
  await page.goto(`${baseUrl}/hovers`);
  const figure = page.locator('.figure').first();
  await figure.hover();
  await expect(figure.locator('.figcaption')).toBeVisible();
});

test('hover over second element', async ({ page }) => {
  await page.goto(`${baseUrl}/hovers`);
  const figure = page.locator('.figure').nth(1);
  await figure.hover();
  await expect(figure.locator('.figcaption')).toBeVisible();
});

test('drag and drop element', async ({ page }) => {
  await page.goto(`${baseUrl}/drag_and_drop`);
  const source = page.locator('#column-a');
  const target = page.locator('#column-b');
  await source.dragTo(target);
  await expect(target).toHaveText(/A/);
});

test('open new browser window', async ({ page, context }) => {
  await page.goto(`${baseUrl}/windows`);
  const newPagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newPage = await newPagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/\/windows\/new/);
  await expect(newPage.getByRole('heading', { name: 'New Window' })).toBeVisible();
});

test('switch between browser pages', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');
  const newPagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newPage = await newPagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle('New Window');
  await expect(newPage.locator('h3')).toHaveText('New Window');
  await page.bringToFront();
  await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
});

test('work with iframe', async ({ page }) => {
  await page.goto(`${baseUrl}/iframe`);
  const frame = page.frameLocator('#mce_0_ifr');
  await expect(frame.locator('body')).toContainText('Your content goes here.');
});

test('read content inside iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  const frame = page.frameLocator('#mce_0_ifr');
  const body = frame.locator('body');
  await expect(body).toBeVisible();
  await expect(body).toHaveAttribute('contenteditable', 'false');
  await expect(body).toContainText('Your content goes here');
});

test('basic authentication with valid credentials', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'admin'
    }
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/basic_auth`);
  await expect(page.locator('body')).toContainText('Congratulations!');
  await context.close();
});

test('verify sortable table data', async ({ page }) => {
  await page.goto(`${baseUrl}/tables`);
  const rows = page.locator('#table1 tbody tr');
  await expect(rows).toHaveCount(4);
});

test('read data from table row', async ({ page }) => {
  await page.goto(`${baseUrl}/tables`);
  const firstName = await page.locator('#table1 tbody tr').first().locator('td').nth(1).textContent();
  expect(firstName).toBeTruthy();
});

test('find specific value in table', async ({ page }) => {
  await page.goto(`${baseUrl}/tables`);
  await expect(page.locator('#table1')).toContainText('Smith');
});

test('handle dynamic loading', async ({ page }) => {
  await page.goto(`${baseUrl}/dynamic_loading/1`);
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

test('handle dynamic loading second example', async ({ page }) => {
  await page.goto(`${baseUrl}/dynamic_loading/2`);
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

test('verify disappearing elements', async ({ page }) => {
  await page.goto(`${baseUrl}/disappearing_elements`);
  const links = page.locator('#content li a');
  await expect(links).not.toHaveCount(0);
});

test('verify status code page', async ({ page }) => {
  const response = await page.goto(`${baseUrl}/status_codes/200`);
  expect(response?.status()).toBe(200);
});

test('verify 404 response', async ({ page }) => {
  const response = await page.goto(`${baseUrl}/status_codes/404`);
  expect(response?.status()).toBe(404);
});

test('verify page navigation', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await expect(page).toHaveURL(/\/login/);
  await page.goto(`${baseUrl}/checkboxes`);
  await expect(page).toHaveURL(/\/checkboxes/);
});

test('use CSS selector', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});

test('use text locator', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await expect(page.getByText('Login Page')).toBeVisible();
});

test('use role locator', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('verify element count', async ({ page }) => {
  await page.goto(`${baseUrl}/checkboxes`);
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(2);
});

test('verify element attribute', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  await expect(page.locator('#username')).toHaveAttribute('name', 'username');
});

test('use keyboard Tab action', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  const username = page.locator('#username');
  const password = page.locator('#password');
  await username.focus();
  await page.keyboard.type('admin');
  await expect(username).toHaveValue('admin');
  await page.keyboard.press('Tab');
  await expect(password).toBeFocused();
  await page.keyboard.type('password');
  await expect(password).toHaveValue('password');
});