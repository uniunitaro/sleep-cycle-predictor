'use client'

import { useColorMode } from '@chakra-ui/react'
import { FC, useEffect } from 'react'

const ThemeColorManager: FC = () => {
  const { colorMode } = useColorMode()
  useEffect(() => {
    const existingMeta = document.querySelector('meta[name="theme-color"]')
    if (existingMeta) {
      existingMeta.setAttribute(
        'content',
        colorMode === 'light' ? '#f7f9f7' : '#1a202c'
      )
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = colorMode === 'light' ? '#f7f9f7' : '#1a202c'
      document.head.appendChild(meta)
    }
  }, [colorMode])

  return null
}

export default ThemeColorManager
