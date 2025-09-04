import { test } from "../utils/fixtures/fixtures";
import type { Page } from "@playwright/test";
import HeaderFooterPage from "../pages/HeaderFooterPage";
import { SUBSCRIPTION_EMAIL } from "../utils/data-test/scroll-subscription";
import { goHome } from "../utils/helpers/navigation";
import { submitSubscription } from "../utils/helpers/susbscriptions";
import { acceptCookiesIfPresent } from "../utils/helpers/consent";

test.use({
    baseURL: process.env.BASE_URL ?? "https://automationexercise.com/",
});

let pageRef: Page;
let headerFooterPage: HeaderFooterPage;

test.describe("Scroll & Subscription Suite", () => {
    test.beforeEach(async ({ page, headerFooterPage:h }) => {
        headerFooterPage = h;
        pageRef = page;
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await acceptCookiesIfPresent(page);
    })

    test("TC-01 Verify Scroll Up using 'Arrow' button and Scroll Down", async () => {
        await goHome(headerFooterPage);
        await headerFooterPage.goToSuscription();
        await headerFooterPage.verifySuscriptionTitle();
        await headerFooterPage.scrollUp();
        await headerFooterPage.verifyFullFledgedTitle();
    });

    test("TC-02 Verify Scroll Up without 'Arrow' button and Scroll Down", async () => {
        await goHome(headerFooterPage);
        await headerFooterPage.goToSuscription();
        await headerFooterPage.verifySuscriptionTitle();
        await headerFooterPage.goToFullFledgedTitle();
        await headerFooterPage.verifyFullFledgedTitle();
    });

    test("TC-03 Verify Subscription in Home pages", async () => {
        await goHome(headerFooterPage);
        await submitSubscription(headerFooterPage, SUBSCRIPTION_EMAIL);
    });

    test("TC-04 Verify Subscription in Cart pages ", async () => {
        await headerFooterPage.goToCartPage();
        await pageRef.waitForLoadState("domcontentloaded"); 
        await submitSubscription(headerFooterPage, SUBSCRIPTION_EMAIL);
    });
});
