import { test, expect } from '@playwright/test';
import fs from 'fs/promises';

test('Logs Page', async ({ page }) => {
    // Restore storage state from file before navigating to 'Logs Page'
    const storageState = await fs.readFile('./playwright-tests/login/LoginAuth.json', 'utf8');
    await page.context().storageState(JSON.parse(storageState));

    // Navigate to the base URL ('Logs Page' URL should be navigated based on the stored session)
    await page.goto(process.env["ZO_BASE_URL"] + "logs");
    await page.waitForTimeout(1000); // Wait for 1 second
    await page.locator('[data-cy="login-sign-in"]').click();
});
