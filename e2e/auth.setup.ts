import { test as setup, expect } from '@playwright/test'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const authFile = path.join(__dirname, '../e2e/.auth/user.json')

// This file handles authentication state management for E2E tests
setup('authenticate', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/')

  // Fill in login credentials
  const emailInput = page.getByLabel('E-mail', { exact: true })
  await emailInput.fill(process.env.VITE_E2E_TEST_EMAIL || '')

  const passwordInput = page.getByLabel('Password', { exact: true })
  await passwordInput.fill(process.env.VITE_E2E_TEST_PASSWORD || '')

  // Click login button
  const loginButton = page.getByRole('button', { name: 'Login' })
  await loginButton.click()

  // Wait for successful login
  const workoutLink = page.getByRole('link', { name: 'Workouts' })
  await expect(workoutLink).toBeVisible({ timeout: 10000 })

  // Copy the data in IndexedDB to the local storage
  await page.evaluate(() => {
    // Open the IndexedDB database
    const indexedDB = window.indexedDB
    const request = indexedDB.open('firebaseLocalStorageDb')

    request.onsuccess = function (event: Event) {
      // Cast event.target to IDBOpenDBRequest to access the result property
      const db = (event.target as IDBOpenDBRequest).result

      // Open a transaction to access the firebaseLocalStorage object store
      const transaction = db.transaction(['firebaseLocalStorage'], 'readonly')
      const objectStore = transaction.objectStore('firebaseLocalStorage')

      // Get all keys and values from the object store
      const getAllKeysRequest = objectStore.getAllKeys()
      const getAllValuesRequest = objectStore.getAll()

      getAllKeysRequest.onsuccess = function (event: Event) {
        const keys = (event.target as IDBRequest).result
        getAllValuesRequest.onsuccess = function (event: Event) {
          const values = (event.target as IDBRequest).result

          // Copy keys and values to localStorage
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = values[i]
            localStorage.setItem(key, JSON.stringify(value))
          }
        }
      }
    }

    request.onerror = function (event: Event) {
      console.error('Error opening IndexedDB database:', (event.target as IDBOpenDBRequest).error)
    }
  })

  // Store the authentication state
  await page.context().storageState({ path: authFile })
})
