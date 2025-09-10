
import { test, expect } from "../../utils/fixtures/fixtures";
import type { Page } from "@playwright/test"
import HeaderFooterPage from "../../pages/HeaderFooterPage";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import CartPage from "../../pages/CartPage";
import LoginSignUpPage from "../../pages/LoginSignUpPage";
import SignUpPage, { UserData } from "../../pages/SignUpPage";
import AccountCreatedPage from "../../pages/AccounCreatedPage";
import CheckoutPage, { DeliveryAddress } from "../../pages/CheckoutPage";
import AccountDeletedPage from "../../pages/AccountDeletedPage";
import PaymentPage, { PaymentDetailsSplit } from "../../pages/PaymentPage";
import { productList, resultList } from "../../utils/data-test/product";
import {
  ORDER_COMMENT, PATH_VIEW_CART,
  SELECTED_TWO_PRODUCTS, userData, userInfoAddress,
  card, EXPECT_CART_TWO_ITEMS, EXPECT_CART_TOTAL_TWO_ITEMS,
  QTY_STYLISH_DRESS, EXPECT_STYLISH_DRESS_CART, EXPECT_SEARCH_CART, SEARCH_QUERY_TSHIRT
} from "../../utils/data-test/cartCheckout";
import { goHome, goToCart } from "../../utils/helpers/navigation";
import { acceptCookiesIfPresent } from "../../utils/helpers/consent";

let pageRef: Page;

let headerFooterPage: HeaderFooterPage;
let productsPage: ProductsPage;
let cartPage: CartPage;
let productDetailsPage: ProductDetailsPage;
let loginSignUpPage: LoginSignUpPage;
let signUpPage: SignUpPage;
let accountCreatedPage: AccountCreatedPage;
let checkoutPage: CheckoutPage;
let paymentPage: PaymentPage;
let accountDeletedPage: AccountDeletedPage;

