import { test, expect } from '@playwright/test'
import { authenticate } from './utils/authenticate.js'

test.describe('Account page', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/account')
  })

  test('displays account page', async ({ page }) => {
    await expect(page).toHaveURL('/account')
  })
})
