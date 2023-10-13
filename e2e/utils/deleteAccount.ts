import { Page } from '@playwright/test'

export const deleteAccount = async (page: Page) => {
  await page.goto('/home')

  await page.getByRole('button', { name: 'register-test' }).click()
  await page.getByRole('menuitem', { name: '設定' }).click()
  await page.getByRole('button', { name: 'アカウントを削除する' }).click()
  await page.getByRole('button', { name: '削除する' }).click()
  await page.waitForURL('/')
}
