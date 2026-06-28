import { test, expect } from '../fixtures/loggedInPage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

const CREDENTIALS = { username: 'standard_user', password: 'secret_sauce' };
const CONTACT_INFO = { firstName: 'Zus', lastName: 'Picious', postalCode: '122019' };

test.describe('Saucedemo purchase flow', () => {
  test('should log in successfully and land on inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should show an error message when logging in with an invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(CREDENTIALS.username, 'wrong_password');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should add the two cheapest items to the cart, checkout and confirm the order', async ({ loggedInPage: page }) => {
    // --- Select two cheapest items ---
    const inventoryPage = new InventoryPage(page);
    const sortedItems = await inventoryPage.getItemsSortedByPrice();
    const cheapestTwo = sortedItems.slice(0, 2);

    expect(cheapestTwo).toHaveLength(2);

    const expectedNames = cheapestTwo.map((i) => i.name);
    await inventoryPage.addItemsToCart(cheapestTwo);

    // Cart badge should show 2 items
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // --- Cart ---
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);

    const cartPage = new CartPage(page);
    const cartItemNames = await cartPage.getItemNames();
    expect(cartItemNames.sort()).toEqual(expectedNames.sort());

    // --- Checkout step 1: contact info ---
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillContactInfo(
      CONTACT_INFO.firstName,
      CONTACT_INFO.lastName,
      CONTACT_INFO.postalCode
    );

    // --- Checkout step 2: order overview ---
    await expect(page).toHaveURL(/checkout-step-two/);

    // Verify both items appear in the summary
    const summaryItemCount = await checkoutPage.orderSummaryItems.count();
    expect(summaryItemCount).toBe(2);

    // --- Complete the order ---
    await checkoutPage.confirmOrder();

    // --- Confirm order ---
    await expect(page).toHaveURL(/checkout-complete/);

    const confirmationPage = new ConfirmationPage(page);
    await expect(confirmationPage.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(confirmationPage.confirmationMessage).toBeVisible();
  });
});
