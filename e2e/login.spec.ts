import { test, expect } from '@playwright/test'

test('visits the app login page and login', async ({ page }) => {
  // Navigate to the target page
  await page.goto('/')

  // Check for the presence of "Hi there! 👋"
  const hiThereText = page.getByText('Hi there! 👋')
  await expect(hiThereText).toBeVisible()

  // Check for the presence of the logo
  const logo = page.getByRole('img', { name: 'HangTime Logo' })
  await expect(logo).toBeVisible()

  // Check for the presence of the "HangTime" text next to the logo
  const hangTimeText = page.getByText('HangTime', { exact: true })
  await expect(hangTimeText).toBeVisible()

  // Check for the "Hangboard Training App" subtitle
  const subtitleText = page.getByText('Hangboard Training App', { exact: true })
  await expect(subtitleText).toBeVisible()

  // Check for the presence of the login buttons
  const googleButton = page.getByRole('button', { name: 'Sign in with Google' })
  await expect(googleButton).toBeVisible()
  await expect(googleButton).toBeEnabled()

  const appleButton = page.getByRole('button', { name: 'Sign in with Apple' })
  await expect(appleButton).toBeVisible()
  await expect(appleButton).toBeEnabled()

  // Check for the presence of the email input field
  const emailInput = page.getByLabel('E-mail', { exact: true })
  await expect(emailInput).toBeVisible()
  await emailInput.fill('mail@stevie-ray.nl')

  // Check for the presence of the password input field
  const passwordInput = page.getByLabel('Password', { exact: true })
  await expect(passwordInput).toBeVisible()
  await passwordInput.fill('8Ty>g{Q"F!#4')

  // Check for the presence of the login button
  const loginButton = page.getByRole('button', { name: 'Login' })
  await expect(loginButton).toBeEnabled()
  await loginButton.click()

  // Check if the workout link is visible
  const workoutLink = page.getByRole('link', { name: 'Workouts' })
  await expect(workoutLink).toBeVisible({ timeout: 5000 }) // Wait for 5 seconds
  await expect(workoutLink).toBeEnabled()

  // Click the account link is visible
  const accountLink = page.getByRole('link', { name: 'Account' })
  await expect(accountLink).toBeVisible()
  await expect(accountLink).toBeEnabled()
})
