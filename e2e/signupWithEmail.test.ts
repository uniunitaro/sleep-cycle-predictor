import { test, expect } from '@playwright/test'
import { deleteAccount } from './utils/deleteAccount'

test.describe('signup/with-email', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/with-email', { waitUntil: 'networkidle' })
  })

  test('正しいタイトルがある', async ({ page }) => {
    await expect(page).toHaveTitle(/新規登録/)
  })

  test('妥当でないニックネーム、メールアドレス、パスワードのときにエラーが出る', async ({
    page,
  }) => {
    await page.getByRole('button', { name: '登録する' }).click()

    await page.getByText('ニックネームを入力してください').waitFor()
    await page.getByText('メールアドレスの形式が正しくありません').waitFor()
    await page.getByText('パスワードは8文字以上で入力してください').waitFor()
    await expect.soft(page).toHaveScreenshot({ fullPage: true })
  })

  test('desktop-正常に登録&退会ができる', async ({
    page,
    browserName,
    context,
  }) => {
    if (browserName !== 'chromium') return

    const emailPage = await context.newPage()
    await emailPage.goto('https://dropmail.me/ja/')
    const email = await emailPage.locator('.address').first().innerText()

    await page.getByLabel('ニックネーム').fill(`register-test`)
    await page.getByLabel('メールアドレス').fill(email)
    await page.getByLabel('パスワード', { exact: true }).fill('pass0000')
    await page.getByRole('button', { name: '登録する' }).click()

    // // TODO 確認ページ作る
    await expect(page).toHaveURL('/signin')

    const pagePromise = context.waitForEvent('page')
    await emailPage
      .getByRole('link', { name: 'redirect.sleep-predictor.com' })
      .click()

    const newPage = await pagePromise
    await expect(newPage).toHaveURL('/home')

    await deleteAccount(newPage)
    await expect(newPage).toHaveURL('/')
  })
})
