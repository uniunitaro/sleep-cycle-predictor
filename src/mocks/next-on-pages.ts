// HACK: おそらくnext-on-pages自体にバグがありインポートがうまくできないためモックを作成

export const getRequestContext = () => ({
  ctx: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    waitUntil: () => {},
  },
})
