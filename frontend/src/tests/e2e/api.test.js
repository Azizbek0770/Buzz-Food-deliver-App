import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button[type="submit"]');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/**', route => route.abort('failed'));
    
    await page.click('.restaurant-card:first-child');
    await expect(page.locator('text=Serverga ulanishda xatolik')).toBeVisible();
  });

  test('should retry failed requests', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/restaurants', route => {
      requestCount++;
      if (requestCount === 1) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await page.goto('http://localhost:3000');
    await expect(page.locator('.restaurant-card')).toBeVisible();
  });

  test('should handle authentication errors', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:3000/profile');
    await expect(page.locator('text=Avtorizatsiyadan o'ting')).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    await page.click('text=Tahrirlash');
    
    await page.fill('input[name="phone"]', 'invalid');
    await page.click('text=Saqlash');
    
    await expect(page.locator('text=Telefon raqam noto'g'ri')).toBeVisible();
  });

  test('should handle real-time updates', async ({ page }) => {
    await page.goto('http://localhost:3000/orders');
    
    // Simulate WebSocket message
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('order-update', {
        detail: { orderId: '123', status: 'preparing' }
      }));
    });
    
    await expect(page.locator('text=Tayyorlanmoqda')).toBeVisible();
  });

  test('should handle file uploads', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    
    // Upload profile picture
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-content')
    });
    
    await expect(page.locator('.profile-image')).toBeVisible();
  });

  test('should handle offline mode', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Go offline
    await page.context().setOffline(true);
    
    await page.click('.restaurant-card:first-child');
    await expect(page.locator('text=Offline rejimda')).toBeVisible();
    
    // Go online
    await page.context().setOffline(false);
    await expect(page.locator('.menu-items')).toBeVisible();
  });
}); 