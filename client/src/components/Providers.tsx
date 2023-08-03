'use client'

import { FC, ReactNode } from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from '@/libs/chakraTheme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <ColorModeScript />
      <QueryClientProvider client={queryClient}>
        {/* <CacheProvider> */}
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        {/* </CacheProvider> */}
      </QueryClientProvider>
    </>
  )
}

export default Providers
