import { Page, Locator } from '@playwright/test';

export class ConfirmationPage {
  readonly confirmationHeader: Locator;
  readonly confirmationMessage: Locator;

  constructor(private page: Page) {
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationMessage = page.locator('[data-test="complete-text"]');
  }
}
