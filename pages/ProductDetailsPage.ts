import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export interface ProductDetails {
    name: string;
    category: string;
    price: string;
    availability: string;
    condition: string;
    brand: string;
}

export default class ProductDetailsPage extends BasePage {

    private nameProduct: Locator;
    private categoryProduct: Locator;
    private priceProduct: Locator;
    private availabilityProduct: Locator;
    private conditionProduct: Locator;
    private brandProduct: Locator;
    private quantityField: Locator;
    private addToCartButton: Locator;
    private viewCartButton: Locator;
    private writeYourReviewTitle: Locator;
    private nameYourReviewField: Locator;
    private emailYourReviewField: Locator;
    private textYourReviewField: Locator;
    private submitYourReviewButton: Locator;
    private successMessage: Locator;

    constructor(page: Page) {
        super(page)

        this.nameProduct = page.locator(".col-sm-7 h2");
        this.categoryProduct = page.locator(".col-sm-7 p:nth-child(3)");
        this.priceProduct = page.locator(".col-sm-7 span span");
        this.availabilityProduct = page.locator(".col-sm-7 :nth-child(6)");
        this.conditionProduct = page.locator(".col-sm-7 p:nth-child(7)");
        this.brandProduct = page.locator(".col-sm-7 p:nth-child(8)");
        this.quantityField = page.locator("#quantity");
        this.addToCartButton = page.locator(".btn.btn-default.cart");
        this.viewCartButton = page.locator(".modal-body :nth-child(2)");
        this.writeYourReviewTitle = page.locator(".col-sm-12 a");
        this.nameYourReviewField = page.locator("#name");
        this.emailYourReviewField = page.locator("#email");
        this.textYourReviewField = page.locator("#review");
        this.submitYourReviewButton = page.locator("#button-review");
        this.successMessage = page.locator("#review-section  span");
    }

    async getNameProduct(): Promise<string> {
        return await this.getElementText(this.nameProduct);
    }

    async verifyNameProductText(expectedName: string): Promise<void> {
        const actualText = await this.getNameProduct();
        expect(actualText).toEqual(expectedName);
    }

    async getCategoryProduct(): Promise<string> {
        return await this.getElementText(this.categoryProduct);
    }

    async verifyCategoryProductText(expectedCategory: string): Promise<void> {
        const actualText = await this.getCategoryProduct();
        expect(actualText).toEqual(expectedCategory);
    }


    async getPriceProduct(): Promise<string> {
        return await this.getElementText(this.priceProduct);
    }

    async verifyPriceProductText(expectedPrice: string): Promise<void> {
        const actualText = await this.getPriceProduct();
        expect(actualText).toEqual(expectedPrice);
    }

    async getAvailabilityProduct(): Promise<string> {
        return await this.getElementText(this.availabilityProduct);
    }

    async verifyAvailabilityProductText(expectedAvailability: string): Promise<void> {
        const actualText = await this.getAvailabilityProduct();
        expect(actualText).toEqual(expectedAvailability);
    }

    async getConditionProduct(): Promise<string> {
        return await this.getElementText(this.conditionProduct);
    }

    async verifyConditionProductText(expectedCondition: string): Promise<void> {
        const actualText = await this.getConditionProduct();
        expect(actualText).toEqual(expectedCondition);
    }

    async getBrandProduct(): Promise<string> {
        return await this.getElementText(this.brandProduct);
    }

    async verifyBrandProductText(expectedBrand: string): Promise<void> {
        const actualText = await this.getBrandProduct();
        expect(actualText).toEqual(expectedBrand);
    }

    async verifyDetailsProduct(details: ProductDetails): Promise<void> {
        await this.verifyNameProductText(details.name);
        await this.verifyCategoryProductText(details.category);
        await this.verifyPriceProductText(details.price);
        await this.verifyAvailabilityProductText(details.availability);
        await this.verifyConditionProductText(details.condition);
        await this.verifyBrandProductText(details.brand);

    }

    async fillQuantityField(quantity: string): Promise<void> {
        await this.fillText(this.quantityField, quantity);
    }

    async addToCart(): Promise<void> {
        await this.clickElement(this.addToCartButton);
    }

    async viewCart(): Promise<void> {
        await this.clickElement(this.viewCartButton);
    }

    async getWriteYourReviewTitle(): Promise<string> {
        return await this.getElementText(this.writeYourReviewTitle);
    }

    async verifyWriteYourReviewTitle(): Promise<void> {
        const expectedTitle = "WRITE YOUR REVIEW";
        const actualTitle = await this.getWriteYourReviewTitle();
        expect(actualTitle).toEqual(expectedTitle);
    }

    async fillNameYourReviewField(name: string): Promise<void> {
        await this.fillText(this.nameYourReviewField, name);
    }

    async fillEmailYourReviewField(email: string): Promise<void> {
        await this.fillText(this.emailYourReviewField, email);
    }

    async fillTextYourReviewField(text: string): Promise<void> {
        await this.fillText(this.textYourReviewField, text);
    }

    async submitYourReview(): Promise<void> {
        await this.clickElement(this.submitYourReviewButton);
    }

    async getSuccessMessage(): Promise<string> {
        return await this.getElementText(this.successMessage);
    }

    async fillYourReview(name: string, email: string, text: string): Promise<void> {
        await this.fillNameYourReviewField(name);
        await this.fillEmailYourReviewField(email);
        await this.fillTextYourReviewField(text)
        await this.submitYourReview();
    }

    async verifySuccessMessage(): Promise<void> {
        const expectedMessage = "Thank you for your review.";
        const actualMessage = await this.getSuccessMessage();
        expect(actualMessage).toEqual(expectedMessage);
    }

}
