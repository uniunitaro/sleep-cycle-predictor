'use client'

import { forwardRef } from 'react'
import { Input, InputProps, useColorModeValue } from '@/components/chakra'

type Props = {
  isSelected?: boolean
  isReadOnly?: boolean
} & InputProps
const HourMinuteInput = forwardRef<HTMLInputElement, Props>(
  ({ isSelected, isReadOnly, ...rest }, ref) => {
    const bgColorSelected = useColorModeValue('brand.100', 'brand.700')
    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

    return (
      <Input
        ref={ref}
        backgroundColor={isSelected ? bgColorSelected : bgColor}
        textAlign="center"
        w="20"
        h="16"
        rounded="lg"
        fontSize="4xl"
        isReadOnly={isReadOnly}
        _focusVisible={isReadOnly ? { borderColor: 'inherit' } : undefined}
        inputMode="numeric"
        maxLength={2}
        {...rest}
      />
    )
  }
)

HourMinuteInput.displayName = 'HourMinuteInput'
export default HourMinuteInput
