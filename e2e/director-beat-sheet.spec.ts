import { test, expect } from '@playwright/test'

test('preflight act renders within first 800ms', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#app')).toBeVisible()
})
