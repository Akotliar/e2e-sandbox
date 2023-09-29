import { Locator, Page, expect } from '@playwright/test'

interface LocatorOptions {
    has?: Locator | undefined;
    hasNot?: Locator | undefined; 
    hasNotText?: string | RegExp | undefined; 
    hasText?: string | RegExp | undefined;
}


interface LocatorXOptions extends LocatorOptions {
    hasbgColor?: string 
    hasfgColor?: string
    viewPortSize?: number 
    //...
}


declare global {
    interface ExtendedPage extends Page {
        clickAndWaitForNavigation(selector: string): Promise<void>
        locatorX(selector: string, options?: LocatorXOptions): Locator
    }
}


export function ExtendedPageFixture(page: Page): ExtendedPage {
    
(page as unknown as ExtendedPage).clickAndWaitForNavigation = async (selector: string) => {
    await Promise.all([
        page.waitForLoadState(),
        page.click(selector)
    ])
}

(page as unknown as ExtendedPage).locatorX = (selector: string, options?: LocatorXOptions) : Locator => {
    const element = page.locator(selector, options)

    if(options?.hasbgColor){
        Promise.all([
            expect.soft(element).toHaveCSS('background-color', options.hasbgColor)
       ])
    }

    if(options?.hasfgColor){
        Promise.all([
            expect.soft(element).toHaveCSS('color', options.hasfgColor)
        ]);
    }
    
    //accept options 
    return element
}

    return page as unknown as ExtendedPage;
}



class TestLocator  {

}