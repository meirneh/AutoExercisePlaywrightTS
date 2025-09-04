import { Page, Locator, expect } from "@playwright/test";

export default abstract class BasePage {
    constructor(protected readonly page: Page) {
    }

    //Navigation

    protected async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    //Actions

    protected async waitForElementVisibility(locator: Locator, timeout = 1000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    protected async waitForHidden(locator: Locator, timeout: number = 1000): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    protected async waitForClickability(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await expect(locator).toBeEnabled();
    }


    protected async clickElement(locator: Locator): Promise<void> {
        await this.waitForElementVisibility(locator);
        await this.waitForClickability(locator);
        await locator.click();
    }

    protected async fillText(locator: Locator, text: string): Promise<void> {
        await this.waitForElementVisibility(locator);
        await locator.fill(text);
    }

    protected async checkElement(locator: Locator): Promise<void> {
        await locator.check();
    }

    protected async uncheckElement(locator: Locator): Promise<void> {
        await locator.uncheck();
    }

    protected async selectOption(locator: Locator, option: string | { value: string }): Promise<this> {
        await locator.selectOption(option);
        return this;
    }

    protected async hoverElement(locator: Locator): Promise<void> {
        await locator.hover();
    }

    protected async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    protected async doubleClickElement(locator: Locator): Promise<void> {
        await locator.dblclick();
    }

    protected async dragAndDropElement(sourceLocator: Locator, targetLocator: Locator): Promise<void> {
        await sourceLocator.dragTo(targetLocator);
    }

    // Simple y seguro para este proyecto (precios enteros)
    protected extractNumber(text: string): number {
        // por si algún día aparece "1,000"
        const cleaned = text.replace(/,/g, '');
        const m = cleaned.match(/\d+/);   // primera secuencia de dígitos
        return m ? Number(m[0]) : NaN;
    }

    // Verificaciones
    protected async expectToHaveText(locator: Locator, expectedText: string): Promise<void> {
        await this.waitForElementVisibility(locator);
        await expect(locator).toHaveText(expectedText);
    }

    protected async waitForText(locator: Locator, expectedText: string, timeout: number = 1000): Promise<void> {
        await expect(locator).toHaveText(expectedText, { timeout });
    }


    protected async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    protected async isElementHidden(locator: Locator): Promise<boolean> {
        return await locator.isHidden();
    }

    protected async isElementNotExist(locator: Locator): Promise<boolean> {
        return await locator.count() === 0;
    }

    protected async isElementChecked(locator: Locator): Promise<boolean> {
        return await locator.isChecked()
    }

    protected async isElementUnChecked(locator: Locator): Promise<boolean> {
        return !(await locator.isChecked());
    }

    protected async getElementText(locator: Locator): Promise<string> {
        return await locator.innerText();
    }

    protected async getElementTextContent(locator: Locator): Promise<string | null> {
        return await locator.textContent();
    }

    protected async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
        return await locator.getAttribute(attribute);
    }

    protected async getElementInputValue(locator: Locator): Promise<string> {
        return await locator.inputValue();
    }

    //Utility

    protected async countElements(locator: Locator): Promise<number> {
        return await locator.count();
    }

    protected async takeElementScreenshot(locator: Locator, path: string): Promise<void> {
        await locator.screenshot({ path });
    }

}