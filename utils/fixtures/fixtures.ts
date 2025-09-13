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
import type { APIResponse } from '@playwright/test';
import { UsersApiData, UserApiPayloads } from '../data-test/users-api';
import { FORM_URLENCODED_HEADER, toFormUrlEncoded, parse } from '../helpers/apiHelpers';

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

type ApiResponse<T = any> = { res: APIResponse; json: T };
type ApiTools = {
  createUser: () => Promise<ApiResponse>;
  loginUser: () => Promise<ApiResponse>;
  getUserByEmail: () => Promise<ApiResponse>;
  deleteUser: () => Promise<ApiResponse>;
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

})
.extend<{ api: ApiTools }>({
    api: async ({ request }, use) => {
      const api: ApiTools = {
        createUser: async () => {
          const res = await request.post(UsersApiData.endpoints.create, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded(UserApiPayloads.create()),
          });
          const json = await parse(res);
          return { res, json };
        },
        loginUser: async () => {
          const res = await request.post(UsersApiData.endpoints.login, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded(UserApiPayloads.login()),
          });
          const json = await parse(res);
          return { res, json };
        },
        getUserByEmail: async () => {
          const { email } = UserApiPayloads.getByEmail();
          const res = await request.get(
            `${UsersApiData.endpoints.getByEmail}?email=${encodeURIComponent(email)}`
          );
          const json = await parse(res);
          return { res, json };
        },
        deleteUser: async () => {
          const res = await request.delete(UsersApiData.endpoints.delete, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded(UserApiPayloads.delete()),
          });
          const json = await parse(res);
          return { res, json };
        },
      };

      await use(api);
    },
  });

export const expect = baseExpect;
