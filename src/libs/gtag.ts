export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

export const pageView = (path: string) => {
  // @ts-expect-error ignore
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
