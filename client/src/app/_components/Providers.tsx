'use client'

import { FC, ReactNode } from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/libs/chakraTheme'
import { initAuth } from '@/libs/firebase'

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  initAuth()

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
