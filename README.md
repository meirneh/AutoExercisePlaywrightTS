# AutomationExercise Playwright (TypeScript)

End-to-end UI automation project built with **Playwright + TypeScript**, using a **Page Object Model (POM)** and a **global fixture** to inject reusable pages, helpers, and test data.  
It covers flows for **Contact Us, Scroll/Subscription, Products, Authentication, Cart & Checkout**.

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **Git**
- (Optional) **VS Code** with the “Playwright Test for VS Code” extension

### Installation
```bash
git clone <YOUR-REPO-URL>
cd <YOUR-REPO-FOLDER>
npm install
npx playwright install
```

### Run the tests
```bash
# All tests (headless)
npx playwright test

# Headed (see the browser)
npx playwright test --headed

# A single spec
npx playwright test tests/product-test.spec.ts

# A single test by title
npx playwright test -g "TC-01"

# HTML report
npx playwright show-report
```

### Optional: Base URL
Specs use `process.env.BASE_URL` with fallback to `https://automationexercise.com/`.  
If you want to override:
```bash
# Windows CMD
set BASE_URL=https://automationexercise.com/
# PowerShell
$env:BASE_URL="https://automationexercise.com/"
# macOS/Linux
export BASE_URL=https://automationexercise.com/
```

### Optional: Running from VS Code
You can click ▶️ next to a spec or test.  
If a “Close browser” window remains open, disable **Settings → Playwright: Use UI Mode**.

---

## Project Description

**Goal:** Provide a maintainable, scalable E2E test suite for a demo e-commerce site.  
**Approach:**
- **POM** to encapsulate selectors and actions per page.
- **Global fixture** to create and inject POMs per test. Common setup (navigate to `/`, accept cookies) lives in `beforeEach`.
- **Centralized test data** for data-driven scenarios.
- **Helpers** for cross-cutting flows (navigation, cookie consent, subscriptions).

---

## Project Structure

```
.
├─ pages/                              # Page Objects (POM)
│  ├─ BasePage.ts                      # Common navigation & base assertions
│  ├─ HeaderFooterPage.ts              # Header / footer / primary navigation
│  ├─ LoginSignUpPage.ts               # Login & sign up form
│  ├─ SignUpPage.ts                    # Full user registration
│  ├─ AccounCreatedPage.ts             # Account created confirmation (file name typo kept)
│  ├─ AccountDeletedPage.ts            # Account deleted confirmation
│  ├─ ProductsPage.ts                  # Listing/search/categories/brands
│  ├─ ProductDetailsPage.ts            # Product details, quantity, reviews
│  ├─ CartPage.ts                      # Cart: items, quantities, totals
│  ├─ CheckoutPage.ts                  # Address / summary / comments
│  ├─ PaymentPage.ts                   # Payment and confirmation
│  └─ ContactUsPage.ts                 # Contact form
│
├─ utils/
│  ├─ fixtures/
│  │  └─ fixtures.ts                  # Global fixture (extends `test`, injects POMs)
│  ├─ helpers/
│  │  ├─ consent.ts                   # Accept cookie banner if present
│  │  ├─ navigation.ts                # `goHome`, `goToCart`, small route helpers
│  │  └─ susbscriptions.ts            # Subscription helper (name kept as in project)
│  └─ data-test/                      # Test data (objects & constants)
│     ├─ addresses.ts
│     ├─ auth.ts
│     ├─ cards.ts
│     ├─ cartCheckout.ts
│     ├─ contactUs.ts
│     ├─ product.ts
│     ├─ scroll-subscription.ts
│     └─ users.ts
│
├─ tests/                              # Specs (one suite per flow)
│  ├─ auth-test.spec.ts                # Registration, login, logout, error validations
│  ├─ cart-checkout-test.spec.ts       # Cart & Checkout (register/login before or during)
│  ├─ contact-us-test.spec.ts          # Contact Us form
│  ├─ product-test.spec.ts             # Search, categories, brands, recommended, reviews
│  └─ scroll-subscription-test.spec.ts # Scroll up/down & subscription (home/cart)
│
├─ playwright.config.ts                # Base config (reporters, retries, etc.)
└─ README.md
```

---

## How It Works (Fixture, POMs, Helpers, Data)

### Global Fixture (`utils/fixtures/fixtures.ts`)
Extends `@playwright/test` and exposes POMs as test fixtures. In specs, you import `test/expect` from the fixture and use a shared `beforeEach`:

```ts
import { test, expect } from "../utils/fixtures/fixtures";

test.beforeEach(async ({ page, headerFooterPage, productsPage }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Accept cookies, common setup, etc.
});

test("example", async ({ headerFooterPage, productsPage }) => {
  await headerFooterPage.goToProductsPage();
  await productsPage.searchProduct("dress");
});
```

### Page Objects
Each class models a page and encapsulates **private selectors**, **actions** (clicks/fills), and **assertions** (`expect(...)`).  
This decouples tests from DOM details and improves reuse.

### Helpers
Small, high-level functions used across specs (navigate home/cart, submit subscription, accept cookies). Reduce duplication and keep specs focused on behavior.

### Test Data
Typed objects for inputs & expectations (users, addresses, cards, products, validation texts).  
Enables data-driven testing and keeps specs clean.

---

## Install & Run (CLI quick reference)

```bash
# Install deps & browsers
npm install
npx playwright install

# Run all tests
npx playwright test

# Headed mode
npx playwright test --headed

# Filter by spec
npx playwright test tests/auth-test.spec.ts

# Filter by title
npx playwright test -g "TC-02"

# Report
npx playwright show-report
```

---

## Notes & Conventions

- **Naming:** specs end with `*-test.spec.ts`; test titles prefixed with `TC-XX` for traceability.
- **Automatic teardown:** no manual `chromium.launch()` / `page.close()`; Playwright manages `browser/context/page` per test.
- **VS Code UI Mode:** if a window asks to “Close browser”, that’s the UI runner. Disable **Use UI Mode** to auto-close.

---

## Future Improvements (optional)

- **Authenticated runs with `storageState`:** avoid repeating login in non-auth suites.
- **Trace/video only on failure:** `trace: 'on-first-retry'`, `video: 'retain-on-failure'`, `screenshot: 'only-on-failure'`.
- **Semantic selectors everywhere:** prefer `getByRole` / `getByLabel` / `getByTestId`.
- **Tags & grep:** run subsets fast in CI/local.
- **Parallelism & retries per environment:** tune for speed vs. stability.
