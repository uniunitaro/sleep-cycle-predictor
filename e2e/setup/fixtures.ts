import fs from 'fs'
import path from 'path'
import { test as baseTest } from '@playwright/test'

export * from '@playwright/test'
export const authedTest = baseTest.extend<
  object,
  { workerStorageState: string }
>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const index = authedTest.info().parallelIndex
      const id = process.env.CI
        ? process.env.AUTH_ID!
        : `e2e-${index + 1}@example.com`
      const fileName = path.resolve(
        authedTest.info().project.outputDir,
        `.auth/${id}.json`
      )

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName)
        return
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined })

      // Perform authentication steps. Replace these actions with your own
      const baseURL =
        process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'
      await page.goto(baseURL + '/signin')
      await page.getByLabel('メールアドレス').fill(id)
      await page.getByLabel('パスワード', { exact: true }).fill('pass0000')
      await page
        .getByRole('button', { name: 'メールアドレスでログイン' })
        .click()
      // Wait until the page receives the cookies.
      //
      // Sometimes login flow sets cookies in the process of several redirects.
      // Wait for the final URL to ensure that the cookies are actually set.
      await page.waitForURL(baseURL + '/home')

      // End of authentication steps.

      await page.context().storageState({ path: fileName })
      await page.close()
      await use(fileName)
    },
    { scope: 'worker' },
  ],
})
