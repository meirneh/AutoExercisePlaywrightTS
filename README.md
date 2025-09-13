# AutomationExercise Playwright (TypeScript)

End-to-end **UI & API** test suite built with **Playwright + TypeScript**, using a **Page Object Model (POM)**, a **unified global fixture** (UI + API utilities), shared **helpers**, and **data-test** files.

## Features

- ✅ UI tests with POM (clean, maintainable locators and actions)
- ✅ API tests for products and users (positive + negative flows)
- ✅ Unified fixture that injects POMs and exposes reusable API tools
- ✅ Shared helpers for robust parsing and form-urlencoded bodies
- ✅ Data-test files centralizing endpoints, payloads, messages, and expected codes
- ✅ Consistent assertions and project layout

---

## Tech Stack

- [Playwright](https://playwright.dev/) + TypeScript
- Node.js 18+
- VS Code (recommended)

---

## Project Structure

```
.
├─ pages/                              # Page Objects (POM) for UI tests
│  └─ ...                              # e.g., HeaderFooterPage, ProductsPage, etc.
│
├─ tests/
│  ├─ api-tests/
│  │  ├─ products-api-test.spec.ts
│  │  ├─ user-api-test.spec.ts
│  │  └─ user-negative-api-test.spec.ts
│  └─ ui-tests/
│     ├─ auth-test.spec.ts
│     ├─ cart-checkout-test.spec.ts
│     ├─ contact-us-test.spec.ts
│     ├─ product-test.spec.ts
│     └─ scroll-subscription-test.spec.ts
│
├─ utils/
│  ├─ data-test/
│  │  ├─ addresses.ts
│  │  ├─ auth.ts
│  │  ├─ cards.ts
│  │  ├─ cartCheckout.ts
│  │  ├─ contactUs.ts
│  │  ├─ product.ts
│  │  ├─ products-api.ts              # ProductsApiData (endpoints, expected, messages)
│  │  ├─ scroll-subscription.ts
│  │  ├─ users-api.ts                 # UsersApiData + payload builders + expected codes/messages
│  │  └─ users.ts
│  ├─ fixtures/
│  │  └─ fixtures.ts                  # Unified fixture (UI POMs + API tools)
│  └─ helpers/
│     ├─ apiHelpers.ts                # parse(), FORM_URLENCODED_HEADER, toFormUrlEncoded()
│     ├─ consent.ts
│     ├─ navigation.ts
│     └─ subscriptions.ts
│
├─ playwright.config.ts
├─ package.json
└─ README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- (Optional) VS Code and the “Playwright Test for VS Code” extension

### Install
```bash
git clone https://github.com/meirneh/AutoExercisePlaywrightTS.git
cd AutoExercisePlaywrightTS
npm install
npx playwright install
```

### Base URL (optional)
Specs can read `process.env.BASE_URL`; by default they target `https://automationexercise.com/`.

```bash
# Windows CMD
set BASE_URL=https://automationexercise.com/
# PowerShell
$env:BASE_URL="https://automationexercise.com/"
# macOS/Linux
export BASE_URL=https://automationexercise.com/
```

---

## Running Tests

### All tests (UI + API)
```bash
npx playwright test
```

### Only UI tests
```bash
npx playwright test tests/ui-tests
# headed
npx playwright test tests/ui-tests --headed
```

### Only API tests
```bash
npx playwright test tests/api-tests
# single API spec
npx playwright test tests/api-tests/user-api-test.spec.ts
```

### Filter by title / show report
```bash
npx playwright test -g "TC - 01"
npx playwright show-report
```

---

## Unified Fixture

`utils/fixtures/fixtures.ts` extends Playwright’s `test` to provide:

- **UI POMs** (e.g., `headerFooterPage`, `productsPage`, …)
- **API tools** (`api.createUser()`, `api.loginUser()`, `api.getUserByEmail()`, `api.deleteUser()`)

Import `test/expect` from the fixture in all specs (UI and API) for consistency:

```ts
import { test, expect } from "../../utils/fixtures/fixtures";
```

**UI example**
```ts
test("Search product from header", async ({ headerFooterPage, productsPage }) => {
  await headerFooterPage.goToProductsPage();
  await productsPage.searchProduct("dress");
  await expect(productsPage.results).toBeVisible();
});
```

**API example (using fixture `api`)**
```ts
import { UsersApiData } from "../../utils/data-test/users-api";
import { test, expect } from "../../utils/fixtures/fixtures";

test("Create user and verify login", async ({ api }) => {
  const { res, json } = await api.createUser();
  expect(res.status()).toBe(UsersApiData.expected.httpOk);
  expect(json.responseCode).toBe(UsersApiData.expected.responseCodes.created);

  const login = await api.loginUser();
  expect(login.json.message).toBe(UsersApiData.messages.userExists);
});
```

---

## API Helpers

`utils/helpers/apiHelpers.ts` centralizes common API utilities:

- `parse(res)` — safely parses responses (even when the server wraps JSON in HTML)
- `FORM_URLENCODED_HEADER` — standard header for `x-www-form-urlencoded`
- `toFormUrlEncoded(obj)` — builds `x-www-form-urlencoded` bodies

```ts
import { parse, FORM_URLENCODED_HEADER, toFormUrlEncoded } from "../../utils/helpers/apiHelpers";
import { ProductsApiData } from "../../utils/data-test/products-api";

const res = await request.post(ProductsApiData.endpoints.search, {
  headers: FORM_URLENCODED_HEADER,
  data: toFormUrlEncoded({ search_product: "dress" }),
});
const json = await parse(res);
expect(json.products.length).toBeGreaterThan(0);
```

---

## Data-Test Files

- Centralize **endpoints**, **payload builders**, **expected status codes**, and **messages** for cleaner specs without “magic strings/numbers”.

Examples:
- `utils/data-test/users-api.ts` → endpoints for user CRUD + payload builders + expected codes/messages  
- `utils/data-test/products-api.ts` → endpoints/messages/expected for products

---

## Conventions

- Test titles prefixed with `TC - XX` for traceability.
- Prefer Playwright’s recommended locators in UI: `getByRole`, `getByLabel`, `getByTestId`.
- DRY first: reuse helpers/fixtures and data-test files instead of in-spec duplication.
- Keep assertions readable (e.g., named expectations and `objectContaining` for shape checks).

---

## Roadmap (optional)

- Add `ensureCleanup()` in the fixture to auto-delete accounts if a test fails before teardown.
- Strong typing for API responses (`type User`, `type Product`) or JSON schema validation.
- CI workflow (GitHub Actions) with artifacts (HTML report, traces, videos on failure).
