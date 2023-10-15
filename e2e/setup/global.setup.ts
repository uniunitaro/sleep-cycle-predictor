import { test as setup } from '@playwright/test'
import { setupDatabase } from './setupDatabase'

setup('setup', async () => {
  if (process.env.CI) return

  await setupDatabase()
})
