import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

type NameExpected = [name: string, expected: number];
type CartExpect = { name: string; price?: number; quantity?: number; total?: number };


export interface DeliveryAddress {
    name: string;
    company: string;
    address1: string;
    address2: string;
    statePostcode: string;
    country: string;
    number: string;
}

export default class CheckoutPage extends BasePage {

    private addressDeliveryTitle: Locator;
    private addressDeliveryName: Locator;
    private addressDeliveryCompany: Locator;
    private addressDeliveryAddress1: Locator;
    private addressDeliveryAddress2: Locator;
    private addressDeliveryStatePostcode: Locator;
    private addressDeliveryCountry: Locator;
    private addressDeliveryPhone: Locator;
    private addressInvoiceTitle: Locator;
    private addressInvoiceName: Locator;
    private addressInvoiceCompany: Locator;
    private addressInvoiceAddress1: Locator;
    private addressInvoiceAddress2: Locator;
    private addressInvoiceStatePostcode: Locator;
    private addressInvoiceCountry: Locator;
    private addressInvoicePhone: Locator;
    private productName: Locator;
    private productPrice: Locator;
    private productQuantity: Locator;
    private productTotalPrice: Locator;
    private normalizeName(s: string): string {
        return s.replace(/\s+/g, " ").trim().toLowerCase();
    };
    private reviewYourOrderTitle: Locator;
    private totalAmount: Locator;
    private normalizeAmount(text: string): number {
        const onlyDigits = text.replace(/[^\d]/g, "");
        return Number(onlyDigits);
    }
    private commentField: Locator;
    private placeOrderButton: Locator;


    constructor(page: Page) {
        super(page)
        this.addressDeliveryTitle = page.locator("#address_delivery .address_title > h3");
        this.addressDeliveryName = page.locator("#address_delivery .address_firstname.address_lastname");
        this.addressDeliveryCompany = page.locator("#address_delivery > li:nth-child(3)");
        this.addressDeliveryAddress1 = page.locator("#address_delivery > li:nth-child(4)");
        this.addressDeliveryAddress2 = page.locator("#address_delivery > li:nth-child(5)");
        this.addressDeliveryStatePostcode = page.locator("#address_delivery > li:nth-child(6)");
        this.addressDeliveryCountry = page.locator("#address_delivery > li:nth-child(7)");
        this.addressDeliveryPhone = page.locator("#address_delivery > li:nth-child(8)");
        this.addressInvoiceTitle = page.locator("#address_invoice .address_title > h3");
        this.addressInvoiceName = page.locator("#address_invoice .address_firstname.address_lastname");
        this.addressInvoiceCompany = page.locator("#address_invoice > li:nth-child(3)");
        this.addressInvoiceAddress1 = page.locator("#address_invoice > li:nth-child(4)");
        this.addressInvoiceAddress2 = page.locator("#address_invoice > li:nth-child(5)");
        this.addressInvoiceStatePostcode = page.locator("#address_invoice > li:nth-child(6)");
        this.addressInvoiceCountry = page.locator("#address_invoice > li:nth-child(7)");
        this.addressInvoicePhone = page.locator("#address_invoice > li:nth-child(8)");
        this.productName = page.locator(".cart_description h4");
        this.productPrice = page.locator(".cart_price p");
        this.productQuantity = page.locator(".cart_quantity");
        this.productTotalPrice = page.locator(".cart_total_price");
        this.reviewYourOrderTitle = page.locator("#cart_items :nth-child(4) > h2");
        this.totalAmount = page.locator("#cart_info :nth-child(3) td:nth-child(4) p");
        this.commentField = page.locator(".form-control");
        this.placeOrderButton = page.locator(".btn.btn-default.check_out");

    }

    async getAddressDeliveryTitle(): Promise<string> {
        return await this.getElementText(this.addressDeliveryTitle);
    }

    async verifyAddressDeliveryTitle(): Promise<void> {
        const expectedTitle = "YOUR DELIVERY ADDRESS";
        const actualTitle = (await this.getAddressDeliveryTitle());
        expect(actualTitle.toLowerCase()).toEqual(expectedTitle.toLowerCase());
    }

    async getAddressDeliveryName(): Promise<string> {
        return await this.getElementText(this.addressDeliveryName);
    }

    async verifyAddressDeliveryName(expectedName: string): Promise<void> {
        expect(await this.getAddressDeliveryName()).toEqual(expectedName);
    }

    async getAddressDeliveryCompany(): Promise<string> {
        return await this.getElementText(this.addressDeliveryCompany)
    }

    async verifyAddressDeliveryCompany(expectedCompany: string): Promise<void> {
        expect(await this.getAddressDeliveryCompany()).toEqual(expectedCompany);
    }

    async getAddressDeliveryAddress1(): Promise<string> {
        return await this.getElementText(this.addressDeliveryAddress1);
    }

    async verifyAddressDeliveryAddress1(expectedAddress1: string): Promise<void> {
        expect(await this.getAddressDeliveryAddress1()).toEqual(expectedAddress1);
    }

    async getAddressDeliveryAddress2(): Promise<string> {
        return await this.getElementText(this.addressDeliveryAddress2);
    }

    async verifyAddressDeliveryAddress2(expectedAddress2: string): Promise<void> {
        expect(await this.getAddressDeliveryAddress2()).toEqual(expectedAddress2);
    }

    async getAddressDeliveryStatePostcode(): Promise<string> {
        return await this.getElementText(this.addressDeliveryStatePostcode);
    }

