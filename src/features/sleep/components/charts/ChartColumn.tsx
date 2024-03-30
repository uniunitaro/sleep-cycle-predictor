'use client'

import { format, getDay, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FC, memo } from 'react'
import { Box, BoxProps, Center } from '@chakra-ui/react'

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
          <Box
            color={isToday(date) ? 'chakra-inverse-text' : dayColor}
            bgColor={isToday(date) ? 'buttonBrand' : undefined}
            borderRadius="full"
            w="24px"
            h="24px"
            textAlign="center"
          >
            {format(date, 'd')}
          </Box>
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
