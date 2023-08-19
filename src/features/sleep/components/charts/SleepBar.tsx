'use client'

import { forwardRef, memo } from 'react'
import {
  Box,
  BoxProps,
  useColorModeValue,
  useMediaQuery,
} from '@/components/chakra'

type Props = {
  isHoveredOrSelected: boolean
  barColor?: 'brand' | 'blue'
}

const SleepBar = memo(
  forwardRef<HTMLDivElement, Props & BoxProps>(
    ({ isHoveredOrSelected, barColor = 'brand', ...rest }, ref) => {
      const hoveredBg = useColorModeValue(`${barColor}.400`, `${barColor}.400`)
      const [isTouchDevice] = useMediaQuery(
        '(hover: none) and (pointer: coarse)'
      )

      return (
        <Box
          ref={ref}
          bg={
            isHoveredOrSelected && !isTouchDevice
              ? hoveredBg
              : barColor === 'brand'
              ? 'chartBrand'
              : 'chartBlue'
          }
          boxShadow={isHoveredOrSelected ? 'md' : 'none'}
          borderRadius="md"
          sx={{
            WebkitTapHighlightColor: 'transparent',
          }}
          {...rest}
        />
      )
    }
  )
)

SleepBar.displayName = 'SleepBar'
export default SleepBar
