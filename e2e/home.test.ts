import path from 'path'
import { authedTest, expect } from './setup/fixtures'

/*
サーバー側のDateには関与できないので10年ごとに書き換える苦肉の策をとる
2023-01-01でsleepsの表示を確認し、2033-01-01でpredictionsの表示を確認する

setupで01-01 ~ 01-04の睡眠が作成されている
*/

authedTest.beforeEach(async ({ context }) => {
  await context.addInitScript({
    path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
  })

  await context.addInitScript(() => {
    window.sinon.useFakeTimers({
      now: new Date(2023, 0, 10),
      toFake: ['Date'],
    })
  })
})

authedTest.describe('home', () => {
  authedTest.describe('date指定なし', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home', { waitUntil: 'networkidle' })
    })

    authedTest('正しいタイトルがある', async ({ page }) => {
      await expect(page).toHaveTitle(/ホーム/)
    })

    authedTest('クライアントにおける今月が表示されている', async ({ page }) => {
      // fakeTimerで2023/01/10を指定しているので、今月は1月
      await expect(page.getByRole('heading', { name: '1月' })).toBeVisible()
    })
  })

  authedTest.describe('date: 2023-01-01', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01', { waitUntil: 'networkidle' })
    })

    authedTest.describe('desktop', () => {
      authedTest('表示形式が切り替えられる', async ({ page }) => {
        await page.getByLabel('表示形式の切り替え').selectOption('週')
        await page.waitForURL(/displayMode=week/)
      })

      authedTest('睡眠作成・編集・削除', async ({ page }) => {
        await authedTest.step('睡眠の新規作成ができる', async () => {
          await page.getByRole('button', { name: '睡眠記録を追加' }).click()
          await page.getByRole('dialog').waitFor()

          await page
            .getByRole('textbox', { name: '就寝日時 日付' })
            .fill('2023/01/05')
          await page.getByRole('textbox', { name: '就寝日時 時間' }).fill('13')
          await page.getByRole('textbox', { name: '就寝日時 分' }).fill('00')
          await page
            .getByRole('textbox', { name: '起床日時 日付' })
            .fill('2023/01/06')
          await page.getByRole('textbox', { name: '起床日時 時間' }).fill('02')
          await page.getByRole('textbox', { name: '起床日時 分' }).fill('00')

          // 日付選択popoverを表示してVRT
          await page.getByRole('textbox', { name: '就寝日時 日付' }).click()

          // 日付選択popoverを閉じる
          await page.keyboard.press('Tab')

          await page.getByRole('button', { name: '追加する' }).click()

          await expect(
            page.getByRole('listitem').filter({ hasText: '過去の睡眠' })
          ).toContainText(['5日'])
        })

        await authedTest.step('睡眠の編集ができる', async () => {
          await page
            .getByRole('listitem')
            .filter({ hasText: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()

          await page.getByRole('menuitem', { name: '睡眠記録を編集' }).click()

          await page.getByRole('dialog').waitFor()

          await page.getByRole('textbox', { name: '就寝日時 時間' }).fill('14')

          await page.getByRole('button', { name: '更新する' }).click()

          await expect(
            page
              .getByRole('listitem')
              .filter({ hasText: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toContainText('14:00')
        })

        await authedTest.step('睡眠の削除ができる', async () => {
          await page
            .getByRole('listitem')
            .filter({ hasText: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()

          await page.getByRole('menuitem', { name: '睡眠記録を削除' }).click()

          await page.getByRole('alertdialog').waitFor()

          await page.getByRole('button', { name: '削除する' }).click()

          // ダイアログが閉じるまで待つ
          await expect(page.getByRole('alertdialog')).toHaveCount(0)

          await expect(
            page
              .getByRole('listitem')
              .filter({ hasText: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toHaveCount(0)
        })
      })

      authedTest('分割睡眠作成・編集・削除', async ({ page }) => {
        await authedTest.step('分割睡眠の新規作成ができる', async () => {
          await page.getByRole('button', { name: '睡眠記録を追加' }).click()
          await page.getByRole('dialog').waitFor()

          await page
            .getByRole('textbox', { name: '就寝日時 日付' })
            .fill('2023/01/05')
          await page.getByRole('textbox', { name: '就寝日時 時間' }).fill('13')
          await page.getByRole('textbox', { name: '就寝日時 分' }).fill('00')
          await page
            .getByRole('textbox', { name: '起床日時 日付' })
            .fill('2023/01/06')
          await page.getByRole('textbox', { name: '起床日時 時間' }).fill('02')
          await page.getByRole('textbox', { name: '起床日時 分' }).fill('00')

          await page.getByRole('button', { name: '分割睡眠を追加' }).click()

          await page
            .getByRole('textbox', { name: '睡眠2 就寝日時 日付' })
            .fill('2023/01/06')
          await page
            .getByRole('textbox', { name: '睡眠2 就寝日時 時間' })
            .fill('3')
          await page
            .getByRole('textbox', { name: '睡眠2 就寝日時 分' })
            .fill('00')
          await page
            .getByRole('textbox', { name: '睡眠2 起床日時 日付' })
            .fill('2023/01/06')
          await page
            .getByRole('textbox', { name: '睡眠2 起床日時 時間' })
            .fill('05')
          await page
            .getByRole('textbox', { name: '睡眠2 起床日時 分' })
            .fill('00')

          await page.getByRole('button', { name: '追加する' }).click()

          await expect(
            page
              .getByRole('listitem')
              .filter({ hasText: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toContainText('3:00')
        })

        await authedTest.step('分割睡眠の編集ができる', async () => {
          await page
            .getByRole('listitem')
            .filter({ hasText: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()
          await page.getByRole('menuitem', { name: '睡眠記録を編集' }).click()

          await page.getByRole('dialog').waitFor()
          await page
            .getByRole('textbox', { name: '睡眠2 就寝日時 時間' })
            .fill('4')

          await page.getByRole('button', { name: '更新する' }).click()

          await expect(
            page
              .getByRole('listitem')
              .filter({ hasText: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toContainText('4:00')
        })

        await authedTest.step('分割睡眠の削除ができる', async () => {
          await page
            .getByRole('listitem')
            .filter({ hasText: '過去の睡眠' })
            .filter({ hasText: '5日' })
            .getByRole('button', { name: '詳細' })
            .click()

          await page.getByRole('menuitem', { name: '睡眠記録を削除' }).click()

          await page.getByRole('alertdialog').waitFor()

          await page.getByRole('button', { name: '削除する' }).click()

          // ダイアログが閉じるまで待つ
          await expect(page.getByRole('alertdialog')).toHaveCount(0)

          await expect(
            page
              .getByRole('listitem')
              .filter({ hasText: '過去の睡眠' })
              .filter({ hasText: '5日' })
          ).toHaveCount(0)
        })
      })

      authedTest(
        '睡眠作成時に過去の睡眠と重複する場合はエラーが出る',
        async ({ page }) => {
          await page.getByRole('button', { name: '睡眠記録を追加' }).click()
          await page.getByRole('dialog').waitFor()
          await page
            .getByRole('textbox', { name: '就寝日時 日付' })
            .fill('2023/01/04')
          await page.getByRole('textbox', { name: '就寝日時 時間' }).fill('08')
          await page.getByRole('textbox', { name: '就寝日時 分' }).fill('00')
          await page
            .getByRole('textbox', { name: '起床日時 日付' })
            .fill('2023/01/04')
          await page.getByRole('textbox', { name: '起床日時 時間' }).fill('15')
          await page.getByRole('textbox', { name: '起床日時 分' }).fill('00')

          await page.getByRole('button', { name: '追加する' }).click()

          await expect(page.getByRole('alert')).toContainText('重複しています')
        }
      )

      authedTest(
        '睡眠作成時に過去の睡眠との間隔が8時間以内の場合はアラートが出る',
        async ({ page }) => {
          await page.getByRole('button', { name: '睡眠記録を追加' }).click()
          await page.getByRole('dialog').waitFor()
          await page
            .getByRole('textbox', { name: '就寝日時 日付' })
            .fill('2023/01/04')
          await page.getByRole('textbox', { name: '就寝日時 時間' }).fill('22')
          await page.getByRole('textbox', { name: '就寝日時 分' }).fill('00')
          await page
            .getByRole('textbox', { name: '起床日時 日付' })
            .fill('2023/01/04')
          await page.getByRole('textbox', { name: '起床日時 時間' }).fill('23')
          await page.getByRole('textbox', { name: '起床日時 分' }).fill('00')

          await page.getByRole('button', { name: '追加する' }).click()

          await expect(page.getByRole('alertdialog')).toContainText(
            '間隔が短い'
          )
        }
      )
    })

    authedTest('共有ができる', async ({ page }) => {
      await page.getByRole('button', { name: '共有' }).click()
      await page.getByRole('dialog').waitFor()

      await page.getByRole('button', { name: 'リンクをコピー' }).click()

      await expect(page.getByText('リンクをコピーしました')).toBeVisible()
    })

    authedTest('設定ページに遷移できる', async ({ page }) => {
      await page.getByRole('button', { name: 'アカウント' }).click()
      await page.getByRole('menuitem', { name: '設定' }).click()

      await page.waitForURL(/settings/)
    })

    authedTest('カラーモードを変更できる', async ({ page }) => {
      await page.getByRole('button', { name: 'アカウント' }).click()

      await page.getByRole('menuitemradio', { name: 'ダークモード' }).click()

      await page.getByRole('menuitemradio', { name: 'ライトモード' }).click()

      await page
        .getByRole('menuitemradio', { name: 'システムのモード' })
        .click()
    })
  })

  authedTest.describe('mobile-date: 2023-01-01', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01&displayMode=list', {
        waitUntil: 'networkidle',
      })
    })

    authedTest('睡眠作成・編集・削除', async ({ page }) => {
      await authedTest.step('睡眠の新規作成ができる', async () => {
        await page.getByRole('button', { name: '睡眠記録を追加' }).click()
        await page.getByRole('dialog').waitFor()

        await page.getByRole('button', { name: '就寝日時 日付' }).click()
        await page
          .getByRole('dialog')
          .filter({ hasText: '2023年1月' })
          .waitFor()

        await page.getByRole('button', { name: '1月5日' }).click()

        await page.getByRole('button', { name: '就寝日時 時間' }).click()
        await page
          .getByRole('button', { name: 'キーボードで時刻を入力する' })
          .waitFor()

        await page
          .getByRole('button', { name: 'キーボードで時刻を入力する' })
          .click()

        await page.getByLabel('時間を入力').fill('13')
        await page.getByLabel('分を入力').fill('00')

        await page.getByRole('button', { name: 'OK' }).click()

        await page.getByRole('button', { name: '起床日時 日付' }).click()
        await page.getByRole('button', { name: '1月6日' }).click()

        await page.getByRole('button', { name: '起床日時 時間' }).click()
        await page.getByLabel('時間を入力').fill('02')
        await page.getByLabel('分を入力').fill('00')
        await page.getByRole('button', { name: 'OK' }).click()

        await page.getByRole('button', { name: '追加する' }).click()

        await expect(
          page.getByRole('listitem').filter({ hasText: '過去の睡眠' })
        ).toContainText(['5日'])
      })

      await authedTest.step('睡眠の編集ダイアログが表示される', async () => {
        await page
          .getByRole('listitem')
          .filter({ hasText: '過去の睡眠' })
          .filter({ hasText: '5日' })
          .getByRole('button')
          .click()
        await page.getByRole('dialog').waitFor()

        await page.getByRole('button', { name: '睡眠記録を編集' }).click()

        await expect(
          page.getByRole('dialog', { name: '睡眠記録を編集' })
        ).toBeVisible()

        await page.getByRole('button', { name: 'キャンセル' }).click()
      })

      await authedTest.step('睡眠の削除ができる', async () => {
        await page
          .getByRole('listitem')
          .filter({ hasText: '過去の睡眠' })
          .filter({ hasText: '5日' })
          .getByRole('button')
          .click()
        await page.getByRole('dialog').waitFor()

        await page.getByRole('button', { name: '睡眠記録を削除' }).click()

        await page.getByRole('button', { name: '削除する' }).click()

        await expect(page.getByRole('alertdialog')).toHaveCount(0)

        await expect(
          page
            .getByRole('listitem')
            .filter({ hasText: '過去の睡眠' })
            .filter({ hasText: '5日' })
        ).toHaveCount(0)
      })
    })
  })

  authedTest.describe('date: 2033-01-01', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2033-01-01', { waitUntil: 'networkidle' })
    })
  })

  authedTest.describe('displayMode: month', () => {
    authedTest.beforeEach(async ({ page }) => {
      await page.goto('/home?date=2023-01-01&displayMode=month', {
        waitUntil: 'networkidle',
      })
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

    authedTest('月の切り替えができる', async ({ page }) => {
      await page.getByRole('link', { name: '次の月を表示' }).click()
      await page.waitForURL(/date=2023-02-01/)
      await page.getByRole('link', { name: '前の月を表示' }).click()
      await page.waitForURL(/date=2023-01-01/)
    })
  })
})
