import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export interface RecommendedItemList {
    name: string;
}

export default class HomePage extends BasePage {

    private homeTab: Locator;
    private productsTab: Locator;
    private cartTab: Locator;
    private loginLogoutTab: Locator;
    private contactUsTab: Locator;
    private deleteAccountTab: Locator;
    private loggedInasTab: Locator;
    private suscriptionTitle: Locator;
    private suscriptionEmailField: Locator;
    private suscribeButton: Locator;
    private suscribeMessage: Locator;
    private recommendedItemsTitle: Locator;
    private productContainer: Locator;
    private productName: Locator;
    private viewProductButton: Locator;
    private addToCartButton: Locator;
    private continueShoppingButton: Locator;
    private scrollUpButton: Locator;
    private fullFledgedTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.homeTab = page.locator(".col-sm-8 :nth-child(1) > a");
        this.productsTab = page.locator(".col-sm-8 :nth-child(2) > a");
        this.cartTab = page.locator(".col-sm-8 :nth-child(3) > a");
        this.loginLogoutTab = page.locator(".col-sm-8 :nth-child(4) > a");
        this.deleteAccountTab = page.locator(".col-sm-8 :nth-child(5) > a");
        this.contactUsTab = page.locator(".col-sm-8 :nth-child(8) > a");
        this.loggedInasTab = page.locator(".col-sm-8 :nth-child(10) > a");
        this.suscriptionTitle = page.locator(".footer-widget h2");
        this.suscriptionEmailField = page.locator("#susbscribe_email");
        this.suscribeButton = page.locator("footer #subscribe");         
        this.suscribeMessage = page.locator("footer #success-subscribe");
        this.recommendedItemsTitle = page.locator("div.recommended_items > h2");
        this.productContainer = page.locator(".single-products");
        this.productName = page.locator(".productinfo p");
        this.viewProductButton = page.locator(".fa.fa-plus-square");
        this.addToCartButton = page.locator(".btn.btn-default.add-to-cart");
        this.continueShoppingButton = page.locator(".btn.btn-success.close-modal.btn-block");
        this.scrollUpButton = page.locator("#scrollUp");
        this.fullFledgedTitle = page.locator("#slider-carousel div:nth-child(3) div:nth-child(1) > h2")
    }

    async goToHomePage(): Promise<void> {
        await this.clickElement(this.homeTab);
    }

    async goToProductsPage(): Promise<void> {
        await this.clickElement(this.productsTab);
    }

    async verifyHomeTabIsHighlighted() {
        // Verify the tab is visible
        await expect(this.homeTab).toBeVisible();
        await expect(this.homeTab).toHaveCSS('color', 'rgb(255, 165, 0)');
    }

    async verifyProductsTabIsHighlighted() {
        // Verify the tab is visible
        await expect(this.productsTab).toBeVisible();
        await expect(this.productsTab).toHaveCSS('color', 'rgb(255, 165, 0)');
    }

    async goToLoginLogout(): Promise<void> {
        await this.clickElement(this.loginLogoutTab);
    }

    async verifyLoggedInAsUser(expectedName: string): Promise<void> {
        await expect(this.loggedInasTab).toBeVisible();
        await expect(this.loggedInasTab).toContainText(`Logged in as ${expectedName}`);
    }

    async deleteUserAccount(): Promise<void> {
        await this.clickElement(this.deleteAccountTab);
    }

    async logoutUser(): Promise<void> {
        await this.clickElement(this.loginLogoutTab);
    }

    async goToCartPage(): Promise<void> {
        await this.clickElement(this.cartTab);
    }

    async goToContactUs(): Promise<void> {
        await this.clickElement(this.contactUsTab);
    }

    async goToSuscription(): Promise<void> {
        await this.scrollToElement(this.suscriptionTitle);
    }

    async getSuscriptionTitle(): Promise<string> {
        return await this.getElementText(this.suscriptionTitle);
    }

    async verifySuscriptionTitle(): Promise<void> {
        const expectedTitle = "SUBSCRIPTION";
        const actualTitle = await this.getSuscriptionTitle();
        expect(actualTitle).toEqual(expectedTitle);
    }

    async fillSuscribeEmailField(email: string): Promise<void> {
        await this.fillText(this.suscriptionEmailField, email);
    }

    async clickSuscribeButton(): Promise<void> {
        await this.scrollToElement(this.suscribeButton);
        await this.clickElement(this.suscribeButton);
    }

    async getSuscribeMessage(): Promise<string> {
        return await this.getElementText(this.suscribeMessage);
    }

    async verifySuscribeMessage(): Promise<void> {
        const expectedMessage = "You have been successfully subscribed!";
        const actual = await this.getSuscribeMessage();
    }

    async suscribeUser(email: string): Promise<void> {
        await this.fillSuscribeEmailField(email);
        await this.clickSuscribeButton();
    }

    async getRecommendedItemsTitleText(): Promise<string> {
        await this.scrollToElement(this.recommendedItemsTitle);
        return await this.getElementText(this.recommendedItemsTitle);
    }

    async verifyRecommendedItemsTitleText(): Promise<void> {
        const expectedText = "RECOMMENDED ITEMS";
        const actualText = await this.getRecommendedItemsTitleText();
        expect(actualText).toEqual(expectedText);
    }

    async getQuantityProducts(): Promise<number> {
        return await this.countElements(this.productContainer);
    }

    async getAllProductNames(): Promise<string[]> {
        const count = await this.productName.count();
        const productNames: string[] = [];

        for (let i = 0; i < count; i++) {
            const name = await this.getElementText(this.productName.nth(i));  // uso de BasePage
            productNames.push(name.trim());
        }

        return productNames;
    }

    async verifyProductList(expectedList: RecommendedItemList[]): Promise<void> {
        const actualNames = await this.getAllProductNames();
        const expectedNames = expectedList.map(p => p.name);
        for (const expectedName of expectedNames) {
            expect(actualNames).toContain(expectedName);
        }
        expect(actualNames).toEqual(expectedNames);
    }

    async clickViewProductByName(productName: string): Promise<this> {
        const productCount = await this.productName.count();
        const productNames: string[] = [];

        for (let i = 0; i < productCount; i++) {
            const name = await this.getElementText(this.productName.nth(i));
            productNames.push(name);
        }

        for (let i = 0; i < productNames.length; i++) {
            if (productNames[i].trim() === productName.trim()) {
                await this.clickElement(this.viewProductButton.nth(i));
                break;
            }
        }

        return this;
    }

    async clickToCartButton(): Promise<void> {
        await this.clickElement(this.addToCartButton);
    }

    async addToCartByName(productName: string): Promise<this> {
        const count = await this.productName.count();

        for (let i = 0; i < count; i++) {
            const name = (await this.productName.nth(i).textContent())?.trim();
            if (name && name.toLowerCase() === productName.trim().toLowerCase()) {
                // Hover por si el botón aparece sólo al pasar el mouse
                const container = this.productContainer.nth(i);
                await container.hover().catch(() => { /* opcional: ignorar si no hace falta hover */ });

                // We prefer the scroped button to the card; if it doesn't exist, we fall back to index i
                const addBtnInCard = container.locator(".btn.btn-default.add-to-cart");
                if (await addBtnInCard.count()) {
                    await this.clickElement(addBtnInCard.first());
                } else {
                    await this.clickElement(this.addToCartButton.nth(i));
                }

                return this;
            }
        }

        throw new Error(`Product not found: "${productName}"`);
    }

    async continueShopping(): Promise<void> {
        await this.clickElement(this.continueShoppingButton);
    }

    async scrollUp(): Promise<void> {
        await this.clickElement(this.scrollUpButton);
    }

     async getFullFledgedTitle(): Promise<string> {
        return await this.getElementText(this.fullFledgedTitle);
    }

    async verifyFullFledgedTitle(): Promise<void> {
        const expectedMessage = "Full-Fledged practice website for Automation Engineers";
        const actual = await this.getFullFledgedTitle();
    }

    async goToFullFledgedTitle(): Promise<void> {
        await this.scrollToElement(this.fullFledgedTitle);
    }







}