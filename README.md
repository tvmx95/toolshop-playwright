# Toolshop Playwright Automation

UI automation practice project for the [Practice Software Testing](https://practicesoftwaretesting.com) Toolshop website, built with Playwright Test and TypeScript.

## Current Test Coverage

The project currently discovers **15 tests across 6 files**, including the authentication setup: 8 homepage smoke tests, 2 login smoke tests, 1 account test, 2 cookie isolation tests, 1 guest checkout E2E test, and 1 authentication setup. Verified with `npx playwright test --list`; discovery does not mean a passing browser run.

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
7. Confirm the order, check the invoice number format (`INV-` followed by digits), extract the number, and print it to the test output.

Running this test submits an order on the practice website. Product prices are fixed expectations in the test and may need review when the website data changes.

The homepage and checkout suites use Page Object Models to keep locators and reusable actions separate from test assertions. The login, account, and isolation examples use Playwright fixtures directly.

### Login and saved authentication

- `tests/smoke/login.spec.ts` checks the login form and customer login navigation to `/account`.
- `tests/auth.setup.ts` logs in with the documented demo customer account and saves browser state to `playwright/.auth/customer.json`.
- `tests/smoke/account.spec.ts` loads that state through the `chromium-auth` project, opens `/account`, checks its URL, and checks that the login form is absent. It does not yet verify the customer's identity or account details.
- `chromium-auth` depends on `setup`, so setup must pass before the account test starts. Each test still receives a new browser context; loading state does not submit another login request.

The authentication state file is ignored by Git and must not be committed. Tests using the same saved state share the backend account even though their browser contexts are isolated.

### Fixture lifecycle and isolation exercises

The `homePage` fixture logs setup before `await use(...)` and teardown after it. It creates a new `HomePage` for each test that requests the fixture; built-in fixtures close the test's page and context.

`tests/isolation/context.spec.ts` contains two learning examples. Each starts without the named demo cookie, adds its own value, and verifies that value without manually clearing cookies between tests. These exercise cookie isolation with one or multiple workers, not backend isolation.

### Latest learning-session evidence

User-reported local results:

- Homepage and login smoke: **10 passed using 2 workers (12.8s)**.
- Authentication setup and account test: **2 passed (8.5s)**.
- Cookie isolation: **2 passed using 1 worker (1.3s)** and **2 passed using 2 workers (1.0s)**.

An earlier 2-worker smoke run had 3 failures (screwdriver search, Saw search, and sustainability). Subsequent focused and full runs passed without a fix; the cause remains unconfirmed. The latest passing result does not establish that the intermittent failure is resolved.

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
│   ├── auth.setup.ts
│   ├── isolation/
│   │   └── context.spec.ts
│   ├── smoke/
│   │   ├── homepage.spec.ts
│   │   ├── login.spec.ts
│   │   └── account.spec.ts
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
- `fixtures/` provides the homepage fixture, which navigates to `/` and supplies a `HomePage` instance for each test that requests it.
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

Run the homepage and login smoke tests with two workers:

```bash
npx playwright test tests/smoke --project=chromium --workers=2 --retries=0
```

Run only the homepage smoke suite:

```bash
npx playwright test tests/smoke/homepage.spec.ts --project=chromium
```

Run only the guest checkout test (submits an order):

```bash
npx playwright test tests/e2e/add-product-tocart.spec.ts --project=chromium --workers=1 --retries=0
```

Run authentication setup and the account test in dependency order:

```bash
npx playwright test --project=chromium-auth --workers=1 --retries=0
```

Run setup alone to regenerate saved state:

```bash
npx playwright test --project=setup --workers=1 --retries=0
```

Run the cookie isolation exercises:

```bash
npx playwright test tests/isolation/context.spec.ts --project=chromium --workers=1 --retries=0
npx playwright test tests/isolation/context.spec.ts --project=chromium --workers=2 --retries=0
```

The `chromium` project excludes `account.spec.ts`. Use `chromium-auth` for that test so its saved state is prepared automatically.

Useful alternatives:

```bash
# Open the browser window during a smoke run
npx playwright test tests/smoke --project=chromium --headed

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
| Projects | `setup`, `chromium`, `chromium-auth` (Desktop Chrome) |
| Parallel execution | Enabled (`fullyParallel: true`) |
| Headless | Enabled |
| Viewport | 1440 × 900 |
| Test timeout | 30 seconds |
| Assertion timeout | 5 seconds |
| Local retries | 0 |
| CI retries | 2 |
| Test ID attribute | `data-test` |
| Screenshot | Only on failure |
| Video | Retained on failure |
| Trace | `retain-on-failure` (record each attempt, retain failed attempts) |
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

The homepage smoke suite imports `test` and `expect` from `fixtures/home.fixture.ts`. The checkout suite imports Playwright's standard `test` and creates its page objects explicitly.

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

With `trace: 'retain-on-failure'`, passing attempts' traces are discarded. To retain traces for both passing and failing tests during an investigation:

```bash
npx playwright test tests/smoke --project=chromium --workers=2 --retries=0 --trace=on
```

Open a test's trace attachment in the HTML report to inspect actions, assertions, DOM snapshots, and network requests. The output directory is cleaned at the start of a run; copy evidence you need to keep before rerunning. Trace recording adds runtime and storage overhead.

## Continuous Integration

The GitHub Actions workflow runs the Playwright suite for:

- Pushes to `main` or `master`
- Pull requests targeting `main` or `master`

The workflow installs dependencies with `npm ci`, installs Playwright browsers and Linux dependencies, runs only `tests/smoke` in Chromium, and uploads `playwright-report/` as an artifact with a 30-day retention period when the job is not cancelled.

The guest checkout E2E test, cookie isolation exercises, authentication setup, and account test are not included in the current CI command. Local verification does not establish that the updated suite has passed on the CI host.

## Coverage Gaps

The current suites do not cover:

- Customer identity and account-content assertions after loading saved authentication
- A verified setup/cleanup strategy for state-changing checkout tests; logging an invoice number does not remove the invoice or restore stock
- A confirmed cause or fix for the intermittent smoke failures noted above
- Price filtering
- Negative search and checkout scenarios
- Registered-user checkout or other payment methods
- Firefox or WebKit
- Validation of every product returned by a filter
