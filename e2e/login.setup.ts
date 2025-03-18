import { test as setup, expect } from '@playwright/test'

// This file verifies login page elements before authentication
setup('verify login page', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/')

  // Verify welcome message and logo
  const hiThereText = page.getByText('Hi there! 👋')
  await expect(hiThereText).toBeVisible()

  const logo = page.getByRole('img', { name: 'HangTime Logo' })
  await expect(logo).toBeVisible()

  const hangTimeText = page.getByText('HangTime', { exact: true })
  await expect(hangTimeText).toBeVisible()

  const subtitleText = page.getByText('Hangboard Training App', { exact: true })
  await expect(subtitleText).toBeVisible()

  // Verify social login buttons
  const googleButton = page.getByRole('button', { name: 'Sign in with Google' })
  await expect(googleButton).toBeVisible()
  await expect(googleButton).toBeEnabled()

  const appleButton = page.getByRole('button', { name: 'Sign in with Apple' })
  await expect(appleButton).toBeVisible()
  await expect(appleButton).toBeEnabled()

  // Verify login form elements
  const emailInput = page.getByLabel('E-mail', { exact: true })
  await expect(emailInput).toBeVisible()

  const passwordInput = page.getByLabel('Password', { exact: true })
  await expect(passwordInput).toBeVisible()

  const loginButton = page.getByRole('button', { name: 'Login' })
  await expect(loginButton).toBeEnabled()
})
