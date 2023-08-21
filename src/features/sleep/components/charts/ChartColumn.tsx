'use client'

import { format, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FC, memo } from 'react'
import { Box, BoxProps, Center } from '@/components/chakra'

type Props = {
  date: Date
  headerHeight?: number
  colMinWidth?: number
  children: React.ReactNode
}

const ChartColumn: FC<Props & BoxProps> = memo(
  ({ date, headerHeight = 48, colMinWidth = 24, children, ...rest }) => {
    const day = getDay(date)
    const dayColor =
      day === 0 ? 'dayRed' : day === 6 ? 'dayBlue' : 'secondaryGray'

    return (
      <Box
        minW={`${colMinWidth}px`}
        display="flex"
        flexDirection="column"
        userSelect="none"
        {...rest}
      >
        <Center h={`${headerHeight}px`} flexDirection="column">
          <Box color={dayColor}>{format(date, 'd')}</Box>
          <Box fontSize="xs" color={dayColor}>
            {format(date, 'EEEEEE', { locale: ja })}
          </Box>
        </Center>
        {children}
      </Box>
    )
  }
)

ChartColumn.displayName = 'ChartColumn'
export default ChartColumn
