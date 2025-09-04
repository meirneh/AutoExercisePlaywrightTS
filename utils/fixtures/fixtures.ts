// utils/fixtures/fixtures.ts
import { test as base, expect as baseExpect } from '@playwright/test';

import HeaderFooterPage from '../../pages/HeaderFooterPage';
import ProductsPage from '../../pages/ProductsPage';
import ProductDetailsPage from '../../pages/ProductDetailsPage';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import ContactUsPage from '../../pages/ContactUsPage';
import LoginSignUpPage from '../../pages/LoginSignUpPage';
import SignUpPage from '../../pages/SignUpPage';
import AccountCreatedPage from '../../pages/AccounCreatedPage';
import AccountDeletedPage from '../../pages/AccountDeletedPage';
import PaymentPage from '../../pages/PaymentPage';

type AppFixtures = {
  headerFooterPage: HeaderFooterPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactUsPage: ContactUsPage;
  loginSignUpPage: LoginSignUpPage;
  signUpPage: SignUpPage;
  accountCreatedPage: AccountCreatedPage;
  accountDeletedPage: AccountDeletedPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<AppFixtures>({
  headerFooterPage: async ({ page }, use) => {
    await use(new HeaderFooterPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
  loginSignUpPage: async ({ page }, use) => {
    await use(new LoginSignUpPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  accountCreatedPage: async ({ page }, use) => {
    await use(new AccountCreatedPage(page));
  },
  accountDeletedPage: async ({ page }, use) => {
    await use(new AccountDeletedPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
});

export const expect = baseExpect;
