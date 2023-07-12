import { test, expect } from '@playwright/test';

test.describe('Amazon Account List Menu', () => {
  /*
 Criteria: When a user visits the amazon.com website in the logged out state 
 and clicks on the Watchlist menu item they are redirected to a login/signup page.
*/
  test('is redirected to signup/login page', async ({ page }) => {
    await page.goto('https://www.amazon.com');

    //setup steps
    // 1. hover over account list menu to show the menu items
    // 2. click on the WatchList menu item
    const accountListMenu = page.locator('#nav-link-accountList');
    await accountListMenu.hover();

    const watchListOption = page.locator('a', { hasText: 'WatchList' });
    await watchListOption.click();

    //verify result
    const emailField = page.locator('#ap_email');
    await expect(emailField).toBeVisible();
  });
});
