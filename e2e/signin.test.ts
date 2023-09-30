import { test, expect } from '@playwright/test'

test.describe('signin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'networkidle' })
  })

  test('正しいタイトルがある', async ({ page }) => {
    await expect(page).toHaveTitle(/ログイン/)
  })

  test('VRT', async ({ page }) => {
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('誤ったメールアドレス、パスワードを入力するとエラーが出る', async ({
    page,
  }) => {
    await page.getByLabel('メールアドレス').fill('invalid-user@example.com')
    await page.getByLabel('パスワード', { exact: true }).fill('pass0000')
    await page.getByRole('button', { name: 'メールアドレスでログイン' }).click()
    await expect(
      page.getByText('メールアドレスまたはパスワードが間違っています')
    ).toBeVisible()
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('正常にログインができる', async ({ page }) => {
    await page.getByLabel('メールアドレス').fill('e2e-read-only@example.com')
    await page.getByLabel('パスワード', { exact: true }).fill('pass0000')
    await page.getByRole('button', { name: 'メールアドレスでログイン' }).click()
    await expect(page).toHaveURL('/home')
  })

  test('Googleでログインボタンがあり、押下するとGoogle認証画面に遷移する', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Googleでログイン' }).click()
    await expect(page).toHaveURL(/accounts.google.com/)
  })

  test.skip('Xでログインボタンがあり、押下するとX認証画面に遷移する', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Xでログイン' }).click()
    await expect(page).toHaveURL(/api.twitter.com/)
  })
})
