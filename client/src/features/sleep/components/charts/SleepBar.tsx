'use client'

import { forwardRef, memo } from 'react'
import { Box, BoxProps, useColorModeValue } from '@/components/chakra'

type Props = {
  isHovered: boolean
  barColor?: 'brand' | 'blue'
}

const SleepBar = memo(
  forwardRef<HTMLDivElement, Props & BoxProps>(
    ({ isHovered, barColor = 'brand', ...rest }, ref) => {
      const hoveredBg = useColorModeValue(`${barColor}.400`, `${barColor}.400`)

      return (
        <Box
          ref={ref}
          bg={
            isHovered
              ? hoveredBg
              : barColor === 'brand'
              ? 'chartBrand'
              : 'chartBlue'
          }
          boxShadow={isHovered ? 'md' : 'none'}
          borderRadius="md"
          {...rest}
        />
      )
    }
  )
)

SleepBar.displayName = 'SleepBar'
export default SleepBar