    async verifyAddressDeliveryStatePostcode(expectedStatePostcode: string): Promise<void> {
        expect(await this.getAddressDeliveryStatePostcode()).toEqual(expectedStatePostcode);
    }

    async getAddressDeliveryCountry(): Promise<string> {
        return await this.getElementText(this.addressDeliveryCountry);
    }

    async verifyAddressDeliveryCountry(expectedCountry: string): Promise<void> {
        expect(await this.getAddressDeliveryCountry()).toEqual(expectedCountry);
    }

    async getAddressDeliveryPhone(): Promise<string> {
        return await this.getElementText(this.addressDeliveryPhone);
    }

    async verifyAddressDeliveryPhone(expectedNumber: string): Promise<void> {
        expect(await this.getAddressDeliveryPhone()).toEqual(expectedNumber);
    }

    async verifyAddressDeliveryInfo(expected: DeliveryAddress): Promise<void> {
        const { name, company, address1, address2, statePostcode, country, number } = expected
        await this.verifyAddressDeliveryName(name);
        await this.verifyAddressDeliveryCompany(company);
        await this.verifyAddressDeliveryAddress1(address1);
        await this.verifyAddressDeliveryAddress2(address2);
        await this.verifyAddressDeliveryStatePostcode(statePostcode);
        await this.verifyAddressDeliveryCountry(country);
        await this.verifyAddressDeliveryPhone(number);
    }

    async getAddressInvoiceTitle(): Promise<string> {
        return await this.getElementText(this.addressInvoiceTitle);
    }

    async verifyAddressInvoiceTitle(): Promise<void> {
        const expectedTitle = "YOUR BILLING ADDRESS";
        const actualTitle = (await this.getAddressInvoiceTitle());
        expect(actualTitle.toLowerCase()).toEqual(expectedTitle.toLowerCase());
    }

    async getAddressInvoiceName(): Promise<string> {
        return await this.getElementText(this.addressInvoiceName);
    }

    async verifyAddressInvoiceName(expectedName: string): Promise<void> {
        expect(await this.getAddressInvoiceName()).toEqual(expectedName);
    }

    async getAddressInvoiceCompany(): Promise<string> {
        return await this.getElementText(this.addressInvoiceCompany)
    }

    async verifyAddressInvoiceCompany(expectedCompany: string): Promise<void> {
        expect(await this.getAddressInvoiceCompany()).toEqual(expectedCompany);
    }

    async getAddressInvoiceAddress1(): Promise<string> {
        return await this.getElementText(this.addressInvoiceAddress1);
    }

    async verifyAddressInvoiceAddress1(expectedAddress1: string): Promise<void> {
        expect(await this.getAddressInvoiceAddress1()).toEqual(expectedAddress1);
    }

    async getAddressInvoiceAddress2(): Promise<string> {
        return await this.getElementText(this.addressInvoiceAddress2);
    }

    async verifyAddressInvoiceAddress2(expectedAddress2: string): Promise<void> {
        expect(await this.getAddressInvoiceAddress2()).toEqual(expectedAddress2);
    }

    async getAddressInvoiceStatePostcode(): Promise<string> {
        return await this.getElementText(this.addressInvoiceStatePostcode);
    }

    async verifyAddressInvoiceStatePostcode(expectedStatePostcode: string): Promise<void> {
        expect(await this.getAddressInvoiceStatePostcode()).toEqual(expectedStatePostcode);
    }

    async getAddressInvoiceCountry(): Promise<string> {
        return await this.getElementText(this.addressInvoiceCountry);
    }

    async verifyAddressInvoiceCountry(expectedCountry: string): Promise<void> {
        expect(await this.getAddressInvoiceCountry()).toEqual(expectedCountry);
    }

    async getAddressInvoicePhone(): Promise<string> {
        return await this.getElementText(this.addressInvoicePhone);
    }

    async verifyAddressInvoicePhone(expectedNumber: string): Promise<void> {
        expect(await this.getAddressInvoicePhone()).toEqual(expectedNumber);
    }

    async verifyAddressInvoiceInfo(expected: DeliveryAddress): Promise<void> {
        const { name, company, address1, address2, statePostcode, country, number } = expected
        await this.verifyAddressInvoiceName(name);
        await this.verifyAddressInvoiceCompany(company);
        await this.verifyAddressInvoiceAddress1(address1);
        await this.verifyAddressInvoiceAddress2(address2);
        await this.verifyAddressInvoiceStatePostcode(statePostcode);
        await this.verifyAddressInvoiceCountry(country);
        await this.verifyAddressInvoicePhone(number);
    }

    async verifyAddressInfo(expected: DeliveryAddress): Promise<void> {
        await this.verifyAddressDeliveryInfo(expected);
        await this.verifyAddressInvoiceInfo(expected);
    }

    async getReviewYourOrderTitle(): Promise<string> {
        return await this.getElementText(this.reviewYourOrderTitle);
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

    async verifyTotalAmount(expectedTotalText: string): Promise<void> {
        const actualText = await this.totalAmount.textContent();
        expect(actualText?.trim()).not.toBeFalsy();

        const actual = this.normalizeAmount(actualText!);
        const expected = this.normalizeAmount(expectedTotalText);
        expect(actual).toBe(expected);
    }

    async verifyCart(items: CartExpect[], expectedTotal: string | number): Promise<void> {
        await this.verifyCartItems(items);
        await this.verifyTotalAmount(String(expectedTotal));
    }

    async fillComment(text: string): Promise<void> {
        await this.fillText(this.commentField, text);
    }

    async placeOrder(): Promise<void> {
        await this.clickElement(this.placeOrderButton);
    }
}