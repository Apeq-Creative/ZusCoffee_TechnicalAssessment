import { Page, Locator } from '@playwright/test';

export interface InventoryItem {
  name: string;
  price: number;
  addToCartButton: Locator;
}

export class InventoryPage {
  readonly cartBadge: Locator;

  constructor(private page: Page) {
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async getItemsSortedByPrice(): Promise<InventoryItem[]> {
    const itemCards = this.page.locator('.inventory_item');
    const count = await itemCards.count();

    const items: InventoryItem[] = [];
    for (let i = 0; i < count; i++) {
      const card = itemCards.nth(i);
      const name = await card.locator('.inventory_item_name').innerText();
      const priceText = await card.locator('.inventory_item_price').innerText();
      const price = parseFloat(priceText.replace('$', ''));
      const addToCartButton = card.locator('button[data-test^="add-to-cart"]');
      items.push({ name, price, addToCartButton });
    }

    return items.sort((a, b) => a.price - b.price);
  }

  async addItemsToCart(items: InventoryItem[]) {
    for (const item of items) {
      await item.addToCartButton.click();
    }
  }

  async goToCart() {
    await this.page.locator('.shopping_cart_link').click();
  }
}
