import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await expect(page).toHaveURL('http://localhost:4200/');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page).toHaveURL('http://localhost:4200/?num=2');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page).toHaveURL('http://localhost:4200/?num=3');
});
