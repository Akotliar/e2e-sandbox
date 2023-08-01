import { test, expect } from '@playwright/test';

test.describe('Logged out - Amazon Account List Menu', () => {
  /*
 Criteria: When a user visits the amazon.com website in the logged out state 
 and clicks on the Watchlist menu item they are redirected to a login/signup page.
*/
  test('is redirected to signup/login page when clicking on Watchlist', async ({ page, isMobile }) => {

    if(isMobile) test.skip();

    await page.goto('https://www.amazon.com');

    //setup steps
    // 1. hover over account list menu to show the menu items
    // 2. click on the WatchList menu item
    const accountListMenu = page.locator('#nav-link-accountList');
    await accountListMenu.hover();

    const watchListOption = page.locator('a', { hasText: 'Watchlist' });
    await watchListOption.click();

    //verify user is on the sign in/up page with some assertions
    const signInHeading = page.locator('h1', { hasText: "Sign in" });
    await expect(signInHeading).toBeVisible();

    const createAccountBtn = page.locator("a[id='createAccountSubmit']")
    await expect(createAccountBtn).toBeVisible()

  });
});
