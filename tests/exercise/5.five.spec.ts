import { test, expect } from '@playwright/test';
import { getComparator } from 'playwright-core/lib/utils';

test.describe.only('Samsung Product detail', () => {

  test.beforeEach(async ({ page }) => {
    //specific test for this one product. Ideally there would be an array of products we could pull from and generate tests against those
    await page.goto("https://www.samsung.com/ca/smartphones/galaxy-s23/")

    // navigate to buy page where user can view color options
    const buyBtn = await page.locator('.floating-navigation__wrap').locator('a', { hasText: "Buy now"});
    await buyBtn.click();
  });

/**
 *  **Criteria:** When a user navigates to a smartphone detail page on www.samsung.com website on a mobile device. 
 *  The user should be able to select online exclusive colors and see a larger preview of the phone in that color.
*/

  test('is exclusive colours section/carousel visible', async ({ page }) => {

    const colorsSection = page.locator('#special-color');
  
    const exclusiveColors = colorsSection.getByRole('heading', { name: 'Online Exclusive Color', exact: true });
    await expect.soft(exclusiveColors).toBeVisible();

    const colorSwiper = colorsSection.locator('div[class="swiper-wrapper"]');
    await expect.soft(colorSwiper).toBeVisible();


    const colorSwiperChildren = colorSwiper.locator('div[an-ac="carousel"]');
    const colorItemCount = await colorSwiperChildren.count();
    expect(colorItemCount).toBeGreaterThanOrEqual(1);
    
  });

  test.only('is selecting color option updating main image preview', async ({ page }) => {
    const colorsSection = page.locator('#special-color');
  
    const exclusiveColors = colorsSection.getByRole('heading', { name: 'Online Exclusive Colour', exact: true });
    await expect(exclusiveColors).toBeVisible();

    const colorSwiper = colorsSection.locator('div[class="swiper-wrapper"]');
    await expect(colorSwiper).toBeVisible();

    const colorSwiperChildren = colorSwiper.locator('div[an-ac="carousel"]');
    const colorItemCount = await colorSwiperChildren.count();
    
    expect(colorItemCount).toBeGreaterThanOrEqual(1);


    const comparator = getComparator('image/png');
    for(let index = 0; index < colorItemCount; index++){
      const imagePreviewCurrent = colorsSection.locator('div[class="image"]').locator('a').locator('img')

      // take initial screenshot of image on page load before selection of exclusive color
      let previousImage = await imagePreviewCurrent.screenshot()

      let itemToSelect = colorSwiperChildren.nth(index);
      await itemToSelect.click();

      const imagePreviewNext = colorsSection.locator('div[class="image"]').locator('a').locator('img')

      let currentImage = await imagePreviewNext.screenshot()

      // compare image is not the same as the previous image
      expect.soft(comparator(previousImage, currentImage)).not.toBeNull();
    }
  });


});
