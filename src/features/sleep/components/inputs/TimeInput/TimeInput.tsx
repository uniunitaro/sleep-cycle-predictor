'use client'

import { FC, memo, useRef } from 'react'
import MobileTimeInput from '../MobileTimeInput'
import { Box, HStack, Hide, Input, InputProps, Show } from '@/components/chakra'
import { useTimeInput } from '@/features/sleep/hooks/useTimeInput'

type Props = {
  value: Date
  labelText?: string
  onChange: (value: Date) => void
} & Omit<InputProps, 'value' | 'onChange'>

const TimeInput: FC<Props> = memo(({ value, labelText, onChange, ...rest }) => {
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const {
    hour,
    minute,
    handleChangeHour,
    handleChangeMinute,
    setAndReturnValidTime,
  } = useTimeInput({ date: value, hourRef, minuteRef })

  const handleBlurTime = () => {
    const parsedDate = setAndReturnValidTime()
    if (parsedDate) {
      onChange(parsedDate)
    }
  }

  return (
    <>
      <Show above="md">
        <HStack align="baseline" spacing="1">
          <Input
            ref={hourRef}
            value={hour}
            onChange={handleChangeHour}
            onBlur={handleBlurTime}
            onFocus={(e) => e.target.select()}
            aria-label={labelText ? labelText + ' 時間' : '時間'}
            maxLength={2}
            {...rest}
          />
          <Box fontSize="xl" aria-hidden>
            :
          </Box>
          <Input
            ref={minuteRef}
            value={minute}
            onChange={handleChangeMinute}
            onBlur={handleBlurTime}
            onFocus={(e) => e.target.select()}
            aria-label={labelText ? labelText + ' 分' : '分'}
            maxLength={2}
            {...rest}
          />
        </HStack>
      </Show>
      <Hide above="md">
        <MobileTimeInput
          value={value}
          ariaLabel={labelText ? labelText + ' 時間' : '時間'}
          onChange={onChange}
        />
      </Hide>
    </>
  )
})

TimeInput.displayName = 'TimeInput'
export default TimeInput