test.describe('Cart operations and checkout flows', () => {
  test.use({ baseURL: process.env.BASE_URL ?? 'https://automationexercise.com/', });

  // --- Hook helpers & baseline ---
  // Ensures cart is empty before each test to avoid cross-test pollution
  const clearCartIfAny = async () => {
    if (!pageRef || pageRef.isClosed()) return; // guard por si la page ya se cerró

    // await page.goto(`${SITE_URL}${PATH_VIEW_CART}`, { waitUntil: 'domcontentloaded' }); // CHG: PATH_VIEW_CART
    await pageRef.goto(`/${PATH_VIEW_CART}`, { waitUntil: 'domcontentloaded' });
    const names = await cartPage.getAllProductNamesInCart();

    if (names.length) {
      await cartPage.removeProductByName(names);
    }
  };

  // ✅ Add N products (already in Products) and navigate DIRECTLY to the cart
  const addProductsAndGoToCart = async (names: string[]): Promise<void> => {
    for (let i = 0; i < names.length; i++) {
      await productsPage.addToCartByName(names[i]);
      if (i < names.length - 1) {
        await productsPage.continueShopping(); // closes the intermediate modal
      }
    }

    // 👇 Avoid overlays/ads that block header clicks
    await goToCart(pageRef, PATH_VIEW_CART);
    await expect(pageRef).toHaveURL(/\/view_cart$/);
  };

  // ✅ Helper: registra usuario y abre Products
  const registerUser = async (user: UserData): Promise<void> => {
    await headerFooterPage.goToLoginLogout();
    await loginSignUpPage.newUserSignUp(user.accountInfo.name, user.accountInfo.email);
    await signUpPage.createUserAccount(user);
    await accountCreatedPage.verifyCreationAndContinue();
    await headerFooterPage.verifyLoggedInAsUser(user.accountInfo.name);
  };

  // ✅ Helper: reviews checkout (addresses + cart), adds comment and places order
  const reviewCheckoutAndPlaceOrder = async (
    address: DeliveryAddress,
    expectedItems: { name: string; price: number; quantity: number; total: number }[],
    expectedTotal: number,
    comment: string
  ): Promise<void> => {
    await checkoutPage.verifyAddressDeliveryTitle();
    await checkoutPage.verifyAddressInfo(address); // usa tu wrapper combinado
    await checkoutPage.verifyCart(expectedItems, expectedTotal);
    await checkoutPage.fillComment(comment);
    await checkoutPage.placeOrder();
  };

  // ✅ Helper: Pay and verify the order (using PaymentPage only)
  const payAndVerifyOrder = async (details: PaymentDetailsSplit): Promise<void> => {
    await paymentPage.submitPayment(details);
    await paymentPage.verifyPlacedTitle();
    await paymentPage.clickContinueButton();
  };

  // ✅ Helper: Delete the account and continue
  const deleteAccountAndContinue = async (): Promise<void> => {
    await headerFooterPage.deleteUserAccount();
    await accountDeletedPage.verifyDeletionAndContinue();
  };

  // ✅ Helper: Complete checkout (review + payment + verification)
  const completeCheckout = async (
    address: DeliveryAddress,
    expectedItems: { name: string; price: number; quantity: number; total: number }[],
    expectedTotal: number,
    comment: string,
    details: PaymentDetailsSplit
  ): Promise<void> => {
    await reviewCheckoutAndPlaceOrder(address, expectedItems, expectedTotal, comment);
    await payAndVerifyOrder(details);
  };

  test.beforeEach(async ({ page, headerFooterPage: h, productsPage: p,
    cartPage: c, productDetailsPage: pd, loginSignUpPage: l,
    signUpPage: s, accountCreatedPage: ac, checkoutPage: co,
    paymentPage: py, accountDeletedPage: ad }) => {
    headerFooterPage = h;
    productsPage = p;
    cartPage = c;
    productDetailsPage = pd;
    loginSignUpPage = l;
    signUpPage = s;
    accountCreatedPage = ac;
    checkoutPage = co;
    paymentPage = py;
    accountDeletedPage = ad;
    pageRef = page;

    // Setup común
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await acceptCookiesIfPresent(page);
  });

  test.afterEach(async () => {
    try { await headerFooterPage.logoutUser(); } catch { }
    try { await clearCartIfAny(); } catch { }
    try {
      await goHome(headerFooterPage);
    } catch { }
  });

  test('TC-01 Add Products in Cart', async () => {
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS);
    await cartPage.verifyCartItems(EXPECT_CART_TWO_ITEMS);
    await cartPage.removeProductByName(SELECTED_TWO_PRODUCTS);
  })

  test('TC-02 Verify Product quantity in Cart ', async () => {
    await headerFooterPage.goToProductsPage();
    await productsPage.clickViewProductByName(productList[2].name);
    await productDetailsPage.fillQuantityField(QTY_STYLISH_DRESS.toString());
    await productDetailsPage.addToCart()
    await productDetailsPage.viewCart()
    await cartPage.verifyCartItems(EXPECT_STYLISH_DRESS_CART)
    await cartPage.removeProductByName(productList[2].name);
  });

  test('TC-03 Place Order: Register while Checkout', async () => {
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS);
    await cartPage.proceedToCheckout();
    await cartPage.goToRegisterLogin();
    await loginSignUpPage.newUserSignUp(userData.accountInfo.name, userData.accountInfo.email);
    await signUpPage.createUserAccount(userData);
    await accountCreatedPage.verifyCreationAndContinue();
    await headerFooterPage.verifyLoggedInAsUser(userData.accountInfo.name);
    await headerFooterPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await completeCheckout(
      userInfoAddress,
      EXPECT_CART_TWO_ITEMS,
      EXPECT_CART_TOTAL_TWO_ITEMS,
      ORDER_COMMENT,
      card
    );
    await deleteAccountAndContinue();
  })

  test('TC-04 Place Order: Register before Checkout', async () => {
    await registerUser(userData);
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.proceedToCheckout();
    await completeCheckout(
      userInfoAddress,
      EXPECT_CART_TWO_ITEMS,
      EXPECT_CART_TOTAL_TWO_ITEMS,
      ORDER_COMMENT,
      card
    );
    await deleteAccountAndContinue();
  })

  test('TC-05 Place Order: Login before Checkout', async () => {
    await registerUser(userData);
    await headerFooterPage.logoutUser();
    await loginSignUpPage.loginUser(userData.accountInfo.email, userData.accountInfo.password);
    await headerFooterPage.verifyLoggedInAsUser(userData.accountInfo.name);
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.proceedToCheckout();
    await completeCheckout(
      userInfoAddress,
      EXPECT_CART_TWO_ITEMS,
      EXPECT_CART_TOTAL_TWO_ITEMS,
      ORDER_COMMENT,
      card
    );
    await deleteAccountAndContinue();
  })

  test('TC-06 Remove Products From Cart', async () => {
    await registerUser(userData);
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.verifyCartItems(EXPECT_CART_TWO_ITEMS);
    await cartPage.removeProductByName(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.verifyProductsNotInCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.verifyMessageEmpty();
    await deleteAccountAndContinue();
  })

  test('TC-07 Search Products and Verify Cart After Login', async () => {
    await registerUser(userData);
    await headerFooterPage.logoutUser();
    await headerFooterPage.goToProductsPage();
    await productsPage.searchProduct(SEARCH_QUERY_TSHIRT);
    await productsPage.verifyProductList(resultList);
    await addProductsAndGoToCart([resultList[0].name, resultList[1].name]);
    await cartPage.verifyCartItems(EXPECT_SEARCH_CART);
    await headerFooterPage.goToLoginLogout();
    await loginSignUpPage.loginUser(userData.accountInfo.email, userData.accountInfo.password);
    await headerFooterPage.goToCartPage();
    await cartPage.verifyCartItems(EXPECT_SEARCH_CART);
    await deleteAccountAndContinue();
  })

  test('TC-08 Verify address details in checkout page', async () => {
    await registerUser(userData);
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyAddressDeliveryTitle();
    await checkoutPage.verifyAddressInvoiceInfo(userInfoAddress);
    await deleteAccountAndContinue();
  })

  test('TC-09 Download Invoice after purchase order', async () => {
    await registerUser(userData);
    await headerFooterPage.logoutUser();
    await loginSignUpPage.loginUser(userData.accountInfo.email, userData.accountInfo.password);
    await headerFooterPage.verifyLoggedInAsUser(userData.accountInfo.name);
    await headerFooterPage.goToProductsPage();
    await addProductsAndGoToCart(SELECTED_TWO_PRODUCTS); // CHG
    await cartPage.proceedToCheckout();

    await reviewCheckoutAndPlaceOrder(
      userInfoAddress,
      EXPECT_CART_TWO_ITEMS,
      EXPECT_CART_TOTAL_TWO_ITEMS,
      ORDER_COMMENT,
    );

    await paymentPage.submitPayment(card);

    // download and get the physical path of the file
    const invoicePath = await paymentPage.downloadInvoice();

    // normalize the total in case it comes with a symbol/spaces (a number remains)
    const expectedAmount = Number(String(EXPECT_CART_TOTAL_TWO_ITEMS).replace(/[^\d]/g, ''));

    // verification with exact content
    await paymentPage.verifyInvoiceDownloaded(invoicePath, {
      name: userData.accountInfo.name,
      amount: expectedAmount,
    });
    await paymentPage.clickContinueButton();
    await deleteAccountAndContinue();
  });

});
