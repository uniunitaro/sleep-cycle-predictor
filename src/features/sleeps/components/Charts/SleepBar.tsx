import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { FC, memo } from 'react'

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
