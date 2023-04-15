import { Box, BoxProps, forwardRef, useColorModeValue } from '@chakra-ui/react'
import { FC, memo } from 'react'

type Props = {
  isHovered: boolean
}

const SleepBar: FC<Props & BoxProps> = memo(({ isHovered, ...rest }) => {
  const bg = useColorModeValue('brand.300', 'brand.500')
  const hoveredBg = useColorModeValue('brand.400', 'brand.400')

  return (
    <Box
      bg={isHovered ? hoveredBg : bg}
      boxShadow={isHovered ? 'md' : 'none'}
      borderRadius="md"
      {...rest}
    />
  )
})

SleepBar.displayName = 'SleepBar'
export default SleepBar
