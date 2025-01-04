import { expect, test } from '@playwright/test'

test.describe('index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('正しいタイトルがある', async ({ page }) => {
    await expect(page).toHaveTitle('Sleep Predictor')
  })

  test('会員登録リンクがあり、押下すると登録ページに遷移する', async ({
    page,
  }) => {
    await page.getByRole('link', { name: '無料ではじめる' }).click()
    await expect(page).toHaveURL('/signup')
  })
})
