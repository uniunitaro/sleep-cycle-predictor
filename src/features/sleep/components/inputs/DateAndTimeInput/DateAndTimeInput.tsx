'use client'

import { FC, memo, useCallback } from 'react'
import { getHours, getMinutes, setHours, setMinutes } from 'date-fns'
import TimeInput from '../TimeInput/TimeInput'
import DateInput from '../DateInput/DateInput'
import { Box, HStack } from '@/components/chakra'

const DateAndTimeInput: FC<{
  value: Date
  labelledBy?: string
  onChange: (value: Date) => void
}> = memo(({ value, labelledBy, onChange }) => {
  const handleChangeDate = useCallback(
    (date: Date) => {
      const dateTimeValue = setHours(
        setMinutes(date, getMinutes(value)),
        getHours(value)
      )
      onChange(dateTimeValue)
    },
    [onChange, value]
  )

  const handleChangeTime = useCallback(
    (time: Date) => {
      const dateTimeValue = setHours(
        setMinutes(value, getMinutes(time)),
        getHours(time)
      )
      onChange(dateTimeValue)
    },
    [onChange, value]
  )

  return (
    <HStack w="100%">
      <Box flex="1">
        <DateInput
          value={value}
          onChange={handleChangeDate}
          aria-labelledby={labelledBy}
        />
      </Box>
      <Box flex="1">
        <TimeInput
          value={value}
          onChange={handleChangeTime}
          aria-labelledby={labelledBy}
        />
      </Box>
    </HStack>
  )
})

DateAndTimeInput.displayName = 'DateAndTimeInput'
export default DateAndTimeInput
