import { test, expect, selectors } from '@playwright/test';

test.describe('Etsy shopping cart', () => {

  /**
   **Criteria:** When a user navigates https://www.etsy.com/. the user should be able to add items to the Favorite items list
   and the items should be added/displayed in the favourites items page. 
 
    note:  there are various locations an item can be added. you can decide which flow.
 */
 /* 
  made this test be really generic and can have different flows to get to the cart even from the details page. 
  can consider improving this by breaking it down to specific scenarios with items that have those variations of flow. 
*/
  test('is item added to shopping cart from search list', async ({ page, context, isMobile }) => {
    if(isMobile) test.skip();

    await page.goto("https://www.etsy.com/c/accessories")

    const categoryGridResults = page.locator("div[data-listing-card-v2]");
    const categoryCount = await categoryGridResults.count()
    const selectIndex = randomSelection(0, categoryCount - 1)
    const categoryItem = categoryGridResults.nth(selectIndex)
    const itemTitle = await categoryItem.locator('h3').textContent()
    await categoryItem.click();

    // slow page load in new tab.
    await page.waitForTimeout(2000);
  
    /*
     a new tab opens when clicking on item so we need ot get all the page contexts
     here so we can locate elements within the new tab
    */
    let pages =  context.pages();

    //some items have option/variation selection. 
    const variationSelectors = pages[1].locator('[data-selector="listing-page-variations"]').locator('select');
    const variationCount = await variationSelectors.count()
    if(variationCount > 0){
      for(let index = 0; index < variationCount; index++){
        const selectorInput = variationSelectors.nth(index);
        await selectorInput.selectOption({index: 2});
      }
    }

    // some items have a custom text option. fill the field in if this field exists for selected item.
    const customization = pages[1].locator("textarea[id='listing-page-personalization-textarea']");
    const customizationExists = (await customization.count()) > 0
    const customizationVisible = await customization.isVisible()
    if(customizationExists && customizationVisible){
      await customization.fill("Custom Item Test");
    }

    await pages[1].waitForLoadState('load');

    const addtoCartButton = pages[1].locator('form[class="add-to-cart-form"]').locator("button[type='submit']");
    await addtoCartButton.click();

    // page/modal load slow.
    await pages[1].waitForTimeout(2000)

    // sometimes a modal appears instead of going straight to the cart.
    const viewCart = pages[1].getByRole('link', { name: 'View basket & check out' });
    const viewCartVisible = await viewCart.isVisible();
    if(viewCartVisible) await viewCart.click({timeout: 10000});

    const cartItemAdded = pages[1].locator('a', { hasText: itemTitle!! });
    await expect(cartItemAdded).toBeVisible({timeout: 10000});
    
  });
});


function randomSelection(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}