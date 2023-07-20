'use client'

import { FC, memo } from 'react'
import { Box, BoxProps, useColorModeValue } from '@/app/_components/chakra'

type Props = {
  isHovered: boolean
  barColor?: 'brand' | 'blue'
}

const SleepBar: FC<Props & BoxProps> = memo(
  ({ isHovered, barColor = 'brand', ...rest }) => {
    const bg = useColorModeValue(`${barColor}.300`, `${barColor}.500`)
    const hoveredBg = useColorModeValue(`${barColor}.400`, `${barColor}.400`)

    return (
      <Box
        bg={isHovered ? hoveredBg : bg}
        boxShadow={isHovered ? 'md' : 'none'}
        borderRadius="md"
        {...rest}
      />
    )
  }
)

SleepBar.displayName = 'SleepBar'
export default SleepBar
