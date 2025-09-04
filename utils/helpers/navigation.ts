import type {Page} from '@playwright/test';
import type HeaderFooterPage from "../../pages/HeaderFooterPage";

export const goHome = async (headerFooterPage: HeaderFooterPage): Promise<void> => {
    await headerFooterPage.goToHomePage();
    await headerFooterPage.verifyHomeTabIsHighlighted();
}

export const goToCart = async (page: Page, pathViewCart: string): Promise<void> => {
    const path = pathViewCart.startsWith('/')? pathViewCart: `/${pathViewCart}`;
    await page.goto(path, {waitUntil: 'domcontentloaded'});
}