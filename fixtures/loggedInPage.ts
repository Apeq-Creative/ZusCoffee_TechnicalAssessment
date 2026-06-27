import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const CREDENTIALS = { username: 'standard_user', password: 'secret_sauce' };

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
    await page.waitForURL(/inventory/, { timeout: 10_000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';
