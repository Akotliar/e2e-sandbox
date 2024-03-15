import { test, expect } from '@playwright/test';

test.describe.only('Booking.com', () => {
  /**
   **Criteria**: Write an automated test script using Playwright that accomplishes the following tasks on Booking.com
    1. Navigate and Search for Accommodations
   */
  test.skip('User able to search for a destination with a check in and check out date (today -> 10 days from now)', async ({
    page,
  }) => {
    // - Open the browser and navigate to the Booking.com homepage (https://www.booking.com).
    // - Submit the search.
    await page.goto('https://booking.com');
    await page.waitForTimeout(2000);
    //some popup appears for marketing. close it
    await page.keyboard.press('Escape');

    //Find the search input field and enter a destination of your choice (e.g., "New York").
    const searchInput = page.locator(
      'input[aria-label="Where are you going?"]'
    );

    await searchInput.fill('New York');
    await page.waitForTimeout(1500);
    const autoCompleteResult = page.locator('[id="autocomplete-result-0"]');
    await autoCompleteResult.click();
    await page.waitForTimeout(1500);

    // - Select check-in and check-out dates. Ensure these dates are at least one month from today's date to avoid availability issues.
    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 10);
    const formattedEndDate = endDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const datePickerButton = page.getByTestId('searchbox-datepicker-calendar');
    await datePickerButton.click();
    await page.waitForTimeout(2000);

    const datePicker = page.getByTestId('searchbox-datepicker-calendar');
    const startDateBtn = datePicker.locator(
      `span[data-date="${formattedToday.toString()}"]`
    );

    await startDateBtn.click();

    await page.waitForTimeout(2000);

    const endDateBtn = datePicker.locator(
      `span[data-date="${formattedEndDate.toString()}"]`
    );

    await endDateBtn.click();

    await page.waitForTimeout(2000);

    const searchButton = page
      .getByTestId('searchbox-layout-wide')
      .locator('button[type="submit"]');

    await searchButton.click();

    const searchHeading = page.locator('h1');
    await expect(searchHeading).toContainText('New York');
  });

  /**
   Filter Search Results:
    Once on the search results page, apply a filter to narrow down the results. For example, you could filter by "Star rating" and select "5 stars".
    Wait for the page to reload with the filtered results.
 */
  test.only('User able to filter results by star rating', async ({ page }) => {
    // - Open the browser and navigate to the Booking.com homepage (https://www.booking.com).
    // - Submit the search.
    await page.goto('https://booking.com');
    //some popup appears for marketing. close it
    await page.waitForSelector('div[role="dialog"]', { state: 'visible' });
    await page.keyboard.press('Escape');

    //Find the search input field and enter a destination of your choice (e.g., "New York").
    const searchInput = page.locator(
      'input[aria-label="Where are you going?"]'
    );

    await searchInput.fill('New York');
    //lazy timeout to wait for the suggesstion list to show
    await page.waitForTimeout(1500);
    const autoCompleteResult = page.locator('[id="autocomplete-result-0"]');
    await autoCompleteResult.click();

    if (await page.isVisible('button[data-command="noop"]')) {
      await page.click('button[data-command="noop"]');
    }

    // - Select check-in and check-out dates. Ensure these dates are at least one month from today's date to avoid availability issues.
    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 10);
    const formattedEndDate = endDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const datePickerButton = page
      .getByTestId('searchbox-layout-wide')
      .getByTestId('searchbox-dates-container');
    await datePickerButton.click({ force: true });
    await page.waitForTimeout(500);

    const datePicker = page.getByTestId('searchbox-datepicker-calendar');
    await expect(datePicker).toBeVisible();
    const startDateBtn = datePicker.locator(
      `span[data-date="${formattedToday.toString()}"]`
    );

    await startDateBtn.click();

    const endDateBtn = datePicker.locator(
      `span[data-date="${formattedEndDate.toString()}"]`
    );

    await endDateBtn.click();

    await page.waitForTimeout(1000);

    const searchButton = page
      .getByTestId('searchbox-layout-wide')
      .locator('button[type="submit"]');

    await searchButton.click();

    const searchHeading = page.locator('h1');
    await expect(searchHeading).toContainText('New York');

    const starFiltersGroup = page
      .locator('div[data-testid="filters-group"]', {
        has: page.locator('h3', { hasText: 'Property rating' }),
      })
      .first();

    const fiveStarCheckbx = starFiltersGroup.locator(
      'div[data-filters-item="class:class=5"]'
    );
    await fiveStarCheckbx.click({ force: true });

    await expect(async () => {
      const propertyCards = page.getByTestId('property-card-container');
      const cardsCount = await propertyCards.count();
      for (let i = 0; i < cardsCount; i++) {
        const card = propertyCards.nth(i);
        const ratingStars = card.getByTestId('rating-stars');

        expect(await ratingStars.count()).toBe(5);
      }
    }).toPass({ timeout: 10000 });
  });
});
