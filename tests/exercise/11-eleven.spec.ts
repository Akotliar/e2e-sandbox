import { test, expect } from '@playwright/test';

test.describe.only('Wikepedia.com > Search >', () => {
  /**
  Criteria: Write an test script using Playwright that accomplishes the following tasks on Wikipedia:
        1. Search for a Term:
            [/] Navigate to Wikipedia's homepage (https://www.wikipedia.org/).
            [/] Use the search bar to search for a term of your choice (e.g., "Playwright (software)").
            [/] click on search button : search button doesnt actually open search page
        2. Validate Search Results:
            [/] Ensure that you are navigated to the search results page.
            [/] Validate that the first search result is relevant to your search term. 
            [/] This can be done by checking that the title of the first search result contains the search term.
        3. Access First Search Result:
            [/] Click on the first search result to navigate to its article page.
   **/
  test('should display search results dropdown when inputting search term in search input', async ({
    page,
  }) => {
    const searchTerm = 'Playwright (software)';

    await page.goto('https://www.wikipedia.org/');
    const searchInput = page.locator('input[id="searchInput"]');

    await searchInput.click();
    await searchInput.fill(searchTerm);

    const suggestionSearch = page.locator('div[class="suggestions-dropdown"]');

    await expect(suggestionSearch).toBeVisible();
    const suggestionLinks = suggestionSearch.locator(
      'a[class="suggestion-link"]'
    );
    const resultCount = await suggestionLinks.count();

    expect(resultCount).toBeGreaterThan(0);
  });

  test('should display relevant first search result', async ({ page }) => {
    const searchTerm = 'Playwright (software)';

    await page.goto('https://www.wikipedia.org/');
    const searchInput = page.locator('input[id="searchInput"]');

    await searchInput.click();
    await searchInput.fill(searchTerm);

    const suggestionSearch = page.locator('div[class="suggestions-dropdown"]');

    await expect(suggestionSearch).toBeVisible();

    const firstSearchResult = suggestionSearch
      .locator('a[class="suggestion-link"]')
      .nth(0);

    const resultText = firstSearchResult.locator(
      'h3[class="suggestion-title"]'
    );

    await expect(resultText).toHaveText(searchTerm);
  });

  test('should navigate to result detail page when result clicked', async ({
    page,
  }) => {
    const searchTerm = 'Playwright (software)';

    await page.goto('https://www.wikipedia.org/');
    const searchInput = page.locator('input[id="searchInput"]');

    await searchInput.click();
    await searchInput.fill(searchTerm);

    const suggestionSearch = page.locator('div[class="suggestions-dropdown"]');

    await expect(suggestionSearch).toBeVisible();

    const firstSearchResult = page.locator('a[class="suggestion-link"]').nth(0);

    await firstSearchResult.click();

    const resultDetailTitle = page.locator('h1');

    await expect(resultDetailTitle).toHaveText(searchTerm);
  });
});

test.describe.only('Wikepedia.com > Result Detail Page >', () => {
  /** 
    4. Validate Article Content:
      [/] Once on the article page, validate that the page contains a content table.
    5. Change Language:
      [/] Change the article's language to another language (e.g., French). This can typically be done by selecting the language from the list available on the left sidebar.
      [/] Validate that the URL has changed to include the language prefix (e.g., "fr" for French).
   */
  test('should display a table of contents', async ({ page }) => {
    const searchTerm = 'Playwright (software)';

    await page.goto('https://www.wikipedia.org/');
    const searchInput = page.locator('input[id="searchInput"]');

    await searchInput.click();
    await searchInput.fill(searchTerm);

    const suggestionSearch = page.locator('div[class="suggestions-dropdown"]');

    await expect(suggestionSearch).toBeVisible();

    const firstSearchResult = page.locator('a[class="suggestion-link"]').nth(0);

    await firstSearchResult.click();

    const detailTableOfContents = page.locator('#vector-toc');

    await expect(detailTableOfContents).toBeVisible();
  });

  test('should change article url to include language prefix when switching languages (French > fr)', async ({
    page,
  }) => {
    const searchTerm = 'Computer';

    await page.goto('https://www.wikipedia.org/');
    const searchInput = page.locator('input[id="searchInput"]');

    await searchInput.click();
    await searchInput.fill(searchTerm);

    const suggestionSearch = page.locator('div[class="suggestions-dropdown"]');

    await expect(suggestionSearch).toBeVisible();

    const firstSearchResult = page.locator('a[class="suggestion-link"]').nth(0);

    await firstSearchResult.click();
    await page.waitForTimeout(2000);
    const languageDropDown = page
      .locator('div[id="p-lang-btn"]')
      .locator('input');
    await languageDropDown.click();

    const frenchLink = page
      .locator('li[title="Français"]')
      .locator('a')
      .first();
    await frenchLink.click();

    const currentURL = page.url();

    expect(currentURL).toContain('fr.wikipedia.org');
  });
});
