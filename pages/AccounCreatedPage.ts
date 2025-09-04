import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class AccountCreatedPage extends BasePage {

    private accountCreatedTitle: Locator;
    private continueButton: Locator;


    constructor(page: Page) {
        super(page)
        this.accountCreatedTitle = page.locator("#form  h2 b");
        this.continueButton = page.locator("[data-qa='continue-button']");
    }

    async getAccountCreatedTitle(): Promise<string> {
        return await this.getElementText(this.accountCreatedTitle);
    }

    async verifyAccountCreatedTitleText(): Promise<void> {
        const expectedText = "ACCOUNT CREATED!";
        const actualText = await this.getAccountCreatedTitle();
        expect(actualText).toEqual(expectedText);
    }

    async clickContinueButton(): Promise<void> {
        await this.clickElement(this.continueButton);
    }

    async verifyCreationAndContinue(): Promise<void> {
        await this.verifyAccountCreatedTitleText();
        await this.clickContinueButton();
    }
}