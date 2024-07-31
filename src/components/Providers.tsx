'use client'

import { FC, ReactNode } from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { theme } from '@/libs/chakraTheme'
import { useSystemColorModeAtom } from '@/atoms/colorMode'
import {
  CUSTOM_LOCAL_STORAGE_KEY,
  customLocalStorageManager,
} from '@/libs/chakraStorageManager'

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  const useSystemColorMode = useAtomValue(useSystemColorModeAtom)
  return (
    <>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
        storageKey={CUSTOM_LOCAL_STORAGE_KEY}
      />
      <ChakraProvider
        theme={{ ...theme, config: { ...theme.config, useSystemColorMode } }}
        colorModeManager={customLocalStorageManager}
      >
        {children}
      </ChakraProvider>
    </>
  )
}

export default Providers
