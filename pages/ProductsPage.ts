import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export interface ProductsList {
    name: string;
}

export default class ProductPage extends BasePage {

    private allProductsTitle: Locator;
    private productContainer: Locator;
    private productName: Locator;
    private viewProductButton: Locator;
    private searchField: Locator;
    private searchButton: Locator;
    private categoryTitle: Locator;
    private categoryToggleButton = (name: 'WOMEN' | 'MEN' | 'KIDS') =>
        this.page
            .locator('#accordian .panel-heading')
            .filter({
                has: this.page
                    .locator('.panel-title')
                    .filter({ hasText: new RegExp(`^\\s*${name}\\s*$`, 'i') }),
            })
            .locator('.badge.pull-right');

    private categoryPanel = (name: 'WOMEN' | 'MEN' | 'KIDS') =>
        this.page
            .locator('#accordian .panel')
            .filter({
                has: this.page
                    .locator('.panel-heading .panel-title')
                    .filter({ hasText: new RegExp(`^\\s*${name}\\s*$`, 'i') }),
            });

    private sectionLink = (category: 'WOMEN' | 'MEN' | 'KIDS', section: string) =>
        this.categoryPanel(category)
            .locator('.panel-body a')
            .filter({ hasText: new RegExp(`^\\s*${section}\\s*$`, 'i') });

    private sectionProductTitle: Locator;
    private brandsTitle: Locator;
    private brandsName: Locator;
    private addToCartButton: Locator;
    private continueShoppingButton: Locator;
    constructor(page: Page) {
        super(page)

        this.allProductsTitle = page.locator(".col-sm-9.padding-right > div >h2");
        this.productContainer = page.locator(".single-products");
        this.productName = page.locator(".productinfo p");
        this.viewProductButton = page.locator(".fa.fa-plus-square");
        this.searchField = page.locator(".form-control.input-lg");
        this.searchButton = page.locator(".btn.btn-default.btn-lg");
        this.categoryTitle = page.locator("section:nth-child(3)  div.col-sm-3 > div > h2");
        this.brandsTitle = page.locator(".brands_products > h2");
        this.sectionProductTitle = page.locator(".title.text-center");
        this.brandsName = page.locator(".brands-name a");
        this.addToCartButton = page.locator(".btn.btn-default.add-to-cart");
        this.continueShoppingButton = page.locator(".btn.btn-success.close-modal.btn-block");

    }

    async getAllProductsTitleText(): Promise<string> {
        return await this.getElementText(this.allProductsTitle)
    }

    async verifyAllProductsTitleText(): Promise<void> {
        const expectedText = "ALL PRODUCTS";
        const actualText = await this.getAllProductsTitleText();
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

    async verifyProductList(expectedList: ProductsList[]): Promise<void> {
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


    async fillSearchField(searchValue: string): Promise<void> {
        await this.fillText(this.searchField, searchValue);
    }

    async clickSearchButton(): Promise<void> {
        await this.clickElement(this.searchButton);
    }

    async searchProduct(searchValue: string): Promise<void> {
        await this.fillSearchField(searchValue);
        await this.clickSearchButton();
    }

    async getCategoryTitleText(): Promise<string> {
        return await this.getElementText(this.categoryTitle);
    }

    async verifyCategoryTitleText(): Promise<void> {
        const expectedText = "CATEGORY";
        const actualText = await this.getCategoryTitleText();
        expect(actualText).toEqual(expectedText);
    }

    async toggleCategory(name: 'WOMEN' | 'MEN' | 'KIDS'): Promise<void> {
        await this.clickElement(this.categoryToggleButton(name));
    }

    async selectSection(
        category: 'WOMEN' | 'MEN' | 'KIDS',
        section: string
    ): Promise<void> {
        const link = this.sectionLink(category, section);
        if (await this.isElementHidden(link)) {
            await this.toggleCategory(category);
        }
        await this.clickElement(link);
    }

    async getSectionProductsTitle(): Promise<string> {
        return await this.getElementText(this.sectionProductTitle);
    }

    async verifySectionProductsTitle(
        category: 'WOMEN' | 'MEN' | 'KIDS',
        section: string
    ): Promise<void> {
        const expected = `${category} - ${section} PRODUCTS`;
        const actual = (await this.getSectionProductsTitle())
            .replace(/\s+/g, ' ')   // collapses spaces
            .trim();

        // case-insensitive comparation
        expect(actual.toUpperCase()).toBe(expected.toUpperCase());
    }

    async getBrandsTitleText(): Promise<string> {
        return await this.getElementText(this.brandsTitle);
    }

    async verifyBrandsTitleText(): Promise<void> {
        const expectedText = "BRANDS";
        const actualText = await this.getBrandsTitleText();
        expect(actualText).toEqual(expectedText);
    }

    async selectBrand(brandName: string): Promise<void> {
        await this.clickElement(
            this.brandsName.filter({ hasText: brandName })
        );
    }

    async verifyBrandProductsTitle(brandName: string): Promise<void> {
        const expectedText = `BRAND - ${brandName} PRODUCTS`;
        const actualText = await this.getSectionProductsTitle();
        expect(actualText).toEqual(expectedText);
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




}