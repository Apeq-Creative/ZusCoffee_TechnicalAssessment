import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(private page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allInnerTexts();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
