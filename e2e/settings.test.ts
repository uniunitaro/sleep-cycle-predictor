import { authedTest, expect } from './setup/fixtures'
import { setFullViewport } from './utils/setFullViewport'

authedTest.describe('settings', () => {
  authedTest.beforeEach(async ({ page }) => {
    await page.goto('/settings', { waitUntil: 'networkidle' })
  })

  authedTest('正しいタイトルがある', async ({ page }) => {
    await expect(page).toHaveTitle(/設定/)
  })

  authedTest('VRT', async ({ page }) => {
    await page.getByRole('textbox', { name: 'メールアドレス' }).fill('dummy')

    await setFullViewport(page, page.getByTestId('scrollContainer'))

    await expect.soft(page).toHaveScreenshot({ fullPage: true })
  })

  authedTest('ニックネームが変更できる', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ニックネーム' }).fill('変更名前')
    await page.getByRole('button', { name: 'ニックネームを変更' }).click()
    await page.getByText('正常に更新されました').waitFor()
    await page.reload()

    await expect(page.getByPlaceholder('変更名前')).toBeVisible()

    await page.getByRole('textbox', { name: 'ニックネーム' }).fill('E2E太郎')
    await page.getByRole('button', { name: 'ニックネームを変更' }).click()
    await page.getByText('正常に更新されました').waitFor()
  })

  authedTest('パスワードが変更できる', async ({ page }) => {
    await page.getByRole('textbox', { name: 'パスワード' }).fill('pass00001')
    await page.getByRole('button', { name: 'パスワードを変更' }).click()
    await expect(page.getByText('正常に更新されました')).toBeVisible()

    await page.getByRole('textbox', { name: 'パスワード' }).fill('pass0000')
    await page.getByRole('button', { name: 'パスワードを変更' }).click()
    await page.getByText('正常に更新されました').waitFor()
  })

  authedTest.skip(
    '睡眠予測に使用する睡眠データの期間が変更できる',
    async ({ page }) => {
      await page
        .getByRole('combobox', { name: '睡眠予測に使用する睡眠データの期間' })
        .selectOption('直近1週間')
      await page.waitForTimeout(500)
      await page.reload()

      await expect(
        page.getByRole('combobox', {
          name: '睡眠予測に使用する睡眠データの期間',
        })
      ).toHaveValue('week1')

      await page
        .getByRole('combobox', { name: '睡眠予測に使用する睡眠データの期間' })
        .selectOption('直近1年')
      await page.waitForTimeout(500)
    }
  )
})
