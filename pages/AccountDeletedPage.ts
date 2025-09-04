import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class AccountDeletedPage extends BasePage {

    private accountDeletedTitle: Locator;
    private continueButton: Locator;

    constructor(page: Page) {
        super(page)
        this.accountDeletedTitle = page.locator("#form  h2 b");
        this.continueButton = page.locator("[data-qa='continue-button']");
    }

    async getAccountDeletedTitle(): Promise<string> {
        return await this.getElementText(this.accountDeletedTitle);
    }

    async verifyAccountDeletedTitleText(): Promise<void> {
        const expectedText = "ACCOUNT DELETED!";
        const actualText = await this.getAccountDeletedTitle();
        expect(actualText).toEqual(expectedText);
    }

    async clickContinueButton(): Promise<void> {
        await this.clickElement(this.continueButton);
    }

    async verifyDeletionAndContinue(): Promise<void> {
        await this.verifyAccountDeletedTitleText();
        await this.clickContinueButton();
    }

}