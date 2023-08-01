import { test, expect } from '@playwright/test';

test.describe('Logged out - Currency change', () => {
  /*
    Criteria: When a user visits the amazon.com website in the logged out state and changes 
    the currency settings then the currency for the products should be displayed in the new currency that was selected.
  */
  test('is currency displayed updated on items to CRC - Costa Rican Colón', async ({ page, isMobile }) => {
    if(isMobile) test.skip();
    
    await page.goto("https://www.amazon.com/s?k=umbrella")

    //setup steps
    // 1. navigate to currency settings page
    // 2. select CRC - Costa Rican Colón in currency drop down and save changes
    // 3. verify prices in item Results.
    // 4. Optional: verify currency in other places where prices are showing for products?

    // Step #1
    const changeSettingsMenu = page.locator('#nav-tools').locator("#icp-nav-flyout");
    await changeSettingsMenu.hover();

    const changeCurrencyOption =  page.getByRole('link', { name: 'Change', exact: true })

    await expect(changeCurrencyOption).toBeVisible()
    await changeCurrencyOption.click();

    // Step #2
    const currencyDropDown = page.locator("#icp-currency-dropdown-selected-item-prompt");
    await currencyDropDown.click();

    const CRCCurrency = page.locator("li[id='CRC']");
    await CRCCurrency.click();

    const saveChangesBtn = page.getByRole('button', { name: 'Save Changes' })
    await saveChangesBtn.click();

    // Step #3
    const prices = page.locator(".a-price").first()
    await expect(prices).toContainText("CRC")
    
  });
});
