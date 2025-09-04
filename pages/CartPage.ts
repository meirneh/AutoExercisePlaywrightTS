import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

type NameExpected = [name: string, expected: number];
type CartExpect = { name: string; price?: number; quantity?: number; total?: number };


export default class CartPage extends BasePage {
    private productName: Locator;
    private productPrice: Locator;
    private productQuantity: Locator;
    private productTotalPrice: Locator;
    private normalizeName(s: string): string {
        return s.replace(/\s+/g, " ").trim().toLowerCase();
    }
    private deleteButton: Locator;
    private checkoutButton: Locator;
    private registerLoginButton: Locator;
    private cartEmptyMessage: Locator;
    escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    private productNameBy(name: string): Locator {
        //We normalize comparison: exact-ish, case-insensitive, ignoring spaces
        const rx = new RegExp(`^\\s*${this.escapeRegExp(name)}\\s*$`, 'i');
        return this.productName.filter({ hasText: rx });
    }


    constructor(page: Page) {
        super(page)
        this.productName = page.locator(".cart_description h4");
        this.productPrice = page.locator(".cart_price p");
        this.productQuantity = page.locator(".cart_quantity");
        this.productTotalPrice = page.locator(".cart_total_price");
        this.deleteButton = page.locator(".cart_quantity_delete");
        this.checkoutButton = page.locator(".btn.btn-default.check_out");
        this.registerLoginButton = page.locator(".modal-body :nth-child(2)");
        this.cartEmptyMessage = page.locator("#empty_cart");
    }

    async getAllProductNamesInCart(): Promise<string[]> {
        const count = await this.productName.count();
        const productNames: string[] = [];

        for (let i = 0; i < count; i++) {
            const name = await this.getElementText(this.productName.nth(i));  // uso de BasePage
            productNames.push(name.trim());
        }

        return productNames;
    }

    private async findIndexByProductName(productName: string): Promise<number> {
        const target = this.normalizeName(productName);
        const count = await this.productName.count();

        for (let i = 0; i < count; i++) {
            const text = await this.getElementText(this.productName.nth(i));
            if (this.normalizeName(text) === target) {
                return i;
            }
        }
        return -1;
    }

    private async getIndexOrThrow(name: string): Promise<number> {
        const idx = await this.findIndexByProductName(name);
        if (idx === -1) throw new Error(`Product not found in cart: "${name}"`);
        return idx;
    }

    async verifyProductPriceByName(name: string, expected: number): Promise<void>;
    async verifyProductPriceByName(pairs: NameExpected[]): Promise<void>;
    async verifyProductPriceByName(nameOrPairs: string | NameExpected[], expected?: number): Promise<void> {
        const pairs: NameExpected[] = Array.isArray(nameOrPairs) ? nameOrPairs : [[nameOrPairs, expected as number]];
        for (const [name, exp] of pairs) {
            const idx = await this.getIndexOrThrow(name);
            const priceText = (await this.getElementText(this.productPrice.nth(idx))).trim();
            expect(this.extractNumber(priceText)).toBe(exp);
        }
    }

    async verifyProductQuantityByName(name: string, expected: number): Promise<void>;
    async verifyProductQuantityByName(pairs: NameExpected[]): Promise<void>;
    async verifyProductQuantityByName(nameOrPairs: string | NameExpected[], expected?: number): Promise<void> {
        const pairs: NameExpected[] = Array.isArray(nameOrPairs) ? nameOrPairs : [[nameOrPairs, expected as number]];
        for (const [name, exp] of pairs) {
            const idx = await this.getIndexOrThrow(name);
            const qtyText = (await this.getElementText(this.productQuantity.nth(idx))).trim();
            expect(Number(qtyText.match(/\d+/)?.[0] ?? NaN)).toBe(exp);
        }
    }

    async verifyProductTotalPriceByName(name: string, expected: number): Promise<void>;
    async verifyProductTotalPriceByName(pairs: NameExpected[]): Promise<void>;
    async verifyProductTotalPriceByName(nameOrPairs: string | NameExpected[], expected?: number): Promise<void> {
        const pairs: NameExpected[] = Array.isArray(nameOrPairs) ? nameOrPairs : [[nameOrPairs, expected as number]];
        for (const [name, exp] of pairs) {
            const idx = await this.getIndexOrThrow(name);
            const totalText = (await this.getElementText(this.productTotalPrice.nth(idx))).trim();
            expect(this.extractNumber(totalText)).toBe(exp);
        }
    }

    async verifyCartItems(items: CartExpect | CartExpect[]): Promise<void> {
        const list: CartExpect[] = Array.isArray(items) ? items : [items];

        for (const it of list) {
            const idx = await this.getIndexOrThrow(it.name);

            if (it.price !== undefined) {
                const priceText = (await this.getElementText(this.productPrice.nth(idx))).trim();
                expect(this.extractNumber(priceText)).toBe(it.price);
            }

            if (it.quantity !== undefined) {
                const qtyText = (await this.getElementText(this.productQuantity.nth(idx))).trim();
                expect(Number(qtyText.match(/\d+/)?.[0] ?? NaN)).toBe(it.quantity);
            }

            if (it.total !== undefined) {
                const totalText = (await this.getElementText(this.productTotalPrice.nth(idx))).trim();
                expect(this.extractNumber(totalText)).toBe(it.total);
            }
        }
    }

    async removeProductByName(name: string): Promise<void>;
    async removeProductByName(names: string[]): Promise<void>;
    async removeProductByName(nameOrNames: string | string[]): Promise<void> {
        const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];

        for (const n of names) {
            // current index of that name (used to give the correct click)
            const idx = await this.getIndexOrThrow(n);
            // Click on the delete button for that row
            await this.clickElement(this.deleteButton.nth(idx));
            await expect(this.productNameBy(n)).toHaveCount(0);
        }

    }
    async verifyProductsNotInCart(items: string[] | string): Promise<void> {
        const toCheck = Array.isArray(items) ? items : [items];

        // We reuse your method that gets all the product names from the cart
        const actualNames = await this.getAllProductNamesInCart();

        // Normalizes the same as verifyCartItems to avoid false negatives due to spaces or capital letters.
        const normalizedActual = actualNames.map((n) => this.normalizeName(n));

        for (const name of toCheck) {
            const target = this.normalizeName(name);
            const found = normalizedActual.includes(target);

            expect(found,
                `Product "${name}" was found in the cart but should have been removed. Actual cart: ${actualNames.join(", ")}`
            ).toBeFalsy();
        }
    }



    async getMessageEmpty(): Promise<string> {
        const raw = await this.getElementText(this.cartEmptyMessage);
        return raw.replace(/\s+/g, ' ').trim();
    }

    async verifyMessageEmpty(): Promise<void> {
        const expectedMessage = "Cart is empty! Click here to buy products."
        const actualMessage = await this.getMessageEmpty();
        expect(actualMessage).toBe(expectedMessage);
    }

    async proceedToCheckout(): Promise<void> {
        await this.clickElement(this.checkoutButton);
    }

    async goToRegisterLogin(): Promise<void> {
        await this.clickElement(this.registerLoginButton);
    }



}