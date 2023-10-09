'use client'

import { format, isValid, parse } from 'date-fns'
import { FC, memo, useState } from 'react'
import MobileTimeInput from '../MobileTimeInput'
import { Box, HStack, Hide, Input, InputProps, Show } from '@/components/chakra'

type Props = {
  value: Date
  labelText?: string
  onChange: (value: Date) => void
} & Omit<InputProps, 'value' | 'onChange'>

const TimeInput: FC<Props> = memo(({ value, labelText, onChange, ...rest }) => {
  const formatted = format(value, 'HH:mm')
  const [hour, setHour] = useState(formatted.split(':')[0])
  const [minute, setMinute] = useState(formatted.split(':')[1])

  const [oldValue, setOldValue] = useState(value)

  const handleChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHour(e.target.value)
  }
  const handleChangeMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinute(e.target.value)
  }

  const handleBlurDate = () => {
    const parsedDate = parse(`${hour}:${minute}`, 'HH:mm', new Date())
    if (!isValid(parsedDate)) {
      setHour(format(oldValue, 'HH'))
      setMinute(format(oldValue, 'mm'))
      return
    }

    setHour(format(parsedDate, 'HH'))
    setMinute(format(parsedDate, 'mm'))
    onChange(parsedDate)
    setOldValue(parsedDate)
  }

  return (
    <>
      <Show above="md">
        <HStack align="baseline" spacing="1">
          <Input
            value={hour}
            onChange={handleChangeHour}
            onBlur={handleBlurDate}
            onFocus={(e) => e.target.select()}
            aria-label={labelText ? labelText + ' 時間' : '時間'}
            {...rest}
          />
          <Box fontSize="xl" aria-hidden>
            :
          </Box>
          <Input
            value={minute}
            onChange={handleChangeMinute}
            onBlur={handleBlurDate}
            onFocus={(e) => e.target.select()}
            aria-label={labelText ? labelText + ' 分' : '分'}
            {...rest}
          />
        </HStack>
      </Show>
      <Hide above="md">
        <MobileTimeInput
          value={value}
          aria-label={labelText ? labelText + ' 時間' : '時間'}
          onChange={onChange}
        />
      </Hide>
    </>
  )
})

TimeInput.displayName = 'TimeInput'
export default TimeInput
