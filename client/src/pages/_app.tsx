import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from '@/libs/chakraTheme'
import { initAuth } from '@/libs/firebase'
import ThemeColorWrapper from '@/components/ThemeColorWrapper'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

initAuth()

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ThemeColorWrapper>
            {getLayout(<Component {...pageProps} />)}
          </ThemeColorWrapper>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  )
}
