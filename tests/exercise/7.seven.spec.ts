import { test, expect } from '@playwright/test';

test.describe('Razer.com shopping cart', () => {

/**
  **Criteria:** As a https://www.razer.com/ online store customer I would like to add an Exclusive product to my 
  shopping cart and change the quantity of the item in my cart and verify that the price is updated accordingly.

  note:  an EXCLUSIVE item has an orange tag on the product image as seen in the image attached.
*/

  test.only('is able to update quantity of exclusive item', async ({ page, isMobile }) => {

    if(isMobile) test.skip();

    await page.goto("https://www.razer.com/store");

    /*
    * get the exclusives section. there is multiples (the parent and it's children sections) in this case 
    * we want the parent section
    */
    const exclusivesSection = page.locator('#exclusives', { hasText: "RAZER EXCLUSIVES"}).first();

    const firstItem = exclusivesSection.locator('li', { hasText: "EXCLUSIVE" }).first();
    const itemSku = await firstItem.getAttribute('data-sku');

    const itemBuyBtn = firstItem.locator('a', { hasText: "Buy"});
    await itemBuyBtn.scrollIntoViewIfNeeded();
    await itemBuyBtn.click();

    await page.waitForSelector(`#mm-add-to-cart_${itemSku}`);


    // in product details
    const productName = await page.locator('h1[class="product-name"]').textContent();
    const addToCartBtn = page.locator(`#mm-add-to-cart_${itemSku}`);
    await addToCartBtn.scrollIntoViewIfNeeded();
    await addToCartBtn.click();

    // in checkout page
    const productCartItem = page.locator('div', { has: page.locator('span', { hasText: productName!! })});
    const removeItemBtn = productCartItem.locator('button[aria-label="Remove item from cart"]');
    const addItemBtn = productCartItem.locator('button[aria-label="Increase quantity of item"]')
    const reduceItemBtn = productCartItem.locator('button[aria-label="Reduce quantity of item"]')
    const itemQuantityElement = productCartItem.locator('div[class="cart-quantity"]');
    let itemQuantity = await itemQuantityElement.textContent();

    //verify remove button is showing and we should only have quantity of 1
    await expect(removeItemBtn).toBeVisible();
    await expect(addItemBtn).toBeVisible();
    await expect(reduceItemBtn).not.toBeVisible();
    expect(itemQuantity).toContain('1')

    //update item quantity and assert updates
    await addItemBtn.click();
    await page.waitForSelector('button[aria-label="Reduce quantity of item"]')
    itemQuantity = await itemQuantityElement.textContent();
    await expect(removeItemBtn).not.toBeVisible();
    await expect(reduceItemBtn).toBeVisible();
    expect(itemQuantity).toContain('2')

  });
});
