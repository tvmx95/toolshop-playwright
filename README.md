# Toolshop Playwright Automation

UI automation practice project for the [Practice Software Testing](https://practicesoftwaretesting.com) Toolshop website, built with Playwright Test and TypeScript.

## Current Test Coverage

The project currently discovers **9 tests across 2 files**: 8 homepage smoke tests and 1 guest checkout end-to-end test. This count describes test discovery, not a passing browser run.

### Homepage smoke suite

`tests/smoke/homepage.spec.ts` covers:

- Display the Toolshop logo and product listing
- Search for products using three data-driven cases: `pliers`, `screwdriver`, and `Saw`
- Filter products by the **Hand Tools** category
- Filter products by the **Screwdriver** subcategory
- Filter products by the **MightyCraft Hardware** brand
- Filter products by the **Show only eco-friendly products** option and verify the eco badge

The Hand Tools and brand tests check that the filter is selected and a product is visible. The Screwdriver test checks the first product name, and the sustainability test checks the first eco badge; these assertions do not validate every returned product.

### Guest checkout end-to-end test

`tests/e2e/add-product-tocart.spec.ts` covers:

1. Search for **Combination Pliers** and open its product detail page.
2. Add the product to the cart and verify the success message.
3. Verify quantity `1` and price/total `$14.15`, then update quantity to `2` and verify total `$28.30`.
4. Continue as a guest and verify the entered guest information and summary.
5. Fill and verify a Thailand billing address.
6. Select **Cash on Delivery**, check payment, and verify the payment success message.
7. Confirm the order and check the invoice number format (`INV-` followed by digits).

Running this test submits an order on the practice website. Product prices are fixed expectations in the test and may need review when the website data changes.

The suites use Page Object Models to keep locators and reusable actions separate from test assertions.

## Technology

- [Playwright Test](https://playwright.dev/docs/test-intro)
- TypeScript
- Node.js and npm
- Chromium (Desktop Chrome device profile)
- GitHub Actions

## Project Structure

```text
toolshop-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── fixtures/
│   └── home.fixture.ts
├── pages/
│   ├── home.page.ts
│   ├── product.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
├── test-data/
│   ├── search-cases.ts
│   └── guest-checkout.data.ts
├── tests/
│   ├── smoke/
│   │   └── homepage.spec.ts
│   └── e2e/
│       └── add-product-tocart.spec.ts
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
```

- `tests/` contains test scenarios and assertions.
- `pages/` contains Page Object Models, locators, and reusable page actions.
- `fixtures/` provides the homepage fixture, which navigates to `/` and supplies a `HomePage` instance for each smoke test.
- `test-data/` contains search cases, guest information generation, the billing address, and the checkout product name.
- `.github/workflows/` contains the continuous integration workflow.
- `playwright.config.ts` contains the shared Playwright configuration.

## Prerequisites

- Node.js (the CI workflow uses the latest LTS release)
- npm
- Git

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Installation

Clone and enter the repository:

```bash
git clone https://github.com/tvmx95/toolshop-playwright.git
cd toolshop-playwright
```

Install the locked dependencies and the Chromium browser:

```bash
npm ci
npx playwright install chromium
```

Use `npx playwright install --with-deps chromium` on Linux when the required system dependencies are not already installed.

## Running Tests

Run all tests, including guest checkout and order confirmation:

```bash
npx playwright test
```

Run only the homepage smoke suite:

```bash
npx playwright test tests/smoke/homepage.spec.ts
```

Run only the guest checkout test (submits an order):

```bash
npx playwright test tests/e2e/add-product-tocart.spec.ts --project=chromium
```

Useful alternatives:

```bash
# Open the browser window during a smoke run
npx playwright test tests/smoke --headed

# Run in Playwright UI Mode
npx playwright test --ui

# Run with the Playwright Inspector
npx playwright test --debug

# List discovered tests without running them
npx playwright test --list
```

The project configuration sets `headless: true`, so normal runs execute without a browser window. Use `--headed` to see the browser. The project has no npm test scripts; use the Playwright commands above directly.

## Playwright Configuration

| Setting | Current value |
| --- | --- |
| Base URL | `https://practicesoftwaretesting.com` |
| Test directory | `tests` |
| Browser project | Chromium using `Desktop Chrome` |
| Parallel execution | Enabled (`fullyParallel: true`) |
| Headless | Enabled |
| Viewport | `null` (browser window size) |
| Test timeout | 30 seconds |
| Assertion timeout | 5 seconds |
| Local retries | 0 |
| CI retries | 2 |
| Test ID attribute | `data-test` |
| Screenshot | Only on failure |
| Video | Retained on failure |
| Trace | On the first retry |
| Reporters | List and HTML |

The configured base URL allows tests and page objects to navigate with relative paths such as:

```typescript
await page.goto('/');
```

The custom test ID attribute allows Playwright locators such as:

```typescript
page.getByTestId('search-query');
page.getByTestId('product-name');
```

## Locator Strategy

Prefer user-facing and stable locators in this order:

1. Accessible role and name
2. Label or placeholder
3. Stable `data-test` value through `getByTestId()`
4. A short CSS selector when pattern matching is required

Examples from the current Page Object Model:

```typescript
page.getByRole('button', {name: 'Search', exact: true});
page.getByTestId('search-query');
page.locator('a[data-test^="product-"]');
```

Avoid selecting a product by a generated full ID because application data resets may change that value.

## Page Object Model

| Page object | Responsibility |
| --- | --- |
| `HomePage` | Search, open products, and apply homepage filters |
| `ProductPage` | Locate the product heading and add a product to the cart |
| `CartPage` | Open the cart, locate product rows, update quantity, and proceed to checkout |
| `CheckoutPage` | Guest information, billing address, payment checks, and order confirmation |

The smoke suite imports `test` and `expect` from `fixtures/home.fixture.ts`. The checkout suite imports Playwright's standard `test` and creates its page objects explicitly.

Search cases live in `test-data/search-cases.ts`. `createGuestInformation()` generates a new UUID-based email for each checkout test invocation, while the billing address and product name are shared constants. Assertions remain in the test files.

## Reports and Test Artifacts

Open the most recently generated HTML report:

```bash
npx playwright show-report
```

Local runs may generate:

```text
playwright-report/
test-results/
```

Both directories are ignored by Git.

## Continuous Integration

The GitHub Actions workflow runs the Playwright suite for:

- Pushes to `main` or `master`
- Pull requests targeting `main` or `master`

The workflow installs dependencies with `npm ci`, installs Playwright browsers and Linux dependencies, runs only `tests/smoke` in Chromium, and uploads `playwright-report/` as an artifact with a 30-day retention period when the job is not cancelled.

The guest checkout E2E test is not included in the current CI command.

## Coverage Gaps

The current suites do not cover:

- Price filtering
- Negative search and checkout scenarios
- Registered-user checkout or other payment methods
- Firefox or WebKit
- Validation of every product returned by a filter
