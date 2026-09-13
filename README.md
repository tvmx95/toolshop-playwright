# Toolshop Playwright Automation

UI automation practice project for the [Practice Software Testing](https://practicesoftwaretesting.com) Toolshop website, built with Playwright Test and TypeScript.

## Current Test Coverage

The homepage smoke suite currently contains six tests:

- Display the Toolshop logo and product listing
- Search for a product by keyword (`pliers`)
- Filter products by the **Hand Tools** category
- Filter products by the **Screwdriver** subcategory
- Filter products by the **MightyCraft Hardware** brand
- Filter products by the **Show only eco-friendly products** option and verify the eco badge

The suite uses a Page Object Model to keep homepage locators and reusable actions separate from test scenarios.

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
├── pages/
│   └── home.page.ts
├── tests/
│   └── smoke/
│       └── homepage.spec.ts
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
```

- `tests/` contains test scenarios and assertions.
- `pages/` contains Page Object Models, locators, and reusable page actions.
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

Run all tests:

```bash
npx playwright test
```

Run only the homepage smoke suite:

```bash
npx playwright test tests/smoke/homepage.spec.ts
```

Useful alternatives:

```bash
# Run in Playwright UI Mode
npx playwright test --ui

# Run with the Playwright Inspector
npx playwright test --debug

# List discovered tests without running them
npx playwright test --list
```

The project configuration currently sets `headless: false`, so a normal test run opens the browser window. For a headless run, change the `headless` value in `playwright.config.ts` or override the configuration in a dedicated CI config.

## Playwright Configuration

| Setting | Current value |
| --- | --- |
| Base URL | `https://practicesoftwaretesting.com` |
| Test directory | `tests` |
| Browser project | Chromium using `Desktop Chrome` |
| Parallel execution | Enabled |
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

`pages/home.page.ts` owns the homepage locators and reusable actions, including:

- Search by keyword
- Filter by Hand Tools
- Filter by Screwdriver
- Filter by MightyCraft Hardware
- Filter by sustainability

Tests in `tests/smoke/homepage.spec.ts` call these actions and keep the assertions in the test scenarios.

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

The workflow installs dependencies with `npm ci`, installs Playwright browsers and Linux dependencies, runs all tests, and uploads `playwright-report/` as an artifact with a 30-day retention period when the job is not cancelled.

## Planned Improvements

- Add Product Detail coverage
- Add price filtering coverage
- Add reusable test data
- Add negative test scenarios
- Expand cross-browser coverage
