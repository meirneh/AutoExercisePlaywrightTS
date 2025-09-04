import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export interface AccountInfo {
    name: string;
    email: string;
    password: string;
    gender: "Mr" | "Mrs";
}

export interface BirthDate {
    day: string;
    month: string;
    year: string;
}

export interface CheckOptions {
    newsletter?: boolean;
    offers?: boolean;
}

export interface AddressInfo {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

export interface UserData {
    accountInfo: AccountInfo;
    birthDate: BirthDate;
    options: CheckOptions;
    address: AddressInfo;
}

export default class SignUpPage extends BasePage {

    private enterAccountInfoTitle: Locator;
    private mrRadioButton: Locator;
    private mrsRadioButton: Locator;
    private nameField: Locator;
    private emailField: Locator;
    private passwordField: Locator;
    private selectDays: Locator;
    private selectMonths: Locator;
    private selectYears: Locator;
    private newsletterCheckbox: Locator;
    private offersCheckbox: Locator;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private companyField: Locator;
    private address1Field: Locator;
    private address2Field: Locator;
    private selectCountry: Locator;
    private stateField: Locator;
    private cityField: Locator;
    private zipcodeField: Locator;
    private mobileNumberField: Locator;
    private createAccountButton: Locator;


    constructor(page: Page) {
        super(page)
        this.enterAccountInfoTitle = page.locator("#form  div > div > h2 > b");
        this.mrRadioButton = page.locator("#id_gender1");
        this.mrsRadioButton = page.locator("#id_gender2");
        this.nameField = page.locator("[data-qa='name']");
        this.emailField = page.locator("[data-qa='email']");
        this.passwordField = page.locator("[data-qa='password']");
        this.selectDays = page.locator("[data-qa='days']");
        this.selectMonths = page.locator("[data-qa='months']");
        this.selectYears = page.locator("[data-qa='years']");
        this.newsletterCheckbox = page.locator("#newsletter");
        this.offersCheckbox = page.locator("#optin");
        this.firstNameField = page.locator("[data-qa='first_name']");
        this.lastNameField = page.locator("[data-qa='last_name']");
        this.companyField = page.locator("[data-qa='company']");
        this.address1Field = page.locator("[data-qa='address']");
        this.address2Field = page.locator("[data-qa='address2']");
        this.selectCountry = page.locator("[data-qa='country']");
        this.stateField = page.locator("[data-qa='state']");
        this.cityField = page.locator("[data-qa='city']");
        this.zipcodeField = page.locator("[data-qa='zipcode']")
        this.mobileNumberField = page.locator("[data-qa='mobile_number']");
        this.createAccountButton = page.locator("[data-qa='create-account']");
    }

    async getEnterAccountInfoTitleText(): Promise<string> {
        return await this.getElementText(this.enterAccountInfoTitle);
    }

    async verifyEnterAccountInfoTitleText(): Promise<void> {
        const actualText = await this.getEnterAccountInfoTitleText();
        const expectedText = "ENTER ACCOUNT INFORMATION";
        expect(actualText).toEqual(expectedText);
    }

    async selectMrGender(): Promise<void> {
        await this.clickElement(this.mrRadioButton);
    }

    async selectMrsGender(): Promise<void> {
        await this.clickElement(this.mrsRadioButton);
    }

    async selectGender(gender: "Mr" | "Mrs"): Promise<void> {
        if (gender === "Mr") {
            await this.selectMrGender();
        } else {
            await this.selectMrsGender();
        }
    }

    async getNameValue(): Promise<string> {
        return await this.getElementInputValue(this.nameField);
    }

    async verifyNameValue(expectedName: string): Promise<void> {
        const actualName = await this.getNameValue();
        expect(actualName).toEqual(expectedName);
    }

    async getEmailValue(): Promise<string> {
        return await this.getElementInputValue(this.emailField);
    }

    async verifyEmailValue(expectedEmail: string): Promise<void> {
        const actualEmail = await this.getEmailValue();
        expect(actualEmail).toEqual(expectedEmail);
    }

    async fillPassword(password: string): Promise<void> {
        await this.fillText(this.passwordField, password);
    }

    async fillAccountInfo(accountInfo: AccountInfo): Promise<void> {
        await this.selectGender(accountInfo.gender);
        await this.verifyNameValue(accountInfo.name);
        await this.verifyEmailValue(accountInfo.email);
        await this.fillPassword(accountInfo.password);
    }


    async daysSelect(optionDays: string): Promise<void> {
        await this.selectOption(this.selectDays, optionDays)
    }

    async monthsSelect(optionMonths: string): Promise<void> {
        await this.selectOption(this.selectMonths, optionMonths);
    }

    async yearsSelect(optionYears: string): Promise<void> {
        await this.selectOption(this.selectYears, optionYears);
    }

    async selectBirthDate(birthDate: BirthDate): Promise<void> {
        await this.daysSelect(birthDate.day);
        await this.monthsSelect(birthDate.month);
        await this.yearsSelect(birthDate.year);
    }


    async checkNewsletterOption(): Promise<void> {
        await this.checkElement(this.newsletterCheckbox);
    }

    async checkOfferOption(): Promise<void> {
        await this.clickElement(this.offersCheckbox);
    }

    async checkOptions(options: CheckOptions): Promise<void> {
        if (options.newsletter) {
            await this.checkNewsletterOption();
        }
        if (options.offers) {
            await this.checkOfferOption();
        }
    }


    async fillFirstName(firstName: string): Promise<void> {
        await this.fillText(this.firstNameField, firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.fillText(this.lastNameField, lastName);
    }

    async fillCompany(company: string): Promise<void> {
        await this.fillText(this.companyField, company);
    }

    async fillAddress1(address1: string): Promise<void> {
        await this.fillText(this.address1Field, address1);
    }

    async fillAddress2(address2: string): Promise<void> {
        await this.fillText(this.address2Field, address2);
    }

    async countrySelect(optionCountry: string): Promise<void> {
        await this.selectOption(this.selectCountry, optionCountry);
    }

    async fillState(state: string): Promise<void> {
        await this.fillText(this.stateField, state);
    }

    async fillCity(city: string): Promise<void> {
        await this.fillText(this.cityField, city);
    }

    async fillZipcode(zipcode: string): Promise<void> {
        await this.fillText(this.zipcodeField, zipcode);
    }

    async fillMobileNumber(mobileNumber: string): Promise<void> {
        await this.fillText(this.mobileNumberField, mobileNumber);
    }
    //fill address information
    async fillAddressInfo(address: AddressInfo): Promise<void> {
        await this.fillFirstName(address.firstName);
        await this.fillLastName(address.lastName);
        await this.fillCompany(address.company);
        await this.fillAddress1(address.address1);
        await this.fillAddress2(address.address2);
        await this.countrySelect(address.country);
        await this.fillState(address.state);
        await this.fillCity(address.city);
        await this.fillZipcode(address.zipcode);
        await this.fillMobileNumber(address.mobileNumber);
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.clickElement(this.createAccountButton);
    }

    async createUserAccount(userData: UserData): Promise<void> {
        await this.fillAccountInfo(userData.accountInfo);
        await this.selectBirthDate(userData.birthDate);
        await this.checkOptions(userData.options);
        await this.fillAddressInfo(userData.address);
        await this.clickCreateAccountButton();
    }

}