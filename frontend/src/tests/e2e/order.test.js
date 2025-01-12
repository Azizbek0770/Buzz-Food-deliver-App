import { test, expect } from '@playwright/test';

test.describe('Order flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button[type="submit"]');
  });

  test('should add items to cart', async ({ page }) => {
    // Go to restaurant page
    await page.click('.restaurant-card:first-child');
    
    // Add items to cart
    await page.click('text=Savatga qo'shish');
    await page.click('text=Savatga qo'shish');
    
    // Check cart badge
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toHaveText('2');
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Go to restaurant page
    await page.click('.restaurant-card:first-child');
    
    // Add item to cart
    await page.click('text=Savatga qo'shish');
    
    // Increase quantity
    await page.click('text=+');
    
    // Check quantity
    const quantity = page.locator('.quantity-text');
    await expect(quantity).toHaveText('2');
    
    // Decrease quantity
    await page.click('text=-');
    await expect(quantity).toHaveText('1');
  });

  test('should place order', async ({ page }) => {
    // Go to restaurant page
    await page.click('.restaurant-card:first-child');
    
    // Add items to cart
    await page.click('text=Savatga qo'shish');
    
    // Go to cart
    await page.click('text=Savatcha');
    
    // Fill delivery details
    await page.fill('input[name="address"]', 'Test Address');
    await page.fill('input[name="phone"]', '+998901234567');
    
    // Place order
    await page.click('text=Buyurtma berish');
    
    // Check success message
    await expect(page.locator('text=Buyurtmangiz qabul qilindi')).toBeVisible();
  });

  test('should show order in history', async ({ page }) => {
    // Go to profile
    await page.click('text=Test User');
    await page.click('text=Profil');
    
    // Check last order
    const lastOrder = page.locator('.order-item').first();
    await expect(lastOrder).toContainText('Kutilmoqda');
  });

  test('should show validation errors on empty fields', async ({ page }) => {
    // Go to restaurant page
    await page.click('.restaurant-card:first-child');
    
    // Add items to cart
    await page.click('text=Savatga qo'shish');
    
    // Go to cart
    await page.click('text=Savatcha');
    
    // Try to place order without filling details
    await page.click('text=Buyurtma berish');
    
    // Check validation errors
    await expect(page.locator('text=Manzil kiritilishi shart')).toBeVisible();
    await expect(page.locator('text=Telefon raqam kiritilishi shart')).toBeVisible();
  });

  test('should show minimum order amount warning', async ({ page }) => {
    // Go to restaurant page
    await page.click('.restaurant-card:first-child');
    
    // Add cheap item to cart
    await page.click('text=Savatga qo'shish');
    
    // Go to cart
    await page.click('text=Savatcha');
    
    // Try to place order
    await page.click('text=Buyurtma berish');
    
    // Check warning message
    await expect(page.locator('text=Minimal buyurtma miqdori')).toBeVisible();
  });
}); 