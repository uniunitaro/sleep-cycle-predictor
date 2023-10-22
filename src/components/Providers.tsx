'use client'

import { FC, ReactNode } from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { theme } from '@/libs/chakraTheme'
import { useSystemColorModeAtom } from '@/atoms/colorMode'

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  const useSystemColorMode = useAtomValue(useSystemColorModeAtom)
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={{ ...theme, config: { ...theme.config, useSystemColorMode } }}
      >
        {children}
      </ChakraProvider>
    </>
  )
}

export default Providers
