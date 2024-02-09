import { chromium } from '@playwright/test'

const cron = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ serviceWorkers: 'block' })
  const page = await context.newPage()
  await page.goto('https://www.sleep-predictor.com/signin')

  await page.waitForTimeout(3000)

  await page.getByLabel('メールアドレス').fill('cpzkkbeh@flymail.tk')
  await page.getByLabel('パスワード', { exact: true }).fill('pass0000')
  await page.getByRole('button', { name: 'メールアドレスでログイン' }).click()

  await page.waitForURL('https://www.sleep-predictor.com/home')

  await page.waitForTimeout(3000)

  await page.getByRole('button', { name: '睡眠記録を追加' }).click()
  await page.getByRole('dialog').waitFor()
  await page.getByRole('button', { name: '追加する' }).click()

  await page.waitForTimeout(3000)

  await browser.close()
}

cron()
