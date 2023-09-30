import { test, expect } from '@playwright/test'

test.describe('signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle' })
  })

  test('正しいタイトルがある', async ({ page }) => {
    await expect(page).toHaveTitle(/新規登録/)
  })

  test('VRT', async ({ page }) => {
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('メールアドレスで登録リンクがあり、押下すると登録ページに遷移する', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'メールアドレスで登録' }).click()
    await expect(page).toHaveURL('/signup/with-email')
  })

  test('Googleで登録ボタンがあり、押下するとGoogle認証画面に遷移する', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Googleで登録' }).click()
    await expect(page).toHaveURL(/accounts.google.com/)
  })

  test.skip('Xで登録ボタンがあり、押下するとX認証画面に遷移する', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Xで登録' }).click()
    await expect(page).toHaveURL(/api.twitter.com/)
  })
})
