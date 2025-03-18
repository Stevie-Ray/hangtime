import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays welcome message and logo', async ({ page }) => {
    const hiThereText = page.getByText('Hi there! 👋')
    await expect(hiThereText).toBeVisible()

    const logo = page.getByRole('img', { name: 'HangTime Logo' })
    await expect(logo).toBeVisible()

    const hangTimeText = page.getByText('HangTime', { exact: true })
    await expect(hangTimeText).toBeVisible()

    const subtitleText = page.getByText('Hangboard Training App', { exact: true })
    await expect(subtitleText).toBeVisible()
  })

  test('displays social login buttons', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: 'Sign in with Google' })
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()

    const appleButton = page.getByRole('button', { name: 'Sign in with Apple' })
    await expect(appleButton).toBeVisible()
    await expect(appleButton).toBeEnabled()
  })

  test('displays login form elements', async ({ page }) => {
    const emailInput = page.getByLabel('E-mail', { exact: true })
    await expect(emailInput).toBeVisible()

    const passwordInput = page.getByLabel('Password', { exact: true })
    await expect(passwordInput).toBeVisible()

    const loginButton = page.getByRole('button', { name: 'Login' })
    await expect(loginButton).toBeEnabled()
  })

  test('successfully logs in with email and password', async ({ page }) => {
    const emailInput = page.getByLabel('E-mail', { exact: true })
    await emailInput.fill('mail@stevie-ray.nl')

    const passwordInput = page.getByLabel('Password', { exact: true })
    await passwordInput.fill('8Ty>g{Q"F!#4')

    const loginButton = page.getByRole('button', { name: 'Login' })
    await loginButton.click()

    // Check if the workout link is visible after login
    const workoutLink = page.getByRole('link', { name: 'Workouts' })
    await expect(workoutLink).toBeVisible({ timeout: 5000 })

    // Check if the account link is visible after login
    const accountLink = page.getByRole('link', { name: 'Account' })
    await expect(accountLink).toBeVisible()
  })
})
