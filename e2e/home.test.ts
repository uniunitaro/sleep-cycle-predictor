import { authedTest, expect } from './setup/fixtures'

/*
サーバー側のDateには関与できないので一年ごとに書き換える苦肉の策をとる
${currentYear}-01-01でsleepsの表示を確認し、${nextYear}-01-01でpredictionsの表示を確認する

setupで01-01 ~ 01-04の睡眠が作成されている
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

      authedTest.describe('睡眠作成・編集・削除', () => {
        authedTest('睡眠の新規作成ができる', async ({ page }) => {
          await page.getByRole('button', { name: '睡眠記録を追加' }).click()
          await page.getByRole('dialog').waitFor()

          await page.getByLabel('就寝日時 日付').fill('2023/01/05')
          await page.getByLabel('就寝日時 時間').fill('13')
          await page.getByLabel('就寝日時 分').fill('00')
          await page.getByLabel('起床日時 日付').fill('2023/01/06')
          await page.getByLabel('起床日時 時間').fill('02')
          await page.getByLabel('起床日時 分').fill('00')

          // 日付選択popoverを表示してVRT
          await page.getByLabel('就寝日時 日付').click()
          await expect(page).toHaveScreenshot({ fullPage: true })

          // 日付選択popoverを閉じる
          await page.keyboard.press('Tab')
          await expect(page).toHaveScreenshot({ fullPage: true })

          await page.getByRole('button', { name: '追加する' }).click()

          await expect(
            page.getByRole('listitem', { name: '過去の睡眠' })
          ).toContainText(['5日'])

          await expect(page).toHaveScreenshot({ fullPage: true })
        })

        authedTest('睡眠の編集ができる', async ({ page }) => {
          await page
            .getByRole('listitem', { name: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()
          await expect(page).toHaveScreenshot({ fullPage: true })

          await page.getByRole('menuitem', { name: '睡眠記録を編集' }).click()

          await page.getByRole('dialog').waitFor()

          await page.getByLabel('就寝日時 日付').fill('2023/01/05')
          await page.getByLabel('就寝日時 時間').fill('14')
          await page.getByLabel('就寝日時 分').fill('00')

          // 日付選択popoverを閉じる
          await page.getByLabel('睡眠記録を編集').click()
          await expect(page).toHaveScreenshot({ fullPage: true })

          await page.getByRole('button', { name: '更新する' }).click()

          await expect(
            page
              .getByRole('listitem', { name: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toContainText('14:00')
        })

        authedTest('睡眠の削除ができる', async ({ page }) => {
          await page
            .getByRole('listitem', { name: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()

          await page.getByRole('menuitem', { name: '睡眠記録を削除' }).click()

          await page.getByRole('alertdialog').waitFor()
          await expect(page).toHaveScreenshot({ fullPage: true })

          await page.getByRole('button', { name: '削除する' }).click()

          // ダイアログが閉じるまで待つ
          await expect(page.getByRole('alertdialog')).toHaveCount(0)

          await expect(
            page
              .getByRole('listitem', { name: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toHaveCount(0)
        })
      })
    })
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
