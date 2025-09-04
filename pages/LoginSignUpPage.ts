import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class LoginSignUpPage extends BasePage {
    private newUserSignupTitle: Locator;
    private loginToYourAccountTitle: Locator;
    private signupNameField: Locator;
    private signupEmailField: Locator;
    private signupButton: Locator;
    private emailLoginField: Locator;
    private passwordLoginField: Locator;
    private loginButton: Locator;
    private errorLoginMessage: Locator;
    private errorEmailExist: Locator;

    constructor(page: Page) {
        super(page);
        this.newUserSignupTitle = page.locator("#form :nth-child(3) h2");
        this.loginToYourAccountTitle = page.locator(" .col-sm-4.col-sm-offset-1 h2");
        this.signupNameField = page.locator("[data-qa='signup-name']");
        this.signupEmailField = page.locator("[data-qa='signup-email']");
        this.signupButton = page.locator("[data-qa='signup-button']");
        this.emailLoginField = page.locator("[data-qa='login-email']");
        this.passwordLoginField = page.locator("[data-qa='login-password']");
        this.loginButton = page.locator("[data-qa='login-button']");
        this.errorLoginMessage = page.locator("#form .col-sm-4.col-sm-offset-1 p");
        this.errorEmailExist = page.locator("#form :nth-child(3) p");
    }

    async verifyNewUserSignUpTitle() {
        await expect(this.newUserSignupTitle).toBeVisible();
    }

    async verifyLoginToYourAccountTitle() {
        await expect(this.loginToYourAccountTitle).toBeVisible();
    }

    async fillSignUpNameField(name: string) {
        await this.fillText(this.signupNameField, name);
    }

    async fillSignUpEmailField(email: string) {
        await this.fillText(this.signupEmailField, email);
    }

    async clickSignUpButton(): Promise<void> {
        await this.clickElement(this.signupButton);
    }

    async newUserSignUp(name: string, email: string) {
        await this.fillSignUpNameField(name);
        await this.fillSignUpEmailField(email);
        await this.clickSignUpButton();
    }

    async fillEmailField(email: string) {
        await this.fillText(this.emailLoginField, email);
    }

    async fillPasswordField(password: string) {
        await this.fillText(this.passwordLoginField, password);
    }

    async clickLoginButton(): Promise<void> {
        await this.clickElement(this.loginButton);
    }

    async loginUser(email: string, password: string) {
        await this.fillEmailField(email);
        await this.fillPasswordField(password);
        await this.clickLoginButton();
    }

    async getErrorLoginMessage(): Promise<string> {
        return await this.getElementText(this.errorLoginMessage);
    }

    async verifyErrorLoginMessageText(): Promise<void> {
        const expectedText = "Your email or password is incorrect!";
        const actualText = await this.getErrorLoginMessage();
        expect(actualText).toEqual(expectedText);
    }

    async getErrorExistEmail(): Promise<string> {
        return await this.getElementText(this.errorEmailExist);
    }

    async verifyErrorExistMailText(): Promise<void> {
      const expectedText = "Email Address already exist!";
      const actualText = await this.getErrorExistEmail();
      expect(actualText).toEqual(expectedText);  
    }
}