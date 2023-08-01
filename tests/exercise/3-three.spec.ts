import { test as base , expect } from '@playwright/test';

const test = base.extend({
  page: async ({ page, isMobile }, use) => {
    if(isMobile) test.skip();

    await page.goto('https://www.ikea.com/ca/en/');

    const oneTrustOKbtn = page.locator('button[id="onetrust-accept-btn-handler"]');
    await oneTrustOKbtn.click();

    await use(page);
  },
});

test.describe('Products page', () => {
  /*
     Criteria: When a user visits the https://www.ikea.com/ website and then navigates to a products page 
     (i.e outdoor furniture). On the product page the user should be able to add a furniture item to a shopping list.
  */
  test('is product item added to shopping list', async ({ page }) => {
    //setup steps
    // 1. navigate to a products page
    // 2. add a product to shopping list
    // 3. verify item has been added to shopping list

    // step #1
    const hamMenu = page.locator(
      'button[aria-labelledby="hnf-header-hamburger-label"]'
    );
    await hamMenu.click();

    const productMenuLink = page.locator('a[data-tracking-label="products"]');
    await productMenuLink.click();

    const allFurnitureCat = page.locator('a', { hasText: 'All furniture' });
    await allFurnitureCat.click();

    const subMenuAllFurnCat = page.getByLabel('Submenu for All furniture');
    const outdoorFurnitureCat = subMenuAllFurnCat.locator('a', {
      hasText: 'Outdoor furniture',
    });
    await outdoorFurnitureCat.click();

    await page.waitForLoadState('domcontentloaded');

    // Step #2
    const aProductCard = page.getByTestId("plp-product-card").first();
    await aProductCard.click();

    await page.waitForLoadState('domcontentloaded')

    // get product details for later verification:
    const productInfoName = await page.locator(".pip-header-section__container-text").locator("span").first().textContent()
    const productInfoDescription = await page.locator(".pip-header-section__container-text").locator("span").last().textContent()

    const addToShoppingListBtn = page.getByRole('button', { name: 'Save to shopping list' }).first()
    await expect(addToShoppingListBtn).toBeVisible();
    await addToShoppingListBtn.click();

    // step # 3
    const toastPopUp = page.locator('div[class="hnf-toast hnf-toast--show"]').first();
    const toastShowBtn = toastPopUp.locator('span', {hasText: "Show"}).first()


    // verify product detail page events/updates occured using screenshot verification.
    await expect(toastPopUp).toBeVisible();
    await expect(toastPopUp).toHaveScreenshot('toast_message_added_item.png');

    const removeShoppingListBtn = page.getByRole('button', { name: 'Remove from shopping list' });
    await expect(removeShoppingListBtn).toHaveScreenshot("added_to_shopping_list_state.png");

    // navigate to shopping list page and verify item is in the shopping list
    await toastShowBtn.click();

    await page.waitForLoadState('domcontentloaded')

    const itemsList = page.getByTestId("retail-items");
   
    const itemWithTitle = itemsList.locator("li", { has: page.locator("a", { hasText: productInfoName || "failed to get name"})});
    await expect(itemWithTitle).toBeVisible();

    const itemDescription = itemWithTitle.locator("li", { hasText: productInfoDescription || "failed to get description"});
    await expect(itemDescription).toBeVisible();
  });
});
