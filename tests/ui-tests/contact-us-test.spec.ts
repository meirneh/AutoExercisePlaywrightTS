import { test } from "../../utils/fixtures/fixtures"
import type { Page } from "@playwright/test";
import HeaderFooterPage from "../../pages/HeaderFooterPage";
import ContactUsPage from "../../pages/ContactUsPage";
import { contactUsFormInput } from "../../utils/data-test/contactUs";
import { acceptCookiesIfPresent } from "../../utils/helpers/consent";
import { goHome } from "../../utils/helpers/navigation";

test.use({
    baseURL: process.env.BASE_URL ?? "https://automationexercise.com/",
});

let pageRef: Page; // page from fixture
let headerFooterPage: HeaderFooterPage;
let contactUsPage: ContactUsPage;

test.describe('Contact Us tests', () => {
    test.beforeEach(async ({ page, headerFooterPage: h, contactUsPage: c }) => {
         headerFooterPage = h;
         contactUsPage = c;
         pageRef = page;
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await acceptCookiesIfPresent(page);
    });

    test('TC-01 Contact Us Form', async () => {
        await goHome(headerFooterPage);
        await headerFooterPage.goToContactUs();
        await contactUsPage.verifyContactUsTitle();
        await contactUsPage.verifyGetInTouchTitle();
        await contactUsPage.fillSubmitVerifyHome(contactUsFormInput);
        await headerFooterPage.verifyHomeTabIsHighlighted();
    });
});
