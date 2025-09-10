
import { test, expect } from "../../utils/fixtures/fixtures";
import type { Page } from "@playwright/test";

import HeaderFooterPage from "../../pages/HeaderFooterPage";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import CartPage from "../../pages/CartPage";
import { PATH_VIEW_CART } from "../../utils/data-test/cartCheckout";
type Section = Parameters<ProductsPage['selectSection']>[0];
type SubSection = Parameters<ProductsPage['selectSection']>[1];



import {
  QUERY, productList, resultList, productsTopsList, productsTShirtsList,
  brandHMList, productDetails, recommendedItemList, item
} from "../../utils/data-test/product";
import { acceptCookiesIfPresent } from "../../utils/helpers/consent";

let pageRef: Page; // page from fixture

let headerFooterPage: HeaderFooterPage;
let productsPage: ProductsPage;
let productDetailsPage: ProductDetailsPage;
let cartPage: CartPage;

const goHome = async (): Promise<void> => {
  await headerFooterPage.goToHomePage();
  await headerFooterPage.verifyHomeTabIsHighlighted();
};

const goToProducts = async (): Promise<void> => {
  await headerFooterPage.goToProductsPage();
  await productsPage.verifyAllProductsTitleText();
};

type Named = { name: string };
const searchAndVerify = async (query: string, expected: Named[]): Promise<void> => {
  await goToProducts();
  await productsPage.searchProduct(query);
  await productsPage.verifyProductList(expected);
};

const selectSectionAndVerify = async (
  section: Section,
  sub: SubSection,
  expected: Named[],
): Promise<void> => {
  await goToProducts();
  await productsPage.verifyCategoryTitleText();
  await productsPage.selectSection(section, sub);
  await productsPage.verifySectionProductsTitle(section, sub);
  await productsPage.verifyProductList(expected);
};

const selectBrandAndVerify = async (brand: string, expected: Named[]): Promise<void> => {
  await productsPage.verifyBrandsTitleText();
  await productsPage.selectBrand(brand);
  await productsPage.verifyBrandProductsTitle(brand);
  await productsPage.verifyProductList(expected);
};

const addProductsAndGoToCart = async (names: string[]): Promise<void> => {
  for (let i = 0; i < names.length; i++) {
    await productsPage.addToCartByName(names[i]);
    if (i < names.length - 1) {
      await productsPage.continueShopping(); // closes the intermediate modal
    }
  }

  const goToCart = async (): Promise<void> => {
    await pageRef.goto(`/${PATH_VIEW_CART}`, { waitUntil: 'domcontentloaded' });
  }

  // 👇 Avoid overlays/ads that block header clicks
  await goToCart();
  await expect(pageRef).toHaveURL(/\/view_cart$/);
};

// ===== Fixture configuration (como en specs ya migrados) =====
test.use({
  baseURL: process.env.BASE_URL ?? "https://automationexercise.com/",
});

test.describe("Products Suite", () => {
  test.beforeEach(async ({ page, headerFooterPage: h, productsPage: p, productDetailsPage: d, cartPage: c }) => {
    // Asigno POMs desde el fixture para que las funciones de arriba las usen
    headerFooterPage = h;
    productsPage = p;
    productDetailsPage = d;
    cartPage = c;
    pageRef = page;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await acceptCookiesIfPresent(page);
  });

  // ---------------------------
  // Search & Listing scenarios
  // ---------------------------
  test("TC 01: Verify All Products and product detail page", async () => {
    await headerFooterPage.goToHomePage();
    await goToProducts();
    await productsPage.verifyProductList(productList);
    await productsPage.clickViewProductByName(productList[0].name);
    await productDetailsPage.verifyDetailsProduct(productDetails);
    await headerFooterPage.goToProductsPage();
  });

  test("TC-02 Search Product", async () => {
    await searchAndVerify(QUERY, resultList);
  });

  test("TC-03 View Category Products", async () => {
    await selectSectionAndVerify('WOMEN', 'TOPS', productsTopsList);
    await selectSectionAndVerify('MEN', 'TSHIRTS', productsTShirtsList);
  });

  test('TC-04 View & Cart Brand Products', async () => {
    await selectBrandAndVerify("H&M", brandHMList);
  })

  // ---------------------------
  // Product review
  // ---------------------------
  test("TC-05 Add review on product", async () => {
    await goHome();
    await headerFooterPage.goToProductsPage();
    await productsPage.clickViewProductByName(productList[0].name);
    await productDetailsPage.verifyWriteYourReviewTitle();
    await productDetailsPage.fillYourReview("Haim Cohen", "cohen@gmail.com", "Text Test");
    await productDetailsPage.verifySuccessMessage();
  });

  // ---------------------------
  // Recommended items
  // ---------------------------
  test("TC-06 Add to cart from Recommended items", async () => {
    await goHome();
    await headerFooterPage.verifyRecommendedItemsTitleText();
    await headerFooterPage.verifyProductList(recommendedItemList);
    await addProductsAndGoToCart([recommendedItemList[19].name]);
    await headerFooterPage.goToCartPage();
    await cartPage.verifyCartItems(item);
    await cartPage.removeProductByName(recommendedItemList[19].name);
  });
});
