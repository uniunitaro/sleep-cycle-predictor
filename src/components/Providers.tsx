'use client'

import { FC, ReactNode } from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from '@/libs/chakraTheme'

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </>
  )
}

export default Providers
