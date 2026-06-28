# ZusCoffee Technical Assessment — Playwright E2E Tests

Purpose
- End-to-end Playwright tests for Saucedemo verifying login, error handling, and a purchase flow that adds the two cheapest items and completes checkout.

Prerequisites
- Node.js >= 18
- npm (comes with Node)

Install
```bash
npm ci
npx playwright install chromium
```

Run tests
- Headless (default):
```bash
npm test
```
- Headed (visible browser):
```bash
npm run test:headed
```
- Run a single spec file:
```bash
npx playwright test tests/purchase-flow.spec.ts
```

View report
```bash
npm run test:report
```

Notes
- The purchase test selects the two cheapest items at runtime (no fixed product names).
- Test credentials used in fixtures: username `standard_user`, password `secret_sauce`.
 - Recordings and test artifacts are saved in the `test-results/` folder.
