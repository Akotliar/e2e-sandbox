import { Locator, test as base, expect } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('https://www.sony.com/en/SonyInfo/design/stories');

    await use(page);
  },
  browser: async ({ browser }, use) => {
    const browserContext = await browser.newContext();
    const cookieVals = [
      {
        name: 'OptanonAlertBoxClosed',
        value: '2023-07-20T13:08:04.749Z',
        path: '/',
        domain: '.www.sony.com',
      },
      {
        name: 'OptanonConsent',
        value:
          'landingPath=NotLandingPage&datestamp=Thu+Jul+20+2023+10%3A43%3A40+GMT-0400+(Eastern+Daylight+Time)&version=202306.1.0&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0&hosts=&consentId=d7940c15-b251-4754-b403-e1a939f815db&interactionCount=1&isGpcEnabled=0&browserGpcFlag=0&geolocation=CA%3BON&isIABGlobal=false&AwaitingReconsent=false',
        path: '/',
        domain: '.www.sony.com',
      },
    ];
    browserContext.addCookies(cookieVals);

    await use(browser);
  },
});

test.describe('Sony Design Stories', () => {
  /*
   Criteria: When a user visits https://www.sony.com/en/SonyInfo/design/stories/. 
   the user should be able to switch between story categories and see the correct list of stories based on the selection.
  */
  test.only('is categories tabs updating stories for selection', async ({
    page,
  }) => {
    const tabList = page.locator('ul[class="tag-list"]');
    const tabs = tabList.locator('a');
    const tabCount = await tabs.count();
    const tabLabels = (await tabs.allTextContents()).map((item) =>item.replace(/ /g, ''));

    expect(tabCount).toEqual(6);
    for (let i = 0; i < tabCount; i++) {
      // click on tab item
      await tabs.nth(i).click();

      //format the label to be url safe to compare.
      const expectedURLTag = tabLabels[i].replace(/\//g, '-').toLocaleLowerCase();
      
      expect(page.url(),'url should have current selected anchor tag' ).toContain(`#${expectedURLTag}`);

      //select article section. check if we can select it once and re-use.
      const articlesBlock = await page.getByRole('article');
      const articleSections = articlesBlock.locator('section[class="pdt-index-item active"]');

      //get the tags for ALL items
      const articleItemsTags = await articleSections.locator('li[class="category-tag-item"]').allTextContents();

      //removes the tabs, spaces,new line characters.
      const sanitizeTags = sanitize(articleItemsTags)
      const uniqueTags = [...new Set(sanitizeTags)];

      if (tabLabels[i] == 'All') {
        //expect all stories to be here from all categories
        //need to remove All as it's not a Tag category
        expect(uniqueTags.length).toBeGreaterThanOrEqual(tabLabels.length - 1);
        const hasUnexpectedTag = uniqueTags.filter((tag) => !tabLabels.includes(tag));
        expect(hasUnexpectedTag).toEqual([]);
      } else {
        //verify the category tabs
        const hasSelectedTag: boolean = uniqueTags.includes[tabLabels[i]];
        expect(hasSelectedTag).toBeTruthy;

        await articleTagVerification(articleSections, tabLabels[i]);
      }
    }
  });
});


async function articleTagVerification(
  articleSectionSelector: Locator,
  shouldHaveTag: string
) {
  const articlesCount = await articleSectionSelector.count();
  for (let i = 0; i < articlesCount; i++) {
    const item = await articleSectionSelector.nth(i);

    const itemTags = await item
      .locator('li[class="category-tag-item"]')
      .allTextContents();
    const sanitizeTags = sanitize(itemTags)
    expect(sanitizeTags.length).toBeGreaterThanOrEqual(1);
    expect(sanitizeTags.includes(shouldHaveTag)).toBeTruthy();
  }
}

// strips tabs and new line characters from strings inside array
function sanitize(tags: string[]) : string[] {
  return tags.map((item) => item.replace(/[\t\n\r]/gm, '').trim());
}
