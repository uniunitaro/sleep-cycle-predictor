'use client'

import { useColorMode } from '@chakra-ui/react'
import { FC, useEffect } from 'react'

const ThemeColorManager: FC = () => {
  const { colorMode } = useColorMode()
  useEffect(() => {
    if (colorMode === 'light') {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', '#f7f9f7')
    } else {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', '#1a202c')
    }
  }, [colorMode])

  return null
}

export default ThemeColorManager
