import { expect, Locator, Page } from "@playwright/test";
import * as path from 'path';
import BasePage from "./BasePage";

export interface ContactUsFormInput {
    name: string;
    email: string;
    subject: string;
    message: string;
    /** Absolute path to the file to upload */
    absoluteFilePath: string;
    /** Optional: if omitted, basename(absoluteFilePath) will be used */
    expectedFileName?: string;
}


export default class ContactUsPage extends BasePage {
    private contactUsTitle: Locator;
    private getInTouchTitle: Locator;
    private nameField: Locator;
    private emailField: Locator;
    private subjectField: Locator;
    private messageField: Locator;
    private fileInput: Locator;
    private submitButton: Locator;
    private successMessage: Locator;
    private successAlert: Locator;
    private homeButton: Locator;

    constructor(page: Page) {
        super(page)
        this.contactUsTitle = page.locator(".bg  h2");
        this.getInTouchTitle = page.locator(".col-sm-8 h2");
        this.nameField = page.locator("[data-qa='name']");
        this.emailField = page.locator("[data-qa='email']");
        this.subjectField = page.locator("[data-qa='subject']");
        this.messageField = page.locator("[data-qa='message']");
        this.fileInput = page.locator('input[type="file"][name="upload_file"]');
        this.submitButton = page.locator("[data-qa='submit-button']");
        this.successMessage = page.locator(".status.alert.alert-success");
        this.successAlert = page.locator('.status.alert.alert-success').filter({ hasText: 'Success!' });
        this.homeButton = page.locator("#form-section a span");
    }

    async getContactUsTitle(): Promise<string> {
        return await this.getElementText(this.contactUsTitle);
    }

    async verifyContactUsTitle(): Promise<void> {
        const expectedTitle = "CONTACT US";
        const actualTitle = await this.getContactUsTitle();
        expect(actualTitle).toEqual(expectedTitle);
    }

    async getGetInTouchTitle(): Promise<string> {
        return await this.getElementText(this.getInTouchTitle)
    }

    async verifyGetInTouchTitle(): Promise<void> {
        const expectedTitle = "GET IN TOUCH";
        const actualTitle = await this.getGetInTouchTitle();
        expect(actualTitle).toEqual(expectedTitle);
    }

    async fillNameField(name: string): Promise<void> {
        await this.fillText(this.nameField, name);
    }

    async fillEmailField(email: string): Promise<void> {
        await this.fillText(this.emailField, email);
    }

    async fillSubjectField(subject: string): Promise<void> {
        await this.fillText(this.subjectField, subject);
    }

    async fillMessageField(message: string): Promise<void> {
        await this.fillText(this.messageField, message);
    }

    async attachFile(filePath: string): Promise<void> {
        await this.fileInput.setInputFiles(filePath);
    }

    async verifyUploadedFileName(expectedFileName: string): Promise<void> {
        const value = await this.getElementInputValue(this.fileInput);
        expect(
            value.toLowerCase(),
        ).toContain(expectedFileName.toLowerCase());
    }


    async submitInfo(): Promise<void> {
        //Prepare the handler and expose a promise to wait for its acceptance
        const dialogAccepted = new Promise<void>((resolve) => {
            this.page.once('dialog', async (d) => {
                try { await d.accept(); } finally { resolve(); }
            });
        });
        await this.submitButton.scrollIntoViewIfNeeded();
        await this.clickElement(this.submitButton);
        // wait for the alert to be accepted before returning
        await dialogAccepted;
    }

    async fillContactUsForm(data: ContactUsFormInput): Promise<void> {
        const {
            name,
            email,
            subject,
            message,
            absoluteFilePath,
            expectedFileName,
        } = data;

        await this.fillNameField(name);
        await this.fillEmailField(email);
        await this.fillSubjectField(subject);
        await this.fillMessageField(message);
        await this.attachFile(absoluteFilePath);

        const fileNameToCheck = expectedFileName ?? path.basename(absoluteFilePath);
        await this.verifyUploadedFileName(fileNameToCheck);
        await this.submitInfo();
    }

    async expectSuccess(): Promise<void> {
        await expect(this.successAlert).toBeVisible();
        await expect(this.successAlert).toContainText('Success!');
    }

    async getSuccessMessage(): Promise<string> {
        return await this.getElementText(this.successMessage)
    }

    async verifySuccessMessage(): Promise<void> {
        const expectedMessage = "Success! Your details have been submitted successfully.";
        const actualMessage = await this.getSuccessMessage();
        expect(actualMessage).toEqual(expectedMessage);
    }

    async goToHomePage(): Promise<void> {
        await this.clickElement(this.homeButton);
    }

    // En ContactUsPage.ts
    async fillSubmitVerifyHome(data: ContactUsFormInput): Promise<void> {
        await this.fillContactUsForm(data);
        await this.verifySuccessMessage();
        await this.goToHomePage();
    }

}