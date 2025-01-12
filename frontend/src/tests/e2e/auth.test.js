import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should register a new user', async ({ page }) => {
    await page.click('text=Ro'yxatdan o'tish');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+998901234567');
    await page.fill('input[name="password"]', 'Test@123');
    await page.fill('input[name="confirmPassword"]', 'Test@123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/login');
  });

  test('should login user', async ({ page }) => {
    await page.click('text=Kirish');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('text=Ro'yxatdan o'tish');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Ism kiritilishi shart')).toBeVisible();
    await expect(page.locator('text=Email kiritilishi shart')).toBeVisible();
    await expect(page.locator('text=Parol kiritilishi shart')).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // Login first
    await page.click('text=Kirish');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button[type="submit"]');
    
    // Then logout
    await page.click('text=Test User');
    await page.click('text=Chiqish');
    
    await expect(page.locator('text=Kirish')).toBeVisible();
  });
}); 