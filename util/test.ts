import { test as base } from '@playwright/test';

import { ExtendedPageFixture } from './page.extension';

export const test = base.extend<{ page: ExtendedPage }>({
    page: async ({page, isMobile}, use) => {
      if(isMobile) test.skip();  
      use(ExtendedPageFixture(page))
    }
  });