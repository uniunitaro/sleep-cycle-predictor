import { test, expect } from '@playwright/test'

test('正しいタイトルがある', async ({ page }) => {
  await page.goto('')
  await expect(page).toHaveTitle('Sleep Predictor')
})

test('会員登録リンクがあり、押下すると登録ページに遷移する', async ({
  page,
}) => {
  await page.goto('')
  await page.getByRole('link', { name: '無料ではじめる' }).click()
  await expect(page).toHaveURL('/signup')
})

test('VRT', async ({ page }) => {
  await page.goto('')
  await expect(page).toHaveScreenshot()
})
