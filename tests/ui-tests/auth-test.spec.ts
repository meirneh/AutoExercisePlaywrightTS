
import { test} from "../../utils/fixtures/fixtures";
import type { Page } from "@playwright/test";

import HeaderFooterPage from "../../pages/HeaderFooterPage";
import LoginSignUpPage from "../../pages/LoginSignUpPage";
import SignUpPage, { UserData } from "../../pages/SignUpPage";
import AccountCreatedPage from "../../pages/AccounCreatedPage";
import AccountDeletedPage from "../../pages/AccountDeletedPage";
import { WRONG_EMAIL, WRONG_PASSWORD, EMPTY_PASSWORD, EXISTING_USER_NAME, userData } from "../../utils/data-test/auth";
import { goHome } from "../../utils/helpers/navigation";
import { acceptCookiesIfPresent } from "../../utils/helpers/consent";

let pageRef: Page;

let headerFooterPage: HeaderFooterPage;
let loginSignUpPage: LoginSignUpPage;
let signUpPage: SignUpPage;
let accountCreatedPage: AccountCreatedPage;
let accountDeletedPage: AccountDeletedPage;

const registerNewUser = async (data: UserData): Promise<void> => {
    await loginSignUpPage.verifyNewUserSignUpTitle();
    await loginSignUpPage.newUserSignUp(data.accountInfo.name, data.accountInfo.email);
    await signUpPage.verifyEnterAccountInfoTitleText();
    await signUpPage.createUserAccount(data);
    await accountCreatedPage.clickContinueButton();
    await headerFooterPage.verifyLoggedInAsUser(data.accountInfo.name);
}

const loginAndVerify = async (email: string, password: string, expectedName: string): Promise<void> => {
    await loginSignUpPage.verifyLoginToYourAccountTitle();
    await loginSignUpPage.loginUser(email, password);
    await headerFooterPage.verifyLoggedInAsUser(expectedName);
}

const deleteAccountAndContinue = async (): Promise<void> => {
    await headerFooterPage.deleteUserAccount();
    await accountDeletedPage.verifyDeletionAndContinue();
}

test.use({
    baseURL: process.env.BASE_URL ?? 'https://automationexercise.com/',
})

test.describe("Authentication Flow: Registration, Login, and Logout", () => {
    
    test.beforeEach(async ({ page,
        headerFooterPage: h,
        loginSignUpPage: l,
        signUpPage: s,
        accountCreatedPage: ac,
        accountDeletedPage: ad, }) => {
        headerFooterPage = h;
        loginSignUpPage = l;
        signUpPage = s;
        accountCreatedPage = ac;
        accountDeletedPage = ad;
        pageRef = page;

        await page.goto("/", { waitUntil: "domcontentloaded" });
        await acceptCookiesIfPresent(page);

        await goHome(headerFooterPage);
        await headerFooterPage.goToLoginLogout();
    });

    test("TC-01 Register User", async () => {
        await registerNewUser(userData);
        await deleteAccountAndContinue();
    });

    test("TC-02 Login User with correct email and password", async () => {
        await registerNewUser(userData);
        await headerFooterPage.logoutUser();
        await loginAndVerify(userData.accountInfo.email, userData.accountInfo.password, userData.accountInfo.name);
        await deleteAccountAndContinue();
    });

    test("TC-03 Login User with incorrect password", async () => {
        await loginSignUpPage.verifyLoginToYourAccountTitle();
        await loginSignUpPage.loginUser(userData.accountInfo.email, WRONG_PASSWORD);
        await loginSignUpPage.verifyErrorLoginMessageText();
    });

    test("TC-04 Login User with incorrect email", async () => {
        await loginSignUpPage.verifyLoginToYourAccountTitle();
        await loginSignUpPage.loginUser(WRONG_EMAIL, userData.accountInfo.password);
        await loginSignUpPage.verifyErrorLoginMessageText();
    });

    test('TC-05 Login User without password', async () => {
        await loginSignUpPage.verifyLoginToYourAccountTitle();
        await loginSignUpPage.loginUser(userData.accountInfo.email, EMPTY_PASSWORD);
        await loginSignUpPage.verifyErrorLoginMessageText();
    })

    test("TC-06 Logout User", async () => {
        await registerNewUser(userData);
        await headerFooterPage.logoutUser();
        await loginAndVerify(userData.accountInfo.email, userData.accountInfo.password, userData.accountInfo.name);
        await headerFooterPage.logoutUser();
        await loginAndVerify(userData.accountInfo.email, userData.accountInfo.password, userData.accountInfo.name);
        await headerFooterPage.logoutUser();
    });

    test("TC-07 Register User with existing email", async () => {
        await loginSignUpPage.verifyNewUserSignUpTitle();
        await loginSignUpPage.newUserSignUp(EXISTING_USER_NAME, userData.accountInfo.email);
        await loginSignUpPage.verifyErrorExistMailText();
        await loginAndVerify(userData.accountInfo.email, userData.accountInfo.password, userData.accountInfo.name);
        await deleteAccountAndContinue();
    });
});
