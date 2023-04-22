import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material'
import { theme } from '@/libs/chakraTheme'
import { initAuth } from '@/libs/firebase'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import ThemeColorWrapper from '@/components/ThemeColorWrapper'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

initAuth()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const MuiTheme = (colorMode: 'light' | 'dark') =>
  createTheme({
    palette: {
      primary: {
        main: colorMode === 'light' ? '#38A169' : '#9AE6B4',
      },
    },
  })

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const colorMode =
    (typeof window !== 'undefined' &&
      (window.localStorage.getItem('chakra-ui-color-mode') as
        | 'light'
        | 'dark')) ||
    'light'

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MuiTheme(colorMode)}>
          <ChakraProvider theme={theme}>
            <ThemeColorWrapper>
              {getLayout(<Component {...pageProps} />)}
            </ThemeColorWrapper>
          </ChakraProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
