'use client'

import { format, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FC, memo } from 'react'
import {
  Box,
  BoxProps,
  Center,
  useColorModeValue,
} from '@/app/_components/chakra'

type Props = {
  date: Date
  headerHeight?: number
  colMinWidth?: number
  children: React.ReactNode
}

const ChartColumn: FC<Props & BoxProps> = memo(
  ({ date, headerHeight = 48, colMinWidth = 16, children, ...rest }) => {
    const dayRed = useColorModeValue('red.600', 'red.300')
    const dayBlue = useColorModeValue('blue.600', 'blue.300')

    const day = getDay(date)
    const dayColor = day === 0 ? dayRed : day === 6 ? dayBlue : 'secondaryGray'

    return (
      <Box
        minW={`${colMinWidth}px`}
        display="flex"
        flexDirection="column"
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
