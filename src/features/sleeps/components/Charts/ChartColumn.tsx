import { Box, BoxProps, Center, useColorModeValue } from '@chakra-ui/react'
import { format, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FC, memo } from 'react'

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
    const dateRed = useColorModeValue('red.700', 'red.200')
    const dateBlue = useColorModeValue('blue.700', 'blue.200')

    const day = getDay(date)
    const dateColor = day === 0 ? dateRed : day === 6 ? dateBlue : undefined
    const dayColor = day === 0 ? dayRed : day === 6 ? dayBlue : 'secondaryText'

    return (
      <Box
        minW={`${colMinWidth}px`}
        display="flex"
        flexDirection="column"
        {...rest}
      >
        <Center h={`${headerHeight}px`} flexDirection="column">
          <Box color={dateColor}>{format(date, 'd')}</Box>
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
