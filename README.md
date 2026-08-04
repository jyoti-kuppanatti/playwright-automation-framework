# Playwright Automation Framework (TypeScript)

A UI test automation framework built with **Playwright** and **TypeScript**, following the **Page Object Model (POM)** design pattern, with **CI/CD integration via GitHub Actions**.

## Tech Stack
- **Playwright** — end-to-end browser automation
- **TypeScript** — test and framework code
- **Page Object Model (POM)** — for maintainable, reusable page abstractions
- **GitHub Actions** — automated test execution on every push/PR

## Features
- Clean separation of test logic and page interactions via POM
- Automated pipeline runs tests on each commit through GitHub Actions
- Scalable structure for adding new pages, specs, and test suites

## Coming Soon
- AI-assisted testing enhancements (test generation, maintenance, and debugging support)

## Folder Structure
```
playwrightWithJavaScript/
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI pipeline — runs tests on push/PR
├── config/
│   └── env.ts                  # Environment configuration
├── docs/
│   └── test-scenarios-pim.md   # QA test case scenarios (PIM module)
├── fixtures/
│   └── baseFixture.ts          # Custom Playwright fixtures
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── AddEmployeePage.ts
│   ├── EmployeeListPage.ts
│   └── PersonalDetailsPage.ts
├── test-data/
│   ├── models/
│   │   └── User.ts             # Type definitions for test data
│   └── users.json              # Test data fixtures
├── tests/
│   ├── api/
│   │   └── loginApi.spec.ts    # API tests
│   ├── pim/
│   │   ├── addEmployee.spec.ts
│   │   └── searchEmployee.spec.ts
│   └── login.spec.ts
├── .env.example                 # Sample environment variables
├── .env.qa                      # QA environment variables
├── playwright.config.ts         # Playwright configuration
└── package.json
```

## Getting Started
```bash
npm install
npx playwright test
```

---
*This repository is a work in progress and will be updated with more details, test coverage, and AI-assisted testing capabilities.*
