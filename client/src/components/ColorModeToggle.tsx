'use client'

import { FC } from 'react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, useColorMode } from './chakra'

const ColorModeToggle: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      aria-label="ダークモードを切り替え"
      variant="ghost"
      onClick={toggleColorMode}
    />
  )
}

export default ColorModeToggle
