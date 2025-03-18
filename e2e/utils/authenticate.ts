import { Page } from '@playwright/test'
import { readFileSync } from 'fs'

export const authenticate = async (page: Page) => {
  // Start from the index page
  await page.goto(`/`)

  // Get the authentication data from the `playwright/.auth/user.json` file
  const auth = JSON.parse(readFileSync('e2e/.auth/user.json', 'utf8'))

  // Set the authentication data in the indexedDB of the page to authenticate the user
  await page.evaluate((auth) => {
    // Open the IndexedDB database
    const indexedDB = window.indexedDB
    const request = indexedDB.open('firebaseLocalStorageDb')

    request.onsuccess = function (event: Event) {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

      // Start a transaction to access the object store (firebaseLocalStorage)
      const transaction = db.transaction(['firebaseLocalStorage'], 'readwrite')
      const objectStore = transaction.objectStore('firebaseLocalStorage')

      // Loop through the localStorage data inside the `playwright/.auth/user.json` and add it to the object store
      const localStorage = auth.origins[0].localStorage

      for (const element of localStorage) {
        const value = element.value

        objectStore.put(JSON.parse(value))
      }
    }
  }, auth)
}
