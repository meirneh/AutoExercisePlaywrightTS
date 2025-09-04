import { expect, Locator, Page } from "@playwright/test";
import * as path from "path";
import { promises as fs } from "fs";
import BasePage from "./BasePage";

export interface PaymentDetailsSplit {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
}

export default class PaymentPage extends BasePage {
    private nameCardField: Locator;
    private numberCardField: Locator;
    private cvcCardField: Locator;
    private expiryMonthField: Locator;
    private expiryYearField: Locator;
    private payAndConfirmOrderButton: Locator;
    private orderPlacedTitle: Locator;
    private confirtmationOrderMessage: Locator;
    private continueButton: Locator;
    private downloadInvoiceButton: Locator;
    private lastInvoicePath?: string;

    constructor(page: Page) {
        super(page)
        this.nameCardField = page.locator("[data-qa='name-on-card']");
        this.numberCardField = page.locator("[data-qa='card-number']");
        this.cvcCardField = page.locator("[data-qa='cvc']");
        this.expiryMonthField = page.locator("[data-qa='expiry-month']");
        this.expiryYearField = page.locator("[data-qa='expiry-year']");
        this.payAndConfirmOrderButton = page.locator("[data-qa='pay-button']");
        this.orderPlacedTitle = page.locator("[data-qa='order-placed']");
        this.confirtmationOrderMessage = page.locator("#form p");
        this.continueButton = page.locator("[data-qa='continue-button']");
        this.downloadInvoiceButton = page.locator(".btn.btn-default.check_out");
    }

    async fillNameCardField(name: string): Promise<void> {
        await this.fillText(this.nameCardField, name);
    }

    async fillNumberCardField(number: string): Promise<void> {
        await this.fillText(this.numberCardField, number);
    }

    async fillCVCCardField(number: string): Promise<void> {
        await this.fillText(this.cvcCardField, number);
    }

    async fillExpiryMonthField(number: string): Promise<void> {
        await this.fillText(this.expiryMonthField, number);
    }

    async fillExpiryYearField(number: string): Promise<void> {
        await this.fillText(this.expiryYearField, number);
    }

    async fillPaymentDetails(details: PaymentDetailsSplit): Promise<void> {
        const { nameOnCard, cardNumber, cvc, expiryMonth, expiryYear } = details;
        await this.fillNameCardField(nameOnCard);
        await this.fillNumberCardField(cardNumber);
        await this.fillCVCCardField(cvc);
        await this.fillExpiryMonthField(expiryMonth);
        await this.fillExpiryYearField(expiryYear);
    }

    async payAndConfirmOrder(): Promise<void> {
        await this.clickElement(this.payAndConfirmOrderButton);
    }

    async submitPayment(details: PaymentDetailsSplit): Promise<void> {
        await this.fillPaymentDetails(details);
        await this.payAndConfirmOrder();
    }


    async getOrderPlacedTitle(): Promise<string> {
        return await this.getElementText(this.orderPlacedTitle);
    }

    async verifyPlacedTitle(): Promise<void> {
        const expectedTitle = "ORDER PLACED!";
        const actualTitle = await this.getOrderPlacedTitle();
        expect(actualTitle).toEqual(expectedTitle);
    }

    async getConfirtmationOrderMessage(): Promise<string> {
        return await this.getElementText(this.confirtmationOrderMessage);
    }

    async verifyConfirtmationOrderMessage(): Promise<void> {
        const expectedMessage = "Congratulations! Your order has been confirmed!";
        const actualMessage = await this.getConfirtmationOrderMessage();
        expect(actualMessage).toEqual(expectedMessage);
    }

    async clickContinueButton(): Promise<void> {
        await this.clickElement(this.continueButton);
    }

    async downloadInvoice(): Promise<string> {
        await this.waitForElementVisibility(this.downloadInvoiceButton);

        // Wait for the download event and the click IN PARALLEL
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.clickElement(this.downloadInvoiceButton), 
        ]);

        // Destination folder for test downloads
        const downloadsDir = path.join(process.cwd(), 'test-results', 'downloads');
        await fs.mkdir(downloadsDir, { recursive: true });

        // Use the name suggested by the browser (usually invoice*.txt)
        const filename = download.suggestedFilename();
        const savePath = path.join(downloadsDir, filename);

        // Save the file
        await download.saveAs(savePath);

        // Save the route for later validation
        this.lastInvoicePath = savePath;
        return savePath;
    }

    /**
   * Verifies the invoice was downloaded successfully and checks its textual content.
   * If `expected` is provided, it asserts name and/or amount in the invoice line.
   */
    async verifyInvoiceDownloaded(
        filePath?: string,
        expected?: { name?: string; amount?: number | string }
    ): Promise<void> {
        const targetPath = filePath ?? this.lastInvoicePath;
        expect(targetPath, 'No invoice path available. Call downloadInvoice() first or pass a path.').toBeTruthy();

        // 1) File exists and is not empty
        const stat = await fs.stat(targetPath!);
        expect(stat.isFile(), 'Downloaded invoice must be a file').toBeTruthy();
        expect(stat.size, 'Downloaded invoice file should not be empty').toBeGreaterThan(0);

        // 2) File name (light)
        const base = path.basename(targetPath!);
        expect(base.toLowerCase()).toContain('invoice');

        // 3) Exact content of the first line
        const text = (await fs.readFile(targetPath!, 'utf-8')).trim();

        // Normalizes spaces in case it comes with double spaces
        const normalized = text.replace(/\s+/g, ' ');

        // Regex of the expected format:
        // Hi <NAME>, Your total purchase amount is <AMOUNT>. Thank you
        const re = /^Hi\s+(.*?),\s+Your total purchase amount is\s+(\d+)\.\s+Thank you\.?$/i;
        const match = normalized.match(re);
        expect(match, `Invoice content not in expected format. Got: "${normalized}"`).toBeTruthy();

        const actualName = match![1];
        const actualAmount = Number(match![2]);

        // 4) Optional assertions if expectations are provided
        if (expected?.name) {
            //escapes in case the name has special regex characters
            const expectedName = expected.name.trim();
            expect(actualName).toBe(expectedName);
        }

        if (expected?.amount !== undefined) {
            const expectedAmount = Number(expected.amount);
            expect(actualAmount).toBe(expectedAmount);
        }
    }
}