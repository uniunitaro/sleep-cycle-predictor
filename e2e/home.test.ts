import { authedTest, expect } from './setup/fixtures'

/*
サーバー側のDateには関与できないので一年ごとに書き換える苦肉の策をとる
${currentYear}-01-01でsleepsの表示を確認し、${nextYear}-01-01でpredictionsの表示を確認する
*/

authedTest.describe('home', () => {
  authedTest.describe('date指定なし', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home', { waitUntil: 'networkidle' })
    })

    authedTest('正しいタイトルがある', async ({ page }) => {
      await expect(page).toHaveTitle(/ホーム/)
    })

    authedTest('今月が表示されている', async ({ page }) => {
      const currentMonth = `${new Date().getMonth() + 1}月`
      await expect(
        page.getByRole('heading', { name: currentMonth })
      ).toBeVisible()
    })
  })

  authedTest.describe('date: ${currentYear}-01-01', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01', { waitUntil: 'networkidle' })
    })

    authedTest('VRT-sleeps', async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true })
    })

    authedTest.describe('desktop', () => {
      authedTest('表示形式が切り替えられる', async ({ page }) => {
        await page.getByLabel('表示形式の切り替え').selectOption('週')
        await page.waitForURL(/displayMode=week/)
      })
    })

    // authedTest('睡眠の新規作成ができる', async ({ page }) => {
    //   await page.getByRole('button', { name: '睡眠記録を追加' }).click()
    //   await page.getByRole('dialog').waitFor()
    // })
  })

  authedTest.describe('date: ${nextYear}-01-01', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2024-01-01', { waitUntil: 'networkidle' })
    })
    authedTest('VRT-predictions', async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true })
    })
  })

  authedTest.describe('displayMode: month', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01&displayMode=month', {
        waitUntil: 'networkidle',
      })
    })

    authedTest('VRT', async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true })
    })
    authedTest('月の切り替えができる', async ({ page }) => {
      await page.getByRole('link', { name: '次の月を表示' }).click()
      await page.waitForURL(/date=2023-02-01/)
      await page.getByRole('link', { name: '前の月を表示' }).click()
      await page.waitForURL(/date=2023-01-01/)
    })
  })

  authedTest.describe('displayMode: week', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01&displayMode=week', {
        waitUntil: 'networkidle',
      })
    })

    authedTest('VRT', async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true })
    })
    authedTest('週の切り替えができる', async ({ page }) => {
      await page.getByRole('link', { name: '次の週を表示' }).click()
      await page.waitForURL(/date=2023-01-08/)
      await page.getByRole('link', { name: '前の週を表示' }).click()
      await page.waitForURL(/date=2023-01-01/)
    })
  })

  authedTest.describe('mobile-displayMode: list', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01&displayMode=list', {
        waitUntil: 'networkidle',
      })
    })

    authedTest('VRT', async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true })
    })
    authedTest('月の切り替えができる', async ({ page }) => {
      await page.getByRole('link', { name: '次の月を表示' }).click()
      await page.waitForURL(/date=2023-02-01/)
      await page.getByRole('link', { name: '前の月を表示' }).click()
      await page.waitForURL(/date=2023-01-01/)
    })
  })
})
