import { Locator, Page } from '@playwright/test'

export const setFullViewport = async (page: Page, locator: Locator) => {
  const currentViewport = page.viewportSize()
  if (!currentViewport) {
    throw new Error('Viewport size is not set')
  }

  const pixelAmountRenderedOffscreen = await locator.evaluate(
    (node) => node.scrollHeight - node.clientHeight
  )

  await page.setViewportSize({
    width: currentViewport.width,
    height: currentViewport.height + pixelAmountRenderedOffscreen,
  })
}
