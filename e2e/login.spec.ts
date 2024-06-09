import { test, expect } from '@playwright/test'

test('visits the app login page and login', async ({ page }) => {
  // Navigate to the target page
  await page.goto('/')

  // Check for the presence of "Hi there! 👋"
  const hiThereText = page.locator('div.text-h5')
  await expect(hiThereText).toHaveText('Hi there! 👋')

  // Check for the presence of the logo
  const logo = page.locator('img.logo')
  await expect(logo).toBeVisible()

  // Check for the presence of the "HangTime" text
  const hangTimeText = page.locator('h2.text-h4')
  await expect(hangTimeText).toHaveText('HangTime')

  // Check for the "Hangboard Training App" subtitle
  const subtitleText = page.locator('h1.text-subtitle-2')
  await expect(subtitleText).toHaveText('Hangboard Training App')

  // Check for the presence of the login buttons
  const facebookButton = page.locator('button:has-text("Sign in with Facebook")')
  const googleButton = page.locator('button:has-text("Sign in with Google")')
  const appleButton = page.locator('button:has-text("Sign in with Apple")')
  await expect(facebookButton).toBeVisible()
  await expect(googleButton).toBeVisible()
  await expect(appleButton).toBeVisible()

  // Check for the presence of the email input field
  const emailInput = page.getByLabel('E-mail', { exact: true })
  await expect(emailInput).toBeVisible()

  // Check for the presence of the password input field
  const passwordInput = page.getByLabel('Password', { exact: true })
  await expect(passwordInput).toBeVisible()

  // Check for the presence of the login button
  const loginButton = page.getByRole('button', { name: 'Login' })
  await expect(loginButton).toBeVisible()
  await expect(loginButton).toBeEnabled()

  // Perform login with dummy account
  await emailInput.fill('mail@stevie-ray.nl')
  await passwordInput.fill('8Ty>g{Q"F!#4')
  await loginButton.click()

  // Check if login was successful
  const workoutTab = page.getByText('My Workouts')
  await expect(workoutTab).toBeVisible()
})
