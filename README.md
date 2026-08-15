# Toolshop Playwright Automation

Automated UI testing practice project for the [Practice Software Testing](https://practicesoftwaretesting.com) website using Playwright and TypeScript.

## Project Status

This project is currently under development.

Current coverage:

- Open the Toolshop homepage
- Verify that the homepage is displayed
- Verify that the product listing contains products
- Page Object Model for the homepage is being developed

## Technology

- Playwright Test
- TypeScript
- Node.js
- Chromium
- GitHub Actions

## Project Structure

```text
toolshop-playwright/
├── pages/
│   └── home.page.ts
├── tests/
│   └── smoke/
│       └── homepage.spec.ts
├── .github/
│   └── workflows/
│       └── playwright.yml
├── playwright.config.ts
├── package.json
└── package-lock.json
```

### Folder Responsibilities

- `tests/` contains test scenarios and assertions.
- `pages/` contains Page Object Models, locators, and reusable page actions.
- `.github/workflows/` contains the GitHub Actions configuration.
- `playwright.config.ts` contains the global Playwright configuration.

## Prerequisites

Install the following software:

- Node.js
- npm
- Git

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/tvmx95/toolshop-playwright.git
```

Enter the project directory:

```bash
cd toolshop-playwright
```

Install project dependencies:

```bash
npm install
```

Install the Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run the homepage Smoke Test:

```bash
npx playwright test tests/smoke/homepage.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests in UI Mode:

```bash
npx playwright test --ui
```

Run tests in debug mode:

```bash
npx playwright test --debug
```

List all discovered tests without running them:

```bash
npx playwright test --list
```

## Test Configuration

The project is configured with:

- Base URL: `https://practicesoftwaretesting.com`
- Browser: Chromium
- Test directory: `tests`
- Test timeout: 30 seconds
- Assertion timeout: 5 seconds
- Test ID attribute: `data-test`
- Screenshot: Captured on failure
- Video: Retained on failure
- Trace: Captured on the first retry

Because the website uses `data-test`, elements can be located with:

```typescript
page.getByTestId('search-query');
page.getByTestId('product-name');
```

## Locator Strategy

Preferred locator order:

1. Accessible role

```typescript
page.getByRole('button', {name: 'Search'});
```

2. Label or placeholder

```typescript
page.getByRole('textbox', {name: 'Search'});
```

3. Stable Test ID

```typescript
page.getByTestId('product-name');
```

4. Short CSS selector when pattern matching is required

```typescript
page.locator(
  'a[data-test^="product-"][href^="/product/"]'
);
```

Avoid generated Product IDs such as:

```typescript
page.locator(
  '[data-test="product-01M02H8TN0YEXC0TDY9VXTT9FW"]'
);
```

The ID may change when the application data is reset.

## Page Object Model

Page Object Models keep locators and page actions separate from test scenarios.

Example:

```typescript
import {type Locator, type Page} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards = page.locator(
      'a[data-test^="product-"][href^="/product/"]'
    );

    this.productNames = page.getByTestId('product-name');

    this.searchInput = page.getByRole('textbox', {
      name: 'Search',
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }
}
```

## Test Reports

After running the tests, open the HTML report with:

```bash
npx playwright show-report
```

Test artifacts may be generated in:

```text
playwright-report/
test-results/
```

These directories should not be committed to Git.

## Continuous Integration

GitHub Actions runs the Playwright tests when code is:

- Pushed to `main` or `master`
- Submitted through a Pull Request to `main` or `master`

The HTML report is uploaded as a GitHub Actions artifact when the workflow finishes.

## Planned Improvements

- Complete the Homepage Page Object Model
- Add Search Product coverage
- Add Product Detail coverage
- Add category and price filtering coverage
- Add reusable test data
- Add negative test scenarios
- Expand cross-browser coverage

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Page Object Models](https://playwright.dev/docs/pom)
- [Running Playwright Tests](https://playwright.dev/docs/running-tests)